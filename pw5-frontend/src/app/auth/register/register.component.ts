import { Component } from '@angular/core';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faUser, faHandshake} from '@fortawesome/free-solid-svg-icons';
import {Router, RouterLink} from "@angular/router";
import {WizardService} from "./wizard.service";

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

    constructor(private wizardService: WizardService) {

    }

    setUserChoice(choice: string) {
        this.wizardService.setUserChoice(choice);
        this.wizardService.setStep(1);
    }
}
