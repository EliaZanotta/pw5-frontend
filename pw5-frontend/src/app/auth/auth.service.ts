import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {lastValueFrom} from 'rxjs';

export class User {
    id: number | undefined;
    firstName: string | undefined;
    lastName: string | undefined;
    email: string | undefined;
    status: string | undefined;
    role: string | undefined;
    constructor() {
    }
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth/';

  constructor(private http: HttpClient) {
  }

  async register(payload: { firstName: string; lastName: string; email: string; hashedPsw: string; }): Promise<any> {
    return await lastValueFrom(this.http.post<any>(`${this.baseUrl}register`, payload));
  }

  async registerHost(payload: { type: string; name: string; email: string; }): Promise<any> {
    return await lastValueFrom(this.http.post<any>(`${this.baseUrl}register-host`, payload));
  }

  async login(payload: { email: string; hashedPsw: string }): Promise<any> {
    return await lastValueFrom(this.http.post<any>(`${this.baseUrl}login`, payload, { withCredentials: true }));
  }

  async loginHost(payload: { email: string; hashedPsw: string }): Promise<any> {
    return await lastValueFrom(this.http.post<any>(`${this.baseUrl}login-host`, payload, { withCredentials: true }));
  }

  async confirmEmail(token: string): Promise<any> {
    return await lastValueFrom(this.http.put<any>(`${this.baseUrl}confirm/${token}`, null));
  }

  async sendConfirmationMail(): Promise<User> {
    return await lastValueFrom(this.http.get<any>(`${this.baseUrl}send-confirmation-mail`, { withCredentials: true }));
  }

  async logout(): Promise<any> {
    return await lastValueFrom(this.http.delete<any>(`${this.baseUrl}logout`, { withCredentials: true }));
  }

  async getLoggedUser(): Promise<any> {
    return await lastValueFrom(this.http.get<any>(`${this.baseUrl}get-authenticated-user`, { withCredentials: true }));
  }
}
