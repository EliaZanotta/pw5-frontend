import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Event} from './pages/events/events.service';
import {lastValueFrom} from 'rxjs';

export class Host {
  id: number | undefined;
  name: string | undefined;
  email: string | undefined;
  hostStatus: string | undefined;
  type: string | undefined;
  description: string | undefined;
  hashedPsw: string | undefined;
  provvisoryPsw: string | undefined;
  pastEvents: Event[] | undefined;
  programmedEvents: Event[] | undefined;
  createdBy: string | undefined;
  constructor() {
  }
}

@Injectable({
  providedIn: 'root'
})
export class HostService {

  constructor(private http: HttpClient) {
  }

  private baseUrl = 'http://localhost:8080/host/';

  async changePassword(payload:{ oldPsw: string, newPsw: string }): Promise<void> {
    return await lastValueFrom(this.http.put<any>(`${this.baseUrl}change-password`, payload, { withCredentials: true }));
  }
  async deleteHost(hostId: string): Promise<void> {
    return await lastValueFrom(this.http.delete<any>(`${this.baseUrl}${hostId}`, { withCredentials: true }));
  }
}
