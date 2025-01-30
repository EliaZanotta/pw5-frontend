import { Component } from '@angular/core';

@Component({
  selector: 'app-future-events',
  templateUrl: './future-events.component.html',
  styleUrls: ['./future-events.component.css']
})
export class FutureEventsComponent {
  futureEvents = [
    {
      id: 1,
      title: 'Festival della Pizza',
      date: '15 Marzo 2025',
      location: 'Milano, Italia',
      image: 'https://cdn-magazine.startupitalia.eu/wp-content/uploads/2024/11/25153624/PBO5180.jpg',
      description: 'Un evento imperdibile per tutti gli amanti della pizza con i migliori chef italiani.'
    },
    {
      id: 2,
      title: 'Conferenza Tecnologica',
      date: '25 Aprile 2025',
      location: 'Bologna, Italia',
      image: 'https://www.4writing.it/wp-content/uploads/2024/12/btw_generica.jpg',
      description: 'Scopri le ultime innovazioni nel mondo della tecnologia e dell’intelligenza artificiale.'
    },
    {
      id: 3,
      title: 'Maratona di Beneficenza',
      date: '10 Maggio 2025',
      location: 'Napoli, Italia',
      image: 'https://www.startupbusiness.it/wp-content/uploads/2024/05/TechBBQ-2022-Day-1-123.jpg',
      description: 'Partecipa alla maratona per supportare le associazioni benefiche locali.'
    },
    {
      id: 4,
      title: 'Festival della Musica',
      date: '30 Giugno 2025',
      location: 'Firenze, Italia',
      image: 'https://www.startupbusiness.it/wp-content/uploads/2024/09/Foto-9-3-24_-10-53-29.webp',
      description: 'Vivi una notte magica con le migliori band dal vivo in una location spettacolare.'
    },
    {
      id: 5,
      title: 'Esposizione d’Arte Moderna',
      date: '20 Luglio 2025',
      location: 'Torino, Italia',
      image: 'https://www.startupmag.it/wp-content/uploads/2022/10/web-summit-lisbona-foto-e1665485128802-800x445.jpg',
      description: 'Scopri le opere d’arte più innovative in un evento che celebra la creatività.'
    }
  ];
}
