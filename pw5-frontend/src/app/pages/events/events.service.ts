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
  pendingSpeakerRequests: string[];
  maxParticipants: number;
  registeredParticipants: number;
  ticketIds: string[];
  eventSubscription: string;
  image?: string;
  description?: string;
}

export interface CategorizedEvents {
  future: Event[];
  past: Event[];
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

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private baseUrl = 'http://localhost:8080/';
  private apiUrl = this.baseUrl + 'event';

  constructor(private http: HttpClient) { }

  getEvents(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
  // New method to get categorized events
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
