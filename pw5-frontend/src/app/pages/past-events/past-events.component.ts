import { Component } from '@angular/core';

@Component({
  selector: 'app-past-events',
  templateUrl: './past-events.component.html',
  styleUrls: ['./past-events.component.css']
})
export class PastEventsComponent {
  pastEvents = [
    {
      id: 1,
      title: 'Festival della Pizza 2024',
      date: '15 Marzo 2024',
      location: 'Milano, Italia',
      image: 'https://reteinformaticalavoro.it/blog/wp-content/uploads/2025/01/platea-eventi-tech-2025-da-segnare-in-agenda.png',
      description: 'Un evento imperdibile per tutti gli amanti della pizza con i migliori chef italiani.'
    },
    {
      id: 2,
      title: 'Conferenza Tecnologica 2024',
      date: '25 Aprile 2024',
      location: 'Roma, Italia', 
      image: 'https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F926811763%2F10624815713%2F1%2Foriginal.20250103-113253?w=512&auto=format%2Ccompress&q=75&sharp=10&rect=0%2C0%2C940%2C470&s=63aecf49fcba7e0c3d2e4d3daf9675f1',
      description: 'Scopri le ultime innovazioni nel mondo della tecnologia e dell’intelligenza artificiale.'
    },
    {
      id: 3,
      title: 'Maratona di Beneficenza 2024',
      date: '10 Maggio 2024',
      location: 'Napoli, Italia',
      image: 'https://techprincess.it/wp-content/uploads/2021/12/eventi-tech-2022-da-non-perdere-min.jpg',
      description: 'Partecipa alla maratona per supportare le associazioni benefiche locali.'
    },
    {
      id: 4,
      title: 'Festival della Musica 2023',
      date: '30 Giugno 2023',
      location: 'Firenze, Italia',
      image: 'https://eosmarketing.it/upload/img/c/1000x667-Eventi-aziendali-guida-alle-tipologie-e-a-come-organizzarli-post-Coronavirus.jpg',
      description: 'Vivi una notte magica con le migliori band dal vivo in una location spettacolare.'
    },
    {
      id: 5,
      title: 'Esposizione d’Arte Moderna 2023',
      date: '20 Luglio 2023',
      location: 'Torino, Italia',
      image: 'https://www.startupbusiness.it/wp-content/uploads/2024/05/conferences-3.png',
      description: 'Scopri le opere d’arte più innovative in un evento che celebra la creatività.'
    }
  ];
}
