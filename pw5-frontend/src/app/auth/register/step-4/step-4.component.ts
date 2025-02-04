import {Component, OnInit} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import {AuthService} from '../../auth.service';
import {Router, RouterLink} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Host, HostService} from '../../../host.service';
import {HttpErrorResponse} from '@angular/common/http';
import {WizardService} from '../wizard.service';

@Component({
  selector: 'app-step-4',
  imports: [
    NgIf,
    NgClass,
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

  constructor(public authService: AuthService, private router: Router, private hostService: HostService, private wizardService: WizardService) {
  }

  async ngOnInit(): Promise<void> {
    console.log('Step ' + this.currentStep);
    try {
      this.host = (await this.authService.getLoggedHost()).host;

      if (this.host) {
        this.userChoice = this.wizardService.getUserChoice();
        console.log('User choice:', this.userChoice);
        console.log('Host:', this.host);

        // Check if the password has already been set
        if (this.host.hashedPsw !== this.host.provvisoryPsw) {
          await this.router.navigate(['/auth/register/step-5']);
        }
      }
    } catch (errorResponse) {
      if (errorResponse instanceof HttpErrorResponse) {
        if (errorResponse.status === 401) {
          // Wait 3 seconds before redirecting to step 3
          setTimeout(() => {
            this.router.navigate(['/auth/register/step-3']);
          }, 3000);
        }
      } else {
        this.showErrorMessage('An unexpected error occurred');
      }

    }
  }

  async handleChangePswSubmit() {
    if (this.oldPsw === '' || this.newPsw === '') {
      this.showErrorMessage('Please fill all fields');
      return;
    }

    const payload = {
      oldPsw: this.oldPsw,
      newPsw: this.newPsw
    }

    try {
      await this.hostService.changePassword(payload);
      await this.router.navigate(['/auth/register/step-5']);
    } catch (errorResponse) {
      if (errorResponse instanceof HttpErrorResponse) {
        this.showErrorMessage(errorResponse.error.message);
      } else {
        this.showErrorMessage('An unexpected error occurred');
      }
      console.error('Error changing password:', errorResponse);
    }
  }

  private showErrorMessage(message: string) {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = null;
    }, 3000);
  }
}
