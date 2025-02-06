import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {lastValueFrom, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

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
  email: string | null;
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
  private baseUrl = 'http://localhost:8080/event';

  constructor(private http: HttpClient) {
  }

  async getEvents(): Promise<any> {
    return await lastValueFrom(this.http.get<Event[]>(this.baseUrl));
  }
  async getEventById(id: string): Promise<any> {
    return await lastValueFrom(this.http.get<Event>(`${this.baseUrl}/${id}`));
  }

  async bookEvent(payload: { id: string }): Promise<any> {
    return await lastValueFrom(this.http.put<any>(`${this.baseUrl}/book`, payload, {withCredentials: true}));
  }

  async revokeEvent(payload: { id: string | undefined }): Promise<any> {
    return await lastValueFrom(this.http.put<any>(`${this.baseUrl}/revoke`, payload, {withCredentials: true}));
  }

  async deleteEvent(eventId: string): Promise<void> {
    const url = `${this.baseUrl}/admin/${eventId}`;
    await lastValueFrom(
      this.http.delete(url, { responseType: 'text' })
    );
  }
  async createEvent(payload: { startDate: string; endDate: string; place: string; pendingSpeakerRequests: { email: string }[]; topics: string[]; title: string; maxParticipants: number; eventSubscription: string; description: string }): Promise<any> {
    return await lastValueFrom(
      this.http.post<any>(this.baseUrl, payload, { withCredentials: true })
    );
  }

  async updateEvent(eventId: string, payload: { place: string; pendingSpeakerRequests: { email: string }[]; topics: string[]; title: string; maxParticipants: number; eventSubscription: string; description: string }): Promise<any> {
    return await lastValueFrom(
      this.http.put<any>(`${this.baseUrl}/${eventId}`, payload, { withCredentials: true })
    );
  }
}
