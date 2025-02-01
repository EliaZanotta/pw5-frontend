import { Component } from '@angular/core';
import {WizardService} from '../wizard.service';
import {NgClass, NgIf} from '@angular/common';

@Component({
  selector: 'app-step-5',
  imports: [
    NgIf,
    NgClass
  ],
  templateUrl: './step-5.component.html',
  styleUrl: './step-5.component.css'
})
export class Step5Component {
  userChoice: string = '';
  currentStep: number = 5;

  constructor(private wizardService: WizardService) {
  }

  ngOnInit(): void {
    this.userChoice = this.wizardService.getUserChoice();
  }
}
