import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Host {
  id: string;
  type: 'COMPANY' | 'PARTNER';
  name: string;
  email: string;
  hashedPsw: string;
  provvisoryPsw: string;
  description: string | null;
  pastEvents: string[] | null;
  programmedEvents: string[] | null;
  createdBy: string;
  hostStatus: 'APPROVED' | 'PENDING' | 'REJECTED';
}

@Injectable({
  providedIn: 'root'
})
export class PartnerCompaniesService {
  private baseUrl = 'http://localhost:8080/';
  private apiUrl = this.baseUrl + 'host/';

  constructor(private http: HttpClient) {}

  // Fetch all hosts from the API
  getAllHosts(): Observable<Host[]> {
    return this.http.get<{ hosts: Host[], message: string }>(this.apiUrl).pipe(
      map(response => response.hosts) // Extract the hosts array from the response
    );
  }

  // Get only companies
  getCompanies(): Observable<Host[]> {
    return this.getAllHosts().pipe(
      map(hosts => hosts.filter(host => host.type === 'COMPANY'))
    );
  }

  // Get only partners
  getPartners(): Observable<Host[]> {
    return this.getAllHosts().pipe(
      map(hosts => hosts.filter(host => host.type === 'PARTNER'))
    );
  }
}
