import {Component, OnInit} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../auth.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-step-1',
  templateUrl: './step-1.component.html',
  imports: [
    NgIf,
    NgClass,
    FormsModule
  ],
  styleUrl: './step-1.component.css'
})

export class Step1Component implements OnInit {
  userChoice: string = '';
  currentStep: number = 1;
  userFirstName: string = '';
  userLastName: string = '';
  userEmail: string = '';
  userPassword: string = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    if (document.cookie.includes('SESSION_ID')) {
      await this.router.navigate(['/']);
    } else {
      const userChoice = localStorage.getItem('userChoice');
      if (userChoice) {
        this.userChoice = userChoice;
      } else {
        await this.router.navigate(['/auth/register']);
      }
    }
  }

  async handleUserSubmit() {
    // capitalize first letter of first and last name
    const payload = {
      firstName: this.userFirstName.charAt(0).toUpperCase() + this.userFirstName.slice(1),
      lastName: this.userLastName.charAt(0).toUpperCase() + this.userLastName.slice(1),
      email: this.userEmail,
      hashedPsw: this.userPassword
    }

    const loginPayload = {
      email: this.userEmail,
      hashedPsw: this.userPassword
    }

    try {
      let response = await this.authService.register(payload);
      if (response.user) {
        await this.authService.login(loginPayload);
        await this.router.navigate(['/auth/register/step-2']);
      }
    } catch (errorResponse) {
      if (errorResponse instanceof HttpErrorResponse) {
        switch (errorResponse.status) {
          case 400:
            this.showErrorMessage('Email non valida o uno o più campi vuoti');
            break;
          case 409:
            this.showErrorMessage('Email già registrata');
            break;
          case 500:
            this.showErrorMessage('Errore interno del server');
            break;
          default:
            this.showErrorMessage('Errore durante la registrazione');
        }
      }
    }

  }

  private showErrorMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }
}
