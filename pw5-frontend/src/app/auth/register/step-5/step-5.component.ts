import {Component, OnInit} from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import {AuthService} from '../../auth.service';
import {Host} from '../../../host.service';
import {Router, RouterLink} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-step-5',
  imports: [
    NgIf,
    NgClass,
    RouterLink
  ],
  templateUrl: './step-5.component.html',
  styleUrl: './step-5.component.css'
})
export class Step5Component implements OnInit {
  userChoice: string = '';
  currentStep: number = 5;
  host: Host | null = null;

  constructor(private authService: AuthService, private router: Router) {
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
              if (this.host?.hashedPsw === this.host?.provvisoryPsw) {
                await this.router.navigate(['/auth/register/step-4']);
              } else {
                setTimeout(async () => {
                  await this.router.navigate(['/']);
                }, 3000);
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
            }
          }
        }

        if (this.userChoice === 'user') {
          try {
            let response = await this.authService.getLoggedUser();
            if (response.user) {
              await this.router.navigate(['/']);
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
}
