import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Event {
  id: string;
  startDate: string;
  endDate: string;
  place: string;
  speakers: Speaker[];
  topics: string[];
  host: string;
  title: string;
  status: string;
  pendingSpeakerRequests: PendingSpeakerRequest[];
  maxParticipants: number;
  registeredParticipants: number;
  ticketIds: string[];
  eventSubscription: string;
  image?: string;
  description?: string;
}

interface PendingSpeakerRequest {
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  hashedPsw: string | null;
  status: string | null;
  role: string | null;
  userDetails: UserDetails | null;
}

interface Speaker {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  hashedPsw: string;
  status: string;
  role: string;
  userDetails: UserDetails;
}

interface UserDetails {
  bookedEvents: string[];
  archivedEvents: string[];
  bookedTickets: string[];
  favouriteTopics: string[];
}

export interface CategorizedEvents {
  future: Event[];
  past: Event[];
}

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private baseUrl = 'http://localhost:8080/';
  private apiUrl = this.baseUrl + 'event';

  constructor(private http: HttpClient) { }

  // Updated to extract events from the response format
  getEvents(): Observable<Event[]> {
    return this.http.get<{ events: Event[] }>(this.apiUrl).pipe(
      map(response => response.events)
    );
  }

  // Updated method to get categorized events
  getCategorizedEvents(): Observable<CategorizedEvents> {
    return this.getEvents().pipe(
      map((events: Event[]) => this.categorizeEvents(events))
    );
  }

  // Private helper method to categorize events
  private categorizeEvents(events: Event[]): CategorizedEvents {
    const futureEvents = events.filter(event => event.status === 'CONFIRMED');
    const pastEvents = events.filter(event => event.status === 'ARCHIVED');
    return { future: futureEvents, past: pastEvents };
  }
}
