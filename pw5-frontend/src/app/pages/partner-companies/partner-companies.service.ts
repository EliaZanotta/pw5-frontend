import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import {Host} from '../../host.service';
import {environment} from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class PartnerCompaniesService {
  private apiUrl = environment.apiUrl;
  private baseUrl = `${this.apiUrl}/host/`;

  constructor(private http: HttpClient) {}

  async getAllHosts(): Promise<{ hosts: Host[], message: string }> {
    return await lastValueFrom(this.http.get<{ hosts: Host[], message: string }>(this.baseUrl));
  }

}
