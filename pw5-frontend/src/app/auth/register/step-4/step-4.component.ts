import { Component } from '@angular/core';
import {WizardService} from '../wizard.service';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-step-4',
  imports: [
    NgIf,
    NgClass
  ],
  templateUrl: './step-4.component.html',
  styleUrl: './step-4.component.css'
})
export class Step4Component {
  userChoice: string = '';
  currentStep: number = 4;

  constructor(public wizardService: WizardService) {
  }

  ngOnInit(): void {
    this.userChoice = this.wizardService.getUserChoice();
  }
}
