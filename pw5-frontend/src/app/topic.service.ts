import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';

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
  private baseUrl = 'http://localhost:8080/topic/';
  constructor(private http: HttpClient) {
  }

  async getALlTopics(): Promise<any> {
    return await lastValueFrom(this.http.get<any>(`${this.baseUrl}`));
  }
}
