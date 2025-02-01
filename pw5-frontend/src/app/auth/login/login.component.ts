import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../auth.service';
import {firstValueFrom} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [
    FormsModule,
    NgIf,
    RouterLink
  ],
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  activeTab: string = 'utente';
  utenteEmail: string = '';
  utentePassword: string = '';
  aziendaEmail: string = '';
  aziendaPassword: string = '';
  errorMessage: string | null = null;

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  constructor(private authService: AuthService, private router: Router) {
  }

  async handleUtenteSubmit() {
    if (!this.utenteEmail || !this.utentePassword) {
      this.showErrorMessage('Tutti i campi sono obbligatori');
      return;
    }

    const payload = {
      email: this.utenteEmail,
      hashedPsw: this.utentePassword
    }

    try {
      await firstValueFrom(this.authService.login(payload));
      await this.router.navigate(['/']);
    } catch (error) {
      // // if response is a 401 error, add an error message
      if (typeof error === 'object' && error !== null && 'status' in error && (error as any).status === 401) {
        this.showErrorMessage('Credenziali non valide');
      } else {
        this.showErrorMessage('Errore durante il login');
      }
    }
  };

  async handleAziendaSubmit() {
    if (!this.aziendaEmail || !this.aziendaPassword) {
      this.showErrorMessage('Tutti i campi sono obbligatori');
      return;
    }

    const payload = {
      email: this.aziendaEmail,
      hashedPsw: this.aziendaPassword
    }

    try {
      await firstValueFrom(this.authService.loginHost(payload));
      await this.router.navigate(['/']);
    } catch (error) {
      // if response is a 401 error, add an error message
      if (typeof error === 'object' && error !== null && 'status' in error && (error as any).status === 401) {
        this.showErrorMessage('Credenziali non valide');
      } else {
        this.showErrorMessage('Errore durante il login');
      }
    }
  };

  private showErrorMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }
}
