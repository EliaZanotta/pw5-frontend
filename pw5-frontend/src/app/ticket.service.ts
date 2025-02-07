import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {environment} from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  private apiUrl = environment.apiUrl;
  private baseUrl = `${this.apiUrl}/ticket/`;

  constructor(private http: HttpClient) { }

  confirmTicket(ticketCode: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/confirm`, { ticketCode }, { withCredentials: true });
  }
}
