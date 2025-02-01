import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {lastValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth/';

  constructor(private http: HttpClient) {
  }

  async register(userData: { firstName: string; lastName: string; email: string; hashedPsw: string; }): Promise<any> {
    return await lastValueFrom(this.http.post<any>(`${this.baseUrl}register`, userData));
  }

  async registerHost(userData: { name: string; email: string; }): Promise<any> {
    return await lastValueFrom(this.http.post<any>(`${this.baseUrl}register-host`, userData));
  }

  async login(userData: { email: string; hashedPsw: string }): Promise<any> {
    return await lastValueFrom(this.http.post<any>(`${this.baseUrl}login`, userData, {withCredentials: true}));
  }

  async loginHost(userData: { email: string; hashedPsw: string }): Promise<any> {
    return await lastValueFrom(this.http.post<any>(`${this.baseUrl}login-host`, userData, {withCredentials: true}));
  }

  async confirmEmail(token: string): Promise<any> {
    return await lastValueFrom(this.http.put<any>(`${this.baseUrl}confirm-email`, {token}));
  }

  async sendConfirmationMail(email: string): Promise<any> {
    return await lastValueFrom(this.http.get<any>(`${this.baseUrl}send-confirmation-mail`, {params: {email}}));
  }

  async logout(): Promise<any> {
    return await lastValueFrom(this.http.delete<any>(`${this.baseUrl}logout`, {withCredentials: true}));
  }
}
