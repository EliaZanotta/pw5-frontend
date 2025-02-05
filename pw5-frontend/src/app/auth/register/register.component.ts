import {Component, OnInit} from '@angular/core';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faUser, faHandshake} from '@fortawesome/free-solid-svg-icons';
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-register',
  imports: [
    FontAwesomeModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  faUser = faUser;
  faHandshake = faHandshake;

  constructor(private router: Router) {
  }

  async ngOnInit() {
    if (document.cookie.includes('SESSION_ID')) {
      await this.router.navigate(['/']);
    }
    if (localStorage.getItem('userChoice')) {
      localStorage.removeItem('userChoice');
    }

  }

  setUserChoice(choice: string) {
    localStorage.setItem('userChoice', choice);
  }
}
