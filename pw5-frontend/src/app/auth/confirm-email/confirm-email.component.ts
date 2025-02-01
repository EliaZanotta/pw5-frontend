import {Component, OnInit} from '@angular/core';
import {AuthService, User} from '../auth.service';
import {WizardService} from "../register/wizard.service";
import {RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";

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
    userChoice: string = '';

    constructor(private auth: AuthService, private wizardService: WizardService) {
    }

    async ngOnInit(): Promise<void> {
        try {
            const userChoiceCookie = document.cookie.split('; ').find(row => row.startsWith('USER_CHOICE='));
            if (userChoiceCookie) {
                this.userChoice = userChoiceCookie.split('=')[1];
            }
            this.user = (await this.auth.getLoggedUser()).user;
            const token = window.location.pathname.split('/confirm-email/')[1];
            await this.auth.confirmEmail(token);
        } catch (e) {
            console.error('Error confirming email:', e);
        }
    }

    deleteUserChoiceCookie() {
        document.cookie = 'USER_CHOICE=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
}
