import {EventsService} from './events.service';
import {Component, OnInit, LOCALE_ID, NgModule} from '@angular/core';
import {RouterLink} from '@angular/router';
import {DatePipe, NgForOf, NgIf, registerLocaleData} from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEuroSign } from '@fortawesome/free-solid-svg-icons';
import localeIt from '@angular/common/locales/it';

registerLocaleData(localeIt);

interface Event {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  place: string;
  host: string;
  eventSubscription: string;
  status: string;
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
  imports: [
    RouterLink,
    NgForOf,
    DatePipe,
    NgIf,
    FontAwesomeModule
  ],
  standalone: true,
  providers: [{provide: LOCALE_ID, useValue: 'it-IT'}]
})

export class EventsComponent implements OnInit {
  faEuroSign = faEuroSign;

  eventsByCategory: { [key: string]: Event[] } = {
    future: [],
    past: []
  };

  constructor(private eventsService: EventsService) {
  }

  ngOnInit(): void {
    this.eventsService.getEvents().subscribe((events: Event[]) => {
      this.eventsByCategory = this.categorizeEvents(events);
    });
  }

  private categorizeEvents(events: Event[]): { future: Event[]; past: Event[] } {
    const futureEvents: Event[] = events.filter(event => event.status === 'CONFIRMED');
    const pastEvents: Event[] = events.filter(event => event.status === 'ARCHIVED');

    return {future: futureEvents, past: pastEvents};
  }
}

