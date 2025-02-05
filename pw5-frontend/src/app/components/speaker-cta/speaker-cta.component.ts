import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService, User } from '../../auth/auth.service';

@Component({
  selector: 'app-speaker-cta',
  imports: [NgIf, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './speaker-cta.component.html',
  styleUrl: './speaker-cta.component.css'
})
export class SpeakerCtaComponent implements OnInit {
  user: User | null = null;
  isLoggedIn: boolean = false;
  isUser: boolean = false;

  constructor(private authService: AuthService) { }

  async ngOnInit(): Promise<void> {
    await this.loadUser();
  }

  private async loadUser(): Promise<void> {
    try {
      const userResult = (await this.authService.getLoggedUser()).user;
      if (userResult && userResult.id && userResult.role) {
        this.user = userResult;
        this.isLoggedIn = true;
        this.isUser = userResult.role.toUpperCase() === 'USER';
      }
    } catch (error) {
      console.error('Errore nel recupero dell\'utente:', error);
      this.user = null;
      this.isLoggedIn = false;
      this.isUser = false;
    }
  }

  navigateToSpeakerApplication() {
    console.log('Navigating to speaker application page');
  }
}
