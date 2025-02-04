import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, Observable, Subject} from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

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

  constructor(private http: HttpClient) {}

// PUT request to confirm a notification
  acceptNotification(notificationId: string): Observable<void> {
    const url = `${this.baseUrl}user/notification/${notificationId}/confirm`;
    return this.http.put(url, {}, { withCredentials: true, responseType: 'text' as 'json' })
        .pipe(
            map(() => undefined),
            catchError((error) => {
              console.error('Error accepting notification:', error);
              if (error.status === 500) {
                // Handle 500 Internal Server Error
                console.error('Internal Server Error:', error.message);
              }
              throw error;  // Rethrow the error if needed
            })
        );
  }

// PUT request to reject a notification
  rejectNotification(notificationId: string): Observable<void> {
    const url = `${this.baseUrl}user/notification/${notificationId}/reject`;
    return this.http.put(url, {}, { withCredentials: true})
        .pipe(
            map(() => undefined),
            catchError((error) => {
              console.error('Error rejecting notification:', error);
              if (error.status === 500) {
                // Handle 500 Internal Server Error
                console.error('Internal Server Error:', error.message);
              }
              throw error;  // Rethrow the error if needed
            })
        );
  }

  // Private methods to perform HTTP requests
  getAdminNotifications(): Observable<AdminNotification[]> {
    return this.http.get<{ message: string; notifications: AdminNotification[] }>(this.adminNotificationsUrl, { withCredentials: true })
        .pipe(map(response => response.notifications));
  }

  getSpeakerRequests(): Observable<SpeakerRequest[]> {
    return this.http.get<{ message: string; requests: SpeakerRequest[] }>(this.speakerRequestsUrl, { withCredentials: true })
        .pipe(map(response => response.requests));
  }
}
