import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import {environment} from '../../../environment/environment';

export interface Speaker {
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
export class SpeakerService {
  private apiUrl = environment.apiUrl;
  private baseUrl = `${this.apiUrl}/user/`;

    constructor(private http: HttpClient) { }

    async getSpeakers(): Promise<Speaker[]> {
        const response = await lastValueFrom(this.http.get<{ speakers: Speaker[] }>(`${this.baseUrl}/speakers`));
        return response.speakers; // Estrai l'array di speaker dalla risposta
    }
}
