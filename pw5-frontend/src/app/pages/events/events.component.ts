import { Event, EventsService } from './events.service';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, NgForOf, NgIf, registerLocaleData } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSackDollar } from '@fortawesome/free-solid-svg-icons';
import localeIt from '@angular/common/locales/it';
import { FiltersModule } from '../../modules/filters.module';
import {MatButton} from '@angular/material/button';
import { faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';
import {MatTooltip} from '@angular/material/tooltip';


registerLocaleData(localeIt);

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
  imports: [
    RouterLink,
    NgForOf,
    NgIf,
    FontAwesomeModule,
    FiltersModule,
    CommonModule,
    MatTooltip
  ],
  standalone: true,
  providers: [
    { provide: LOCALE_ID, useValue: 'it-IT' }
  ]
})
export class EventsComponent implements OnInit {
  eventsByCategory: { [key: string]: Event[] } = { future: [], past: [] };
  faSackDollar = faSackDollar;
  faFilterCircleXmark = faFilterCircleXmark;

  // Filters
  filters = {
    title: '',
    date: null,
    topic: '',
    host: '',
    subscription: ''
  };

  // Autocomplete options
  allTitles: string[] = [];
  filteredTitles: string[] = [];
  allTopics: string[] = [];
  filteredTopic: string[] = [];
  allHosts: string[] = [];
  filteredHosts: string[] = [];

  constructor(private eventsService: EventsService) {}

  ngOnInit(): void {
    this.eventsService.getEvents().subscribe((events: Event[]) => {
      this.eventsByCategory = this.categorizeEvents(events);
      this.initializeAutocompleteOptions(events);
    });
  }

  private categorizeEvents(events: Event[]): { future: Event[]; past: Event[] } {
    const futureEvents: Event[] = events.filter(event => event.status === 'CONFIRMED');
    const pastEvents: Event[] = events.filter(event => event.status === 'ARCHIVED');
    return { future: futureEvents, past: pastEvents };
  }

  private initializeAutocompleteOptions(events: Event[]): void {
    this.allTitles = [...new Set(events.map(event => event.title))];
    this.allTopics = [...new Set(events.flatMap(event => event.topics))];
    this.allHosts = [...new Set(events.map(event => event.host))];

    this.filteredTitles = this.allTitles;
    this.filteredTopic = this.allTopics;
    this.filteredHosts = this.allHosts;
  }

  applyFilters(): void {
    const { title, date, topic, host, subscription } = this.filters;

    this.eventsService.getEvents().subscribe((events: Event[]) => {
      const filteredEvents = events.filter(event => {
        const matchesTitle = title ? event.title.toLowerCase().includes(title.toLowerCase()) : true;
        const matchesDate = date ? new Date(event.startDate).toDateString() === new Date(date).toDateString() : true;
        const matchesTopic = topic ? event.topics.some(t => t.toLowerCase().includes(topic.toLowerCase())) : true;
        const matchesHost = host ? event.host.toLowerCase().includes(host.toLowerCase()) : true;
        const matchesSubscription = subscription ? event.eventSubscription === subscription : true;

        return matchesTitle && matchesDate && matchesTopic && matchesHost && matchesSubscription;
      });

      this.eventsByCategory = this.categorizeEvents(filteredEvents);
    });

    this.updateAutocompleteSuggestions();
  }

  private updateAutocompleteSuggestions(): void {
    const { title, topic, host } = this.filters;

    this.filteredTitles = this.allTitles.filter(t => t.toLowerCase().includes(title.toLowerCase()));
    this.filteredTopic = this.allTopics.filter(t => t.toLowerCase().includes(topic.toLowerCase()));
    this.filteredHosts = this.allHosts.filter(h => h.toLowerCase().includes(host.toLowerCase()));
  }
  clearFilters(): void {
    this.filters = {
      title: '',
      date: null,
      topic: '',
      host: '',
      subscription: ''
    };
    this.applyFilters();
  }

}
