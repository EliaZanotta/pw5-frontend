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
    pastEvents: [
      {
        title: 'Conferenza su Angular',
        date: '15 Marzo 2024',
        location: 'Milano, Italia',
        image: 'https://cdn-magazine.startupitalia.eu/wp-content/uploads/2024/11/25153624/PBO5180.jpg',
        description: 'Evento dedicato agli sviluppatori che lavorano con Angular.'
      },
      {
        title: 'Conferenza Tecnologica',
        date: '25 Aprile 2024',
        location: 'Bologna, Italia',
        image: 'https://www.4writing.it/wp-content/uploads/2024/12/btw_generica.jpg',
        description: 'Ultime innovazioni nel mondo della tecnologia e dell’AI.'
      }
    ],
    bookedEvents: [
      {
        title: 'Hackathon DevTech',
        date: '30 Agosto 2025',
        location: 'Milano, Italia',
        image: 'https://www.startupbusiness.it/wp-content/uploads/2024/09/Foto-9-3-24_-10-53-29.webp',
        description: 'Maratona di coding per innovatori e sviluppatori.'
      },
      {
        title: 'Fiera Technology',
        date: '5 Agosto 2025',
        location: 'Roma, Italia',
        image: 'https://ntstudio.it/wp-content/uploads/2022/04/nt-studio-eventi-aziendali-milano-1920x1080-017.jpg',
        description: 'Evento imperdibile per gli amanti del viaggio e delle nuove tecnologie.'
      }
    ]
  };

  // Combiniamo eventi passati e prenotati per la sezione My Tickets
  get tickets() {
    return [...this.user.pastEvents, ...this.user.bookedEvents];
  }

  selectedTab: string = 'bookedEvents';

  constructor(private router: Router) {}

  setTab(tab: string): void {
    this.selectedTab = tab;
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
