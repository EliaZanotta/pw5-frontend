import {Component, OnInit} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import {AuthService} from '../../auth.service';
import {Router} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Host, HostService} from '../../../host.service';
import {HttpErrorResponse} from '@angular/common/http';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";


@Component({
  selector: 'app-step-4',
  imports: [
    NgIf,
    NgClass,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  templateUrl: './step-4.component.html',
  styleUrl: './step-4.component.css'
})
export class Step4Component implements OnInit {
  protected readonly faEyeSlash = faEyeSlash;
  protected readonly faEye = faEye;

  currentStep: number = 4;
  host: Host | null = null;
  userChoice: string = '';
  errorMessage: string | null = null;
  oldPsw: string = '';
  newPsw: string = '';
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;

  constructor(public authService: AuthService, private router: Router, private hostService: HostService) {
  }

  async ngOnInit(): Promise<void> {
    if (document.cookie.includes('SESSION_ID')) {
      const userChoice = localStorage.getItem('userChoice');
      if (userChoice) {
        this.userChoice = userChoice;
        if (this.userChoice === 'host') {
          try {
            let response = await this.authService.getLoggedHost();
            if (response.host) {
              this.host = response.host;
              // Check if the password has already been set
              if (this.host?.hashedPsw !== this.host?.provisoryPsw) {
                await this.router.navigate(['/auth/register/step-5']);
              }
            }
          } catch (errorResponse) {
            if (errorResponse instanceof HttpErrorResponse) {
              if (errorResponse.status === 404) {
                try {
                  let response = await this.authService.getLoggedUser();
                  if (response.user) {
                    let user = response.user;
                    if (user.status !== 'VERIFIED') {
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
            }
          }
        }

        if (this.userChoice === 'user') {
          try {
            let response = await this.authService.getLoggedUser();
            if (response.user) {
              setTimeout(async () => {
                await this.router.navigate(['/']);
              }, 2000);
            }
          } catch (errorResponse) {
            if (errorResponse instanceof HttpErrorResponse) {
              console.error('Error getting logged user:', errorResponse);
              await this.router.navigate(['/auth/login']);
            }
          }
        }
      }
    } else {
      await this.router.navigate(['/auth/login']);
    }
  }

  async handleChangePswSubmit() {
    const payload = {
      oldPsw: this.oldPsw,
      newPsw: this.newPsw
    }

    try {
      let response = await this.hostService.changePassword(payload);
      if (response.host) {
        await this.router.navigate(['/auth/register/step-5']);
      }
    } catch (errorResponse) {
      if (errorResponse instanceof HttpErrorResponse) {
        switch (errorResponse.status) {
          case 400:
            this.showErrorMessage('Errore nella richiesta');
            break;
          case 500:
            this.showErrorMessage('Errore interno del server');
            break;
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

  toggleOldPasswordVisibility() {
    this.showOldPassword = !this.showOldPassword;
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }
}
