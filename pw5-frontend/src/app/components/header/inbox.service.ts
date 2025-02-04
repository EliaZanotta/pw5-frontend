import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, firstValueFrom, from, Observable, Subject} from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { EventsService, Event } from '../../pages/events/events.service';


export interface AdminNotification {
  id: string;
  type: string;
  message: string;
  timestamp: string;
  status: string;
  hostEmail: string;
  hostId: string;
  handledBy: string;
}

export interface SpeakerRequestWithEvent {
  id: string;
  speakerEmail: string;
  event: Event | undefined;
  status: string;
}

export interface SpeakerRequest {
  id: string;
  speakerEmail: string;
  eventId: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class InboxService {
  private baseUrl = 'http://localhost:8080/';
  private adminNotificationsUrl = this.baseUrl + 'user/notification/all';
  private speakerRequestsUrl = this.baseUrl + 'speaker-inbox/my-requests';

  constructor(private http: HttpClient, private eventsService: EventsService) {}

// PUT request to confirm a notification
  async acceptNotification(notificationId: string): Promise<void> {
    const url = `${this.baseUrl}user/notification/${notificationId}/confirm`;
    try {
      await firstValueFrom(
        this.http
          .put(url, {}, { withCredentials: true, responseType: 'text' as 'json' })
          .pipe(
            map(() => undefined)
          )
      );
    } catch (error: any) {
      console.error('Error accepting notification:', error);
      if (error.status === 500) {
        // Handle 500 Internal Server Error
        console.error('Internal Server Error:', error.message);
      }
      throw error; // Rethrow the error if needed
    }
  }

// PUT request to reject a notification
  async rejectNotification(notificationId: string): Promise<void> {
    const url = `${this.baseUrl}user/notification/${notificationId}/reject`;
    try {
      await firstValueFrom(
        this.http
          .put(url, {}, { withCredentials: true, responseType: 'text' as 'json' })
          .pipe(
            map(() => undefined)
          )
      );
    } catch (error: any) {
      console.error('Error rejecting notification:', error);
      if (error.status === 500) {
        // Handle 500 Internal Server Error
        console.error('Internal Server Error:', error.message);
      }
      throw error; // Rethrow the error if needed
    }
  }

  // Private methods to perform HTTP requests
  getAdminNotifications(): Observable<AdminNotification[]> {
    return this.http.get<{ message: string; notifications: AdminNotification[] }>(this.adminNotificationsUrl, { withCredentials: true })
        .pipe(map(response => response.notifications));
  }

  getSpeakerRequests(): Observable<SpeakerRequest[]> {
    return this.http
      .get<{ message: string; requests: SpeakerRequest[] }>(this.speakerRequestsUrl, { withCredentials: true })
      .pipe(map(response => response.requests));
  }
  // PUT request to confirm a speaker request
  confirmSpeakerRequest(requestId: string): Observable<void> {
    const url = `${this.baseUrl}speaker-inbox/${requestId}/confirm`;
    return this.http.put(url, {}, { withCredentials: true, responseType: 'text' as 'json' })
      .pipe(
        map(() => undefined),
        catchError((error) => {
          console.error('Error confirming speaker request:', error);
          throw error;
        })
      );
  }

  // PUT request to reject a speaker request
  rejectSpeakerRequest(requestId: string): Observable<void> {
    const url = `${this.baseUrl}speaker-inbox/${requestId}/reject`;
    return this.http.put(url, {}, { withCredentials: true, responseType: 'text' as 'json' })
      .pipe(
        map(() => undefined),
        catchError((error) => {
          console.error('Error rejecting speaker request:', error);
          throw error;
        })
      );
  }


  getSpeakerRequestsWithEventInfo(): Observable<SpeakerRequestWithEvent[]> {
    return this.getSpeakerRequests().pipe(
      switchMap((speakerRequests: SpeakerRequest[]) =>
        from(this.eventsService.getEvents()).pipe(
          map((allEventsResponse: any) => {
            // Ensure that we have an array of events.
            const allEvents: Event[] = Array.isArray(allEventsResponse)
              ? allEventsResponse
              : allEventsResponse.events;
            return speakerRequests.map(request => {
              const matchingEvent = allEvents.find(event => event.id === request.eventId);
              return {
                id: request.id,
                speakerEmail: request.speakerEmail,
                event: matchingEvent,
                status: request.status
              } as SpeakerRequestWithEvent;
            });
          })
        )
      )
    );
  }
}
