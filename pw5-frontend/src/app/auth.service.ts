import { Injectable } from '@angular/core';

interface RegisterRequest {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  companyName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth/register'; // URL dell'API di registrazione

  async register(userData: RegisterRequest): Promise<any> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Errore HTTP: ${response.status}`);
      }

      return response.json(); 
    } catch (error) {
      console.error('Errore durante la registrazione:', error);
      throw error;
    }
  }
}
