import {Component, OnInit} from '@angular/core';
import {WizardService} from '../wizard.service';
import {NgClass, NgIf} from '@angular/common';
import {AuthService} from '../../auth.service';
import {Router, RouterLink} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Host, HostService} from '../../../host.service';

@Component({
  selector: 'app-step-4',
  imports: [
    NgIf,
    NgClass,
    RouterLink,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './step-4.component.html',
  styleUrl: './step-4.component.css'
})
export class Step4Component implements OnInit {
  currentStep: number = 4;
  host: Host | null = null;
  userChoice: string = '';
  errorMessage: string | null = null;
  oldPsw: string = '';
  newPsw: string = '';

  constructor(public wizardService: WizardService, public authService: AuthService, private router: Router, private hostService: HostService) {
  }

  async ngOnInit(): Promise<void> {
    this.wizardService.setStep(4);
    this.currentStep = this.wizardService.getStep() ? this.wizardService.getStep() : 2;
    console.log('Step ' + this.wizardService.getStep());
    this.host = (await this.authService.getLoggedHost()).host;
    if (this.host) {
      this.userChoice = 'host';
      console.log('User choice:', this.userChoice);
    }
    console.log('Host:', this.host);
  }

  handleChangePswSubmit() {
    if (this.oldPsw === '' || this.newPsw === '') {
      this.showErrorMessage('Please fill all fields');
      return;
    }

    const payload = {
      oldPsw: this.oldPsw,
      newPsw: this.newPsw
    }

    try {
      this.hostService.changePassword(payload);
      this.router.navigate(['/auth/register/step-5']);
    } catch (error) {
      this.showErrorMessage('An error occurred. Please try again later');
    }
  }

  private showErrorMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }
}
