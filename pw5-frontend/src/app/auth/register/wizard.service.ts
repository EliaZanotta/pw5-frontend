import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WizardService {

  constructor() { }

  userChoice: string = '';
  step: number = 1;

  setUserChoice(choice: string) {
    this.userChoice = choice;
  }

  getUserChoice() {
    return this.userChoice;
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
}
