import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-speaker-cta',
  imports: [NgIf, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './speaker-cta.component.html',
  styleUrl: './speaker-cta.component.css'
})
export class SpeakerCtaComponent {
  isLoggedIn = true; // This should be dynamically set based on your authentication logic

  navigateToSpeakerApplication() {
    // Implement navigation logic here
    console.log('Navigating to speaker application page');
  }
}
