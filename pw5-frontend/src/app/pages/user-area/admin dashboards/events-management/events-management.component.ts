import {Component, OnInit, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { EventsService, Event } from '../../../events/events.service';
import { AdminTableModule } from '../../../../modules/admin-table.module';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-events-management',
  templateUrl: './events-management.component.html',
  standalone: true,
  styleUrls: ['./events-management.component.css'],
  imports: [AdminTableModule],
})
export class EventsManagementComponent implements OnInit {
  displayedColumns: string[] = ['title', 'startDate', 'endDate', 'place', 'maxParticipants', 'host', 'actions'];
  dataSource = new MatTableDataSource<Event>();
  allEvents: Event[] = [];
  isDeleteModalOpen = false;
  eventIdToDelete: string | null = null;

  // Form controls for filtering
  titleSearchControl = new FormControl('');
  hostSearchControl = new FormControl('');

  // Autocomplete options
  filteredTitleOptions!: Observable<string[]>;
  filteredHostOptions!: Observable<string[]>;

  constructor(private eventsService: EventsService) {}

  async ngOnInit(): Promise<void> {
    await this.fetchEvents();

    // Initialize autocomplete filtering for both fields
    this.dataSource.paginator = this.paginator;
    this.filteredTitleOptions = this.titleSearchControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterOptions(value || '', Array.from(new Set(this.allEvents.map(event => event.title || '')))))
    );

    this.filteredHostOptions = this.hostSearchControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterOptions(value || '', Array.from(new Set(this.allEvents.map(event => event.host || '')))))
    );
  }
  async fetchEvents(): Promise<void> {
    try {
      const events = (await this.eventsService.getEvents()).events;
      console.log('Fetched events:', events);  // Log the events to inspect the response
      this.allEvents = events;
      this.dataSource.data = events;
    } catch (error) {
      console.error('Failed to load events:', error);
    }
  }

  private filterOptions(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter(option => option.toLowerCase().includes(filterValue));
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Filter the table based on title search input
  applyTitleFilter(): void {
    this.dataSource.paginator = this.paginator;
    const filterValue = this.titleSearchControl.value?.trim().toLowerCase() || '';
    this.dataSource.data = this.allEvents.filter(event =>
      event.title?.toLowerCase().includes(filterValue)
    );
  }

  // Filter the table based on host search input
  applyHostFilter(): void {
    const filterValue = this.hostSearchControl.value?.trim().toLowerCase() || '';
    this.dataSource.data = this.allEvents.filter(event =>
      event.host?.toLowerCase().includes(filterValue)
    );
  }

  // Open and close the delete modal
  openDeleteModal(eventId: string): void {
    this.eventIdToDelete = eventId;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.eventIdToDelete = null;
  }

  // Confirm and execute event deletion
  async confirmDelete(): Promise<void> {
    if (this.eventIdToDelete) {
      try {
        await this.eventsService.deleteEvent(this.eventIdToDelete);
        // Remove the event from the list after successful deletion
        this.allEvents = this.allEvents.filter(event => event.id !== this.eventIdToDelete);
        this.dataSource.data = this.allEvents;
        this.closeDeleteModal();
      } catch (error) {
        console.error('Failed to delete event:', error);  // Log any errors
      }
    }
  }
}
