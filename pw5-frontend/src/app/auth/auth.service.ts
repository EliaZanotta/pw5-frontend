import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/auth/';

  constructor(private http: HttpClient) {
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'register', userData);
  }

  registerHost(userData: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'register-host', userData);
  }

  login(userData: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'login', userData, {
      withCredentials: true
    });
  }

  loginHost(userData: any): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'login-host', userData, {
      withCredentials: true
    });
  }

  confirmEmail(token: string): Observable<any> {
    return this.http.put<any>(this.baseUrl + 'confirm-email', {token});
  }

  sendConfirmationMail(email: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'send-confirmation-mail');
  }

  logout(): Observable<any> {
    return this.http.delete<any>(this.baseUrl + 'logout');
  }
}
