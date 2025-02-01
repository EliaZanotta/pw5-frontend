import { Component } from '@angular/core';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faUser, faHandshake, faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-register',
    imports: [
        FontAwesomeModule,
        RouterLink
    ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
    faUser = faUser;
    faHandshake = faHandshake;
    faArrowLeft = faArrowLeft;
}
