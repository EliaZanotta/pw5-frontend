import { Component, OnInit } from '@angular/core';
import { Event, EventsService } from './events.service';
import { RouterLink } from '@angular/router';
import { CommonModule, NgForOf, NgIf, registerLocaleData } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSackDollar, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';
import localeIt from '@angular/common/locales/it';
import { FiltersModule } from '../../modules/filters.module';
import {EventFilterComponent} from '../../components/event-filter/event-filter.component';

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
    EventFilterComponent
  ],
  standalone: true,
  providers: [{ provide: 'LOCALE_ID', useValue: 'it-IT' }]
})
export class EventsComponent implements OnInit {
  eventsByCategory: { [key: string]: Event[] } = { future: [], past: [] };
  filteredEvents: Event[] = [];
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

  // Filter options
  allTitles: string[] = [];
  allTopics: string[] = [];
  allHosts: string[] = [];

  constructor(private eventsService: EventsService) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
    this.eventsService.getEvents().subscribe((events: Event[]) => {
      this.eventsByCategory = this.categorizeEvents(events);
      this.initializeFilterOptions(events);
    });
  }

  private categorizeEvents(events: Event[]): { future: Event[]; past: Event[] } {
    const futureEvents = events.filter(event => event.status === 'CONFIRMED');
    const pastEvents = events.filter(event => event.status === 'ARCHIVED');
    return { future: futureEvents, past: pastEvents };
  }

  private initializeFilterOptions(events: Event[]): void {
    this.allTitles = [...new Set(events.map(event => event.title))];
    this.allTopics = [...new Set(events.flatMap(event => event.topics || []))];
    this.allHosts = [...new Set(events.map(event => event.host))];
  }

  applyFilters(newFilters: any): void {
    this.filters = newFilters;

    this.eventsService.getEvents().subscribe((events: Event[]) => {
      const filteredEvents = events.filter(event => {
        const matchesTitle = this.filters.title ? event.title.toLowerCase().includes(this.filters.title.toLowerCase()) : true;
        const matchesDate = this.filters.date ? new Date(event.startDate).toDateString() === new Date(this.filters.date).toDateString() : true;
        const matchesTopic = this.filters.topic ? (event.topics || []).some(topic => topic.toLowerCase().includes(this.filters.topic.toLowerCase())) : true;
        const matchesHost = this.filters.host ? event.host.toLowerCase().includes(this.filters.host.toLowerCase()) : true;
        const matchesSubscription = this.filters.subscription ? event.eventSubscription === this.filters.subscription : true;

        return matchesTitle && matchesDate && matchesTopic && matchesHost && matchesSubscription;
      });

      this.eventsByCategory = this.categorizeEvents(filteredEvents);
    });
  }

  clearFilters(): void {
    this.filters = {
      title: '',
      date: null,
      topic: '',
      host: '',
      subscription: ''
    };
    this.fetchEvents();  // Reset events when filters are cleared
  }
}
