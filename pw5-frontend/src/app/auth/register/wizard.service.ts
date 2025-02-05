import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class WizardService {

    constructor() {
    }

    userChoice: string = '';
    step: number = 1;
    userEmail: string = '';
    userStatus: string = '';

    setUserChoice(choice: string) {
        this.userChoice = choice;
    }

  getUserChoice(): string {
    const userChoiceCookie = document.cookie.split('; ').find(row => row.startsWith('USER_CHOICE='));
    return userChoiceCookie ? userChoiceCookie.split('=')[1] : '';
  }


  setStep(step: number) {
        this.step = step;
    }

    getStep() {
        return this.step;
    }

    nextStep() {
        this.step++;
    }

    getUserEmail() {
        return this.userEmail;
    }

    setUserEmail(userEmail: string) {
        this.userEmail = userEmail;
    }

    getUserStatus() {
        return this.userStatus;
    }

    setUserStatus(userStatus: string) {
        this.userStatus = userStatus;
    }

    reset() {
        this.userChoice = '';
        this.step = 1;
        this.userEmail = '';
        this.userStatus = '';
    }
}
