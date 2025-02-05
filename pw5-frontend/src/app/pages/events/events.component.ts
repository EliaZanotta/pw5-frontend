import {Component, OnInit} from '@angular/core';
import {Event, EventsService} from './events.service';
import {RouterLink} from '@angular/router';
import {CommonModule, NgForOf, NgIf, registerLocaleData} from '@angular/common';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faSackDollar, faFilterCircleXmark} from '@fortawesome/free-solid-svg-icons';
import localeIt from '@angular/common/locales/it';
import { FiltersModule } from '../../modules/filters.module';
import { EventFilterComponent } from '../../components/event-filter/event-filter.component';
import { NgModule, LOCALE_ID } from '@angular/core';

registerLocaleData(localeIt);

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
  standalone: true,
  imports: [
    RouterLink,
    NgForOf,
    NgIf,
    FontAwesomeModule,
    FiltersModule,
    CommonModule,
    EventFilterComponent
  ],
  providers: [{provide: 'LOCALE_ID', useValue: 'it-IT'}]
})
export class EventsComponent implements OnInit {
  // These two properties store the full events list and the currently displayed (filtered) events
  allEvents: Event[] = [];
  eventsByCategory: { [key: string]: Event[] } = {future: [], past: []};

  // Filter options for the autocomplete components
  allTitles: string[] = [];
  allTopics: string[] = [];
  allHosts: string[] = [];

  // Current filters – these are passed from the child filter component
  filters = {
    title: '',
    date: null,
    topic: '',
    host: '',
    subscription: ''
  };

  faSackDollar = faSackDollar;

  constructor(private eventsService: EventsService) {
  }

  async ngOnInit(): Promise<void> {
    await this.fetchEvents();
  }

  // Fetch events once and then cache them in allEvents.
  async fetchEvents(): Promise<void> {
    this.allEvents = (await this.eventsService.getEvents()).events;
    this.initializeFilterOptions(this.allEvents);
    this.eventsByCategory = this.categorizeEvents(this.allEvents);
  }

  // Categorize events into "future" and "past"
  private categorizeEvents(events: Event[]): { future: Event[]; past: Event[] } {
    const futureEvents = events.filter(event => event.status === 'CONFIRMED');
    const pastEvents = events.filter(event => event.status === 'ARCHIVED');
    return {future: futureEvents, past: pastEvents};
  }

  // Initialize the autocomplete option lists.
  private initializeFilterOptions(events: Event[]): void {
    this.allTitles = [...new Set(events.map(event => event.title))];
    this.allTopics = [...new Set(events.flatMap(event => event.topics || []))];
    // For hosts, if an event host is null, use an empty string so that the set does not include null.
    this.allHosts = [
      ...new Set(events.map(event => event.host ? event.host : ''))
    ].filter(h => h !== ''); // remove empty values if desired
  }

  // Called when filters change (emitted from the child filter component).
  applyFilters(newFilters: any): void {
    this.filters = newFilters;

    // Filter from the cached full list.
    const filteredEvents = this.allEvents.filter(event => {
      // For fields that might be null, we provide a default empty string.
      const eventTitle = event.title || '';
      const eventHost = event.host ? event.host : '';
      const eventSubscription = event.eventSubscription ? event.eventSubscription : '';

      const matchesTitle = this.filters.title
        ? eventTitle.toLowerCase().includes(this.filters.title.toLowerCase())
        : true;

      const matchesDate = this.filters.date
        ? new Date(event.startDate).toDateString() === new Date(this.filters.date).toDateString()
        : true;

      const matchesTopic = this.filters.topic
        ? (event.topics || []).some(topic =>
          topic.toLowerCase().includes(this.filters.topic.toLowerCase())
        )
        : true;

      const matchesHost = this.filters.host
        ? eventHost.toLowerCase().includes(this.filters.host.toLowerCase())
        : true;

      const matchesSubscription = this.filters.subscription
        ? eventSubscription === this.filters.subscription
        : true;

      return matchesTitle && matchesDate && matchesTopic && matchesHost && matchesSubscription;
    });

    this.eventsByCategory = this.categorizeEvents(filteredEvents);
  }

  // Reset filters and show all events again.
  clearFilters(): void {
    this.filters = {
      title: '',
      date: null,
      topic: '',
      host: '',
      subscription: ''
    };
    this.eventsByCategory = this.categorizeEvents(this.allEvents);
  }
}
