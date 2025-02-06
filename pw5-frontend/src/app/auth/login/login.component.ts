import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../auth.service';
import {firstValueFrom} from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';

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

export class LoginComponent implements OnInit {
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

  async ngOnInit() {
    if (document.cookie.includes('SESSION_ID')) {
      await this.router.navigate(['/']);
    }
    if (localStorage.getItem('userChoice')) {
      localStorage.removeItem('userChoice');
    }
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
      let response = await this.authService.login(payload);
      if (response.user) {
        await this.router.navigate(['/']);
        localStorage.setItem('userChoice', 'user');
      }
    } catch (errorResponse) {
      if (errorResponse instanceof HttpErrorResponse) {
        if (errorResponse.status === 401) {
          this.showErrorMessage('Credenziali non valide');
        } else {
          this.showErrorMessage('Errore durante il login');
        }
      }
    }
  }

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
      let response = await this.authService.loginHost(payload);
      if (response.host) {
        await this.router.navigate(['/']);
        localStorage.setItem('userChoice', 'host');
      }
    } catch (errorResponse) {
      if (errorResponse instanceof HttpErrorResponse) {
        if (errorResponse.status === 401) {
          this.showErrorMessage('Credenziali non valide');
        } else {
          this.showErrorMessage('Errore durante il login');
        }
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
