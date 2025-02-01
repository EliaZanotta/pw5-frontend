import { Component } from '@angular/core';
import {WizardService} from '../wizard.service';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-step-3',
  imports: [
    NgIf,
    NgClass
  ],
  templateUrl: './step-3.component.html',
  styleUrl: './step-3.component.css'
})
export class Step3Component {
  userChoice: string = '';
  currentStep: number = 3;

  constructor(public wizardService: WizardService) {
  }

  ngOnInit(): void {
    this.userChoice = this.wizardService.getUserChoice();
  }
}
