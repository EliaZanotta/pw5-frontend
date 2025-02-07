import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private baseUrl = 'http://localhost:8080/ticket';

  constructor(private http: HttpClient) { }

  confirmTicket(ticketCode: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/confirm`, { ticketCode }, { withCredentials: true });
  }
}
