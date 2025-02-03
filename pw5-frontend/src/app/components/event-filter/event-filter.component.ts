import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import {faFilterCircleXmark} from '@fortawesome/free-solid-svg-icons';
import {FiltersModule} from '../../modules/filters.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-event-filter',
  templateUrl: './event-filter.component.html',
  styleUrls: ['./event-filter.component.css'],
  standalone: true,
  imports: [
    FontAwesomeModule,
    FiltersModule
  ]
})
export class EventFilterComponent implements OnInit {
  @Input() allTitles: string[] = [];
  @Input() allTopics: string[] = [];
  @Input() allHosts: string[] = [];
  @Output() filtersChanged = new EventEmitter<any>();
  @Output() clearFiltersEvent = new EventEmitter<void>();

  filters = {
    title: '',
    date: null,
    topic: '',
    host: '',
    subscription: ''
  };

  filteredTitles: string[] = [];
  filteredTopic: string[] = [];
  filteredHosts: string[] = [];
  faFilterCircleXmark = faFilterCircleXmark;

  ngOnInit(): void {
    this.filteredTitles = this.allTitles;
    this.filteredTopic = this.allTopics;
    this.filteredHosts = this.allHosts;
  }

  applyFilters(): void {
    this.updateAutocompleteSuggestions();
    this.filtersChanged.emit(this.filters);
  }

  updateAutocompleteSuggestions(): void {
    const {title, topic, host} = this.filters;

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
    this.clearFiltersEvent.emit();
  }
}
