import {Component, OnInit} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import {AuthService} from '../../auth.service';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {User} from '../../auth.service';
import {HttpErrorResponse} from '@angular/common/http';
import {WizardService} from '../wizard.service';

@Component({
  selector: 'app-step-2',
  imports: [
    NgIf,
    NgClass,
    FormsModule
  ],
  templateUrl: './step-2.component.html',
  styleUrl: './step-2.component.css'
})
export class Step2Component implements OnInit {
  currentStep: number = 2;
  userChoice: string = '';
  user: User | null = null;
  errorMessage: string | null = null;
  newMailSent: boolean = false;

  constructor(public authService: AuthService, private router: Router, private wizardService: WizardService) {
  }

  async ngOnInit(): Promise<void> {
    const userChoiceCookie = document.cookie.split('; ').find(row => row.startsWith('USER_CHOICE='));
    if (userChoiceCookie) {
      this.userChoice = this.wizardService.getUserChoice();
    }

    try {
      this.user = (await this.authService.getLoggedUser()).user;
    } catch (errorResponse) {
      if (errorResponse instanceof HttpErrorResponse) {
        if (errorResponse.status === 401) {
          await this.router.navigate(['/auth/register']);
        }
      }
    }

    const loggedHost = (await this.authService.getLoggedHost()).host;
    if (loggedHost) {
      await this.router.navigate(['/auth/register/step-4']);
    }
  }

  async handleVerify() {
    try {
      if (this.user) {
        if (this.user.status === 'VERIFIED') {
          await this.router.navigate(['/auth/register/step-3']);
        } else {
          this.showErrorMessage('Email non ancora verificata');
        }
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      this.showErrorMessage('Errore nella verifica dell\'email');
    }
  }

  async handleResend() {
    try {
      if (!this.user) {
        return;
      }

      if (this.user.status === 'VERIFIED') {
        this.showErrorMessage('Email già verificata');
        return;
      } else {
        await this.authService.sendConfirmationMail();
        this.newMailSent = true;
        setTimeout(() => {
          this.newMailSent = false;
        }, 3000);
      }
    } catch (error) {
      console.error('Error resending email:', error);
      this.showErrorMessage('Errore nell\'invio dell\'email');
    }
  }

  private showErrorMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }
}
