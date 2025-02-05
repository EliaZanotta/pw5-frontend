import {Component, OnInit} from '@angular/core';
import {AuthService, User} from '../auth.service';
import {Router, RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-confirm-email',
  imports: [
    RouterLink,
    NgIf
  ],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.css'
})
export class ConfirmEmailComponent implements OnInit {
  user: User | null = null;
  errorMessage: string | null = null;

  constructor(private auth: AuthService, private router: Router) {
  }

  async ngOnInit(): Promise<void> {
    try {
      if (document.cookie.includes('SESSION_ID')) {
        let response = await this.auth.getLoggedUser();
        this.user = response.user;
      } else {
        this.errorMessage = 'You are not logged in';
      }
      const token = window.location.pathname.split('/confirm-email/')[1];
      await this.auth.confirmEmail(token);
    } catch (errorResponse) {
      if (errorResponse instanceof HttpErrorResponse) {
        this.errorMessage = errorResponse.error.message;
      }

    }
  }
}
