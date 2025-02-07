import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';
import {environment} from '../environment/environment';

export interface UserDetails {
  bookedEvents: EventSummary[];
  archivedEvents: EventSummary[];
  bookedTickets: Ticket[];
  favouriteTopics: Topic[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  hashedPsw: string;
  status: 'VERIFIED' | 'UNVERIFIED';
  role: 'ADMIN' | 'SPEAKER' | 'USER';
  userDetails: UserDetails;
}

export interface EventSummary {
  id: string;
  startDate: string;
  endDate: string;
  place: string;
  title: string;
  status: string;
}

export interface Ticket {
  id: string;
  userId: string;
  eventId: string;
  ticketCode: string;
  status: string;
}

export interface Topic {
  id: string;
  name: string;
}


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  private baseUrl = `${this.apiUrl}/user/`;

  constructor(private http: HttpClient) {
  }

  async addFavouriteTopic(topicId: string): Promise<any> {
    return await lastValueFrom(this.http.put<any>(`${this.baseUrl}favourite-topic/add/${topicId}`, null, { withCredentials: true }));
  }

  async removeFavouriteTopic(topicId: string): Promise<any> {
    return await lastValueFrom(this.http.put<any>(`${this.baseUrl}favourite-topic/remove/${topicId}`, null, { withCredentials: true }));
  }

  async getAllUsers(): Promise<{ users: User[], message: string }> {
    return await lastValueFrom(this.http.get<{ users: User[], message: string }>(this.baseUrl, { withCredentials: true }));
  }
  async deleteUser(userId: string): Promise<void> {
    const url = `${this.baseUrl}${userId}`;
    await lastValueFrom(this.http.delete(url, { withCredentials: true }));
  }
  async becomeSpeaker(): Promise<any> {
    const url = `${this.baseUrl}`;
    return await lastValueFrom(
      this.http.put<any>(url, null, {withCredentials: true})
    );
  }
}
