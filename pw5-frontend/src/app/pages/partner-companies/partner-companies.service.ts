import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

export interface Host {
  id: string;
  type: 'COMPANY' | 'PARTNER';
  name: string;
  email: string;
  hashedPsw: string | null;
  provisoryPsw: string | null;
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
  private apiUrl = 'https://backendpw5incom-eve7ged8dyagbyds.italynorth-01.azurewebsites.net/host/';

  constructor(private http: HttpClient) {}

  async getAllHosts(): Promise<{ hosts: Host[], message: string }> {
    return await lastValueFrom(this.http.get<{ hosts: Host[], message: string }>(this.apiUrl));
  }

}
