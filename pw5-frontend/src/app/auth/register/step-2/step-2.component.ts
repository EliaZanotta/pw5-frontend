import {Component, OnInit} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import {AuthService} from '../../auth.service';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {User} from '../../auth.service';
import {HttpErrorResponse} from '@angular/common/http';

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

  constructor(public authService: AuthService, private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    if (document.cookie.includes('SESSION_ID')) {
      try {
        let response = await this.authService.getLoggedHost();
        if (response.host) {
          await this.router.navigate(['/auth/register/step-4']);
        }
      } catch (errorResponse) {
        if (errorResponse instanceof HttpErrorResponse) {
          if (errorResponse.status === 404) {
            const userChoice = localStorage.getItem('userChoice');

            if (userChoice) {
              console.log('User choice:', userChoice);
              this.userChoice = userChoice;

              try {
                let response = await this.authService.getLoggedUser();
                if (response.user) {
                  this.user = response.user;
                  if (this.user?.status === 'VERIFIED') {
                    await this.router.navigate(['/auth/register/step-3']);
                  } else {
                    this.showErrorMessage('Email non ancora verificata');
                  }
                }
              } catch (errorResponse) {
                if (errorResponse instanceof HttpErrorResponse) {
                  console.error('Error getting logged user:', errorResponse);
                  await this.router.navigate(['/auth/login']);
                }
              }
            } else {
              console.log('User choice not found');
              await this.router.navigate(['/auth/register']);
            }
          }
        }
      }
    } else {
      await this.router.navigate(['/auth/login']);
    }
  }

  async handleVerify() {
    try {
      if (this.user) {
        if (this.user.status === 'UNVERIFIED') {
          location.reload();
        }
      }
    } catch (error) {
      console.error('Error verifying email:', error);
      this.showErrorMessage('Errore nella verifica dell\'email');
    }
  }

  async handleResend() {
    try {
      if (this.user) {
        if (this.user.status === 'UNVERIFIED') {
          await this.authService.sendConfirmationMail();
          this.newMailSent = true;
          setTimeout(() => {
            this.newMailSent = false;
          }, 3000);
        }
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
