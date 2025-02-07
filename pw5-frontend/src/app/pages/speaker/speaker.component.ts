import {Component, OnInit} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {ActivatedRoute, Router} from '@angular/router';
import {Speaker, SpeakerService} from '../all-speaker/all-speaker.service';
import {NgIf, NgForOf, CommonModule} from '@angular/common';
import {Event} from '../events/events.service';
import {firstValueFrom} from 'rxjs';
import {InboxService} from '../../components/header/inbox.service';
import {faInstagram, faLinkedin, faFacebook} from '@fortawesome/free-brands-svg-icons';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';


@Component({
  selector: 'app-speaker',
  standalone: true,
  imports: [MatCardModule, NgIf, NgForOf, CommonModule, FontAwesomeModule],
  templateUrl: './speaker.component.html',
  styleUrl: './speaker.component.css'
})
export class SpeakerComponent implements OnInit {
  faInstagram = faInstagram;
  faLinkedin = faLinkedin;
  faFacebook = faFacebook;

  speakerId!: string;
  speaker: Speaker | null = null;
  eventsAsSpeaker: Event[] = [];

  image: string = 'https://cdn-magazine.startupitalia.eu/wp-content/uploads/2024/11/25153624/PBO5180.jpg';

  constructor(private route: ActivatedRoute, private router: Router, private speakerService: SpeakerService, private inboxservice: InboxService, private library: FaIconLibrary) {
    library.addIcons(faInstagram, faLinkedin, faFacebook);
  }

  async ngOnInit(): Promise<void> {
    // Recupera l'id del relatore dall'URL
    this.speakerId = this.route.snapshot.paramMap.get('id')!;

    // Recupera l'elenco degli speaker
    const speakers = await this.speakerService.getSpeakers();
    this.speaker = speakers.find(sp => sp.id === this.speakerId) || null;

    if (this.speaker) {
      const speakerRequestsWithEvent = await firstValueFrom(this.inboxservice.getSpeakerConfirmedRequestsWithEventInfo(this.speaker.id));
      this.eventsAsSpeaker = speakerRequestsWithEvent.filter(request => !!request.event
      ).map(request => request.event as Event);
      console.log(this.eventsAsSpeaker);
    }
  }

  async goBack(): Promise<void> {
    await this.router.navigate(['/all-speaker']);
  }
}
