import {Component, OnInit} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService, User} from '../../auth.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-step-3',
  imports: [
    NgIf,
    NgClass,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './step-3.component.html',
  styleUrl: './step-3.component.css'
})
export class Step3Component implements OnInit {
  userChoice: string = '';
  currentStep: number = 3;
  activeTab: string = 'company';
  companyName: string = '';
  companyEmail: string = '';
  partnerName: string = '';
  partnerEmail: string = '';
  errorMessage: string | null = null;
  user: User | null = null;

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

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

              if (this.userChoice === 'user') {
                try {
                  let response = await this.authService.getLoggedUser();

                  if (response.user) {
                    this.user = response.user;
                    if (this.user?.status === 'VERIFIED') {
                      setTimeout(async () => {
                        localStorage.removeItem('userChoice');
                      }, 3000);
                    } else {
                      await this.router.navigate(['/auth/register/step-2']);
                    }
                  }
                } catch (errorResponse) {
                  if (errorResponse instanceof HttpErrorResponse) {
                    console.error('Error getting logged user:', errorResponse);
                    await this.router.navigate(['/auth/login']);
                  }
                }
              }

              if (this.userChoice === 'host') {
                try {
                  let response = await this.authService.getLoggedUser();
                  if (response.user) {
                    this.user = response.user;
                    if (this.user?.status !== 'VERIFIED') {
                      setTimeout(async () => {
                        await this.router.navigate(['/auth/register/step-2']);
                      }, 3000);
                    }
                  }
                } catch (errorResponse) {
                  if (errorResponse instanceof HttpErrorResponse) {
                    console.error('Error getting logged user:', errorResponse);
                    await this.router.navigate(['/auth/login']);
                  }
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

  async handleAziendaSubmit() {
    const payload = {
      type: 'COMPANY',
      name: this.companyName,
      email: this.companyEmail
    }

    try {
      let response = await this.authService.registerHost(payload);
      if (response.host) {
        await this.router.navigate(['/auth/register/step-4']);
      }
    } catch (errorResponse) {
      if (errorResponse instanceof HttpErrorResponse) {
        switch (errorResponse.status) {
          case 400:
            this.showErrorMessage('Email non valida o uno o più campi vuoti');
            break;
          case 409:
            this.showErrorMessage('Azienda/Partner già esistente');
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

  async handlePartnerSubmit() {
    const payload = {
      type: 'PARTNER',
      name: this.partnerName,
      email: this.partnerEmail
    }

    try {
      let response = await this.authService.registerHost(payload);
      if (response.host) {
        await this.router.navigate(['/auth/register/step-4']);
      }
    } catch (errorResponse) {
      if (errorResponse instanceof HttpErrorResponse) {
        switch (errorResponse.status) {
          case 400:
            this.showErrorMessage('Email non valida o uno o più campi vuoti');
            break;
          case 409:
            this.showErrorMessage('Azienda/Partner già esistente');
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
