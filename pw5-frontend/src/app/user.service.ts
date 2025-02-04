import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/user/';

  constructor(private http: HttpClient) {
  }

  async addFavouriteTopic(topicId: string): Promise<any> {
    return await lastValueFrom(this.http.put<any>(`${this.baseUrl}favourite-topic/add/${topicId}`, null, { withCredentials: true }));
  }

  async removeFavouriteTopic(topicId: string): Promise<any> {
    return await lastValueFrom(this.http.put<any>(`${this.baseUrl}favourite-topic/remove/${topicId}`, null, { withCredentials: true }));
  }
}
