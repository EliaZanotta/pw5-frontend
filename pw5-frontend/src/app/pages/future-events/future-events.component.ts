import {Component, OnInit} from '@angular/core';
import {EventsService, CategorizedEvents, Event} from '../events/events.service';
import {formatDate, NgForOf, NgIf} from '@angular/common';
import {EventFilterComponent} from '../../components/event-filter/event-filter.component';
import {RouterLink} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-future-events',
  templateUrl: './future-events.component.html',
  styleUrls: ['./future-events.component.css'],
  imports: [NgIf, NgForOf, EventFilterComponent, RouterLink],
  standalone: true,
  providers: [EventsService]
})
export class FutureEventsComponent implements OnInit {
  allEvents: Event[] = [];
  eventsByCategory: { [key: string]: Event[] } = {future: [], past: []};
  futureEvents: Event[] = [];
  filteredEvents: Event[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';

  // Filter options
  allTitles: string[] = [];
  allTopics: string[] = [];
  allHosts: string[] = [];

  // Current filters
  filters = {
    title: '',
    date: null,
    topic: '',
    host: '',
    subscription: ''
  };

  constructor(private eventsService: EventsService) {
  }

  async ngOnInit(): Promise<void> {
    await this.fetchFutureEvents();
  }

  async fetchFutureEvents(): Promise<void> {
    this.allEvents = (await this.eventsService.getEvents()).events;
    this.eventsByCategory = this.categorizeEvents(this.allEvents);
    this.futureEvents = this.eventsByCategory['future'];
    this.filteredEvents = [...this.futureEvents];
    this.isLoading = false;
    this.initializeFilterOptions();
  }

  private categorizeEvents(events: Event[]): { future: Event[]; past: Event[] } {
    const futureEvents = events.filter(event => event.status === 'CONFIRMED');
    const pastEvents = events.filter(event => event.status === 'ARCHIVED');
    return {future: futureEvents, past: pastEvents};
  }

  initializeFilterOptions(): void {
    // Note: If any property is null, it is filtered out.
    this.allTitles = [...new Set(this.futureEvents.map(event => event.title))];
    this.allTopics = [...new Set(this.futureEvents.flatMap(event => event.topics || []))];
    this.allHosts = [...new Set(this.futureEvents.map(event => event.host || ''))].filter(host => host !== '');
  }

  applyFilters(newFilters: any): void {
    this.filters = newFilters;

    this.filteredEvents = this.futureEvents.filter(event => {
      // Use fallback values for potentially null fields
      const eventTitle = event.title || '';
      const eventHost = event.host || '';
      const eventSubscription = event.eventSubscription || '';

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
  }

  clearFilters(): void {
    this.filters = {
      title: '',
      date: null,
      topic: '',
      host: '',
      subscription: ''
    };
    this.filteredEvents = [...this.futureEvents];
  }

  // Format the event date for display
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
