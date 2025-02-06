import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { Speaker, SpeakerService } from '../all-speaker/all-speaker.service';
import { NgIf, NgForOf, CommonModule } from '@angular/common';
import { EventsService, Event } from '../events/events.service';

@Component({
  selector: 'app-speaker',
  standalone: true,
  imports: [MatCardModule, NgIf, NgForOf, CommonModule],
  templateUrl: './speaker.component.html',
  styleUrl: './speaker.component.css'
})
export class SpeakerComponent implements OnInit {

  speakerId!: string;
  speaker: Speaker | null = null;
  eventsAsSpeaker: Event[] = []; // Corretto: usa il tipo Event[]

  image: string = 'https://cdn-magazine.startupitalia.eu/wp-content/uploads/2024/11/25153624/PBO5180.jpg';

  constructor(private route: ActivatedRoute, private router: Router, private speakerService: SpeakerService, private eventsService: EventsService) { }

  async ngOnInit(): Promise<void> {
    // Recupera l'id del relatore dall'URL
    this.speakerId = this.route.snapshot.paramMap.get('id')!;

    // Recupera l'elenco degli speaker
    const speakers = await this.speakerService.getSpeakers();
    this.speaker = speakers.find(sp => sp.id === this.speakerId) || null;

    if (this.speaker) {
      // Recupera gli eventi a cui partecipa lo speaker
      const allEvents: Event[] = await this.eventsService.getEvents();
      console.log('All events:', allEvents);

      // Aggiungi una verifica per assicurarti che la data sia correttamente formattata come oggetto Date
      this.eventsAsSpeaker = allEvents.map(event => ({
        ...event,
        startDate: new Date(event.startDate).toISOString(),  // Converto la data in stringa ISO 8601
        endDate: new Date(event.endDate).toISOString(),      // Converto anche la data di fine
      }));

      console.log('Events for speaker:', this.eventsAsSpeaker); 
    }
  }

  goBack(): void {
    this.router.navigate(['/all-speaker']);
  }
}
