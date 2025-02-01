import { Component } from '@angular/core';
import {NgClass, NgIf} from '@angular/common';
import {WizardService} from '../wizard.service';

@Component({
  selector: 'app-step-2',
  imports: [
    NgIf,
    NgClass
  ],
  templateUrl: './step-2.component.html',
  styleUrl: './step-2.component.css'
})
export class Step2Component {
  userChoice: string = '';
  currentStep: number = 2;

  constructor(public wizardService: WizardService) {
  }

  ngOnInit(): void {
    this.userChoice = this.wizardService.getUserChoice();
  }
}
