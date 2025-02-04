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
    const userChoiceCookie = document.cookie.split('; ').find(row => row.startsWith('USER_CHOICE='));
    if (userChoiceCookie) {
      this.userChoice = userChoiceCookie.split('=')[1];
    }

    try {
      let loggedHost = (await this.authService.getLoggedHost()).host;
      if (loggedHost) {
        await this.router.navigate(['/auth/register/step-4']);
      }
    } catch (errorResponse) {
      if (errorResponse instanceof HttpErrorResponse) {
        if (errorResponse.status === 404) {
          try {
            this.user = (await this.authService.getLoggedUser()).user;
          } catch (errorResponse) {
            if (errorResponse instanceof HttpErrorResponse) {
              if (errorResponse.status === 401) {
                // Wait 3 seconds before redirecting to step 2
                setTimeout(() => {
                  this.router.navigate(['/auth/register/step-2']);
                }, 3000);
              }
            }
          }
        }
      }
    }
  }

  async handleAziendaSubmit() {
    if (!this.companyName || !this.companyEmail) {
      this.showErrorMessage('Tutti i campi sono obbligatori');
      return;
    }

    const payload = {
      type: 'COMPANY',
      name: this.companyName,
      email: this.companyEmail
    }

    try {
      await this.authService.registerHost(payload);
      await this.router.navigate(['/auth/register/step-4']);
    } catch (error) {
      // if response is a 401 error, add an error message
      if (typeof error === 'object' && error !== null && 'status' in error && (error as any).status === 401) {
        this.showErrorMessage('Non sei autorizzato a effettuare questa operazione');
        console.log('Error:', error);
      } else {
        this.showErrorMessage('Errore durante il login');
        console.log('Error:', error);
      }
    }
  }

  async handlePartnerSubmit() {
    if (!this.partnerName || !this.partnerEmail) {
      this.showErrorMessage('Tutti i campi sono obbligatori');
      return;
    }

    const payload = {
      type: 'PARTNER',
      name: this.partnerName,
      email: this.partnerEmail
    }

    try {
      await this.authService.registerHost(payload);
      await this.router.navigate(['/auth/register/step-4']);
    } catch (error) {
      // if response is a 401 error, add an error message
      if (typeof error === 'object' && error !== null && 'status' in error && (error as any).status === 401) {
        this.showErrorMessage('Non sei autorizzato a effettuare questa operazione');
      } else {
        this.showErrorMessage('Errore durante il login');
      }
      console.log('Error:', error);
    }
  }

  deleteUserChoiceCookie() {
    document.cookie = 'USER_CHOICE=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
  }

  private showErrorMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }
}
