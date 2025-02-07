import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';
import {environment} from '../environment/environment';

export class Topic {
  id: string | undefined;
  name: string | undefined;
  constructor() {
  }
}

@Injectable({
  providedIn: 'root'
})
export class TopicService {
  private apiUrl = environment.apiUrl;
  private baseUrl = `${this.apiUrl}/topic/`;
  constructor(private http: HttpClient) {
  }

  async getALlTopics(): Promise<any> {
    return await lastValueFrom(this.http.get<any>(`${this.baseUrl}`));
  }
}
