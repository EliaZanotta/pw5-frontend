import {Component, OnInit} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import {WizardService} from '../wizard.service';
import {AuthService} from '../../auth.service';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {firstValueFrom} from 'rxjs';
import {User} from '../../auth.service';

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

  constructor(public wizardService: WizardService, public authService: AuthService, private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    this.wizardService.setStep(2);
    const userChoiceCookie = document.cookie.split('; ').find(row => row.startsWith('USER_CHOICE='));
    if (userChoiceCookie) {
      this.userChoice = userChoiceCookie.split('=')[1];
    }
    this.currentStep = this.wizardService.getStep() ? this.wizardService.getStep() : 2;
    console.log('Step ' + this.wizardService.getStep());
    this.user = (await this.authService.getLoggedUser()).user;
    console.log('User:', this.user);
  }

  async handleVerify() {
    try {
      if (this.user) {
        if (this.user.status === 'VERIFIED') {
          await this.router.navigate(['/auth/register/step-3']);
          this.wizardService.nextStep();
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
      if (this.user?.status === 'VERIFIED') {
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
