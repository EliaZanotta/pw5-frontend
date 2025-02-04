import {Component, OnInit} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import {WizardService} from '../wizard.service';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../auth.service';

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

  constructor(public wizardService: WizardService, public authService: AuthService, private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    const userChoiceCookie = document.cookie.split('; ').find(row => row.startsWith('USER_CHOICE='));
    if (userChoiceCookie) {
      this.userChoice = this.wizardService.getUserChoice();
    }

    const loggedHost = (await this.authService.getLoggedHost()).host;
    if (loggedHost) {
      await this.router.navigate(['/auth/register/step-4']);
    }
  }

  async handleUserSubmit() {
    if ((this.userFirstName === '' || this.userLastName === '' || this.userEmail === '' || this.userPassword === '') || (this.userFirstName === null || this.userLastName === null || this.userEmail === null || this.userPassword === null)) {
      this.showErrorMessage('Please fill out all fields');
      return;
    }

    if (!this.userEmail.includes('@')) {
      this.showErrorMessage('Please enter a valid email address');
      return;
    }

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
      await this.authService.register(payload);
      await this.authService.login(loginPayload);
      await this.router.navigate(['/auth/register/step-2']);
    } catch (error) {
      console.error('Error during registration:', error);
      this.showErrorMessage('Error during registration');
    }

  }

  private showErrorMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }
}
