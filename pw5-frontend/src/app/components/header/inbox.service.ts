import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
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

  // Subjects to trigger updates
  private adminNotificationsSubject = new Subject<void>();
  private speakerRequestsSubject = new Subject<void>();

  constructor(private http: HttpClient) {}

  // Public observable streams to subscribe to
  getAdminNotificationsObservable(): Observable<AdminNotification[]> {
    return this.adminNotificationsSubject.asObservable().pipe(
        switchMap(() => this.getAdminNotifications())
    );
  }

  getSpeakerRequestsObservable(): Observable<SpeakerRequest[]> {
    return this.speakerRequestsSubject.asObservable().pipe(
        switchMap(() => this.getSpeakerRequests())
    );
  }

  // Trigger methods to fetch new data
  triggerAdminNotificationsFetch(): void {
    this.adminNotificationsSubject.next();
  }

  triggerSpeakerRequestsFetch(): void {
    this.speakerRequestsSubject.next();
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
