import {Component, OnInit} from '@angular/core';
import {WizardService} from '../wizard.service';
import {NgClass, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {AuthService, User} from '../../auth.service';

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

  constructor(public wizardService: WizardService, public authService: AuthService, private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    this.wizardService.setStep(3);
    const userChoiceCookie = document.cookie.split('; ').find(row => row.startsWith('USER_CHOICE='));
    if (userChoiceCookie) {
      this.userChoice = userChoiceCookie.split('=')[1];
    }
    this.currentStep = this.wizardService.getStep() ? this.wizardService.getStep() : 2;
    console.log('Step ' + this.wizardService.getStep());
    this.user = (await this.authService.getLoggedUser()).user;
    console.log('User:', this.user);
  }

  async handleAziendaSubmit() {
    if (!this.companyName || !this.companyEmail) {
      this.showErrorMessage('Tutti i campi sono obbligatori');
      return;
    }

    const payload = {
      type : 'COMPANY',
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
      } else {
        this.showErrorMessage('Errore durante il login');
      }
    }
  }

  async handlePartnerSubmit() {
    if (!this.partnerName || !this.partnerEmail) {
      this.showErrorMessage('Tutti i campi sono obbligatori');
      return;
    }

    const payload = {
      type : 'PARTNER',
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
