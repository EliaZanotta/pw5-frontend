import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Event {
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
}
