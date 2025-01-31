import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-area',
  templateUrl: './user-area.component.html',
  styleUrls: ['./user-area.component.css']
})
export class UserAreaComponent {
  user = {
    id: 1,
    name: 'Mario Rossi',
    avatar: 'https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg',
    role: 'Utente Premium',
    email: 'mario.rossi@example.com',
    registrationDate: '10 Gennaio 2023',
    accessLevel: 'Premium',
    activities: [
      { date: '5 Febbraio 2024', description: 'Prenotazione evento "Tech Meetup 2024"' },
      { date: '3 Febbraio 2024', description: 'Modifica informazioni profilo' },
      { date: '28 Gennaio 2024', description: 'Aggiunto nuovo metodo di pagamento' }
    ]
  };

  selectedTab: string = 'profile';

  constructor(private router: Router) {}

  setTab(tab: string): void {
    this.selectedTab = tab;
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
