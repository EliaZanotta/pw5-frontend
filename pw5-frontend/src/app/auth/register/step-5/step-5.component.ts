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
    try {
      this.host = (await this.authService.getLoggedHost()).host;
      if (this.host) {
        this.userChoice = 'host';
      }
    } catch (e) {
      if (e instanceof HttpErrorResponse && e.status === 401) {
        await this.router.navigate(['/auth/register']);
        document.cookie = 'USER_CHOICE=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
      }
      console.error('Error while getting logged host:', e);
    }

  }

  deleteUserChoiceCookie() {
    document.cookie = 'USER_CHOICE=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
    this.userChoice = '';
  }
}
