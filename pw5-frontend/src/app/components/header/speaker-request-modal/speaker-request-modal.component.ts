import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { InboxService, SpeakerRequest } from '../inbox.service';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import {Event, EventsService} from '../../../pages/events/events.service';

@Component({
  selector: 'app-speaker-request-modal',
  standalone: true,
  templateUrl: './speaker-request-modal.component.html',
  styleUrls: ['./speaker-request-modal.component.css'],
  imports: [CommonModule, NgIf, NgForOf, MatButton, FaIconComponent]
})
export class SpeakerRequestModalComponent implements OnChanges {
  @Input() requests: SpeakerRequest[] = [];
  @Input() show: boolean = false;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  // If you wish to use only one selected event at a time
  selectedEvent: Event | null = null;

  isHovered: boolean = false;
  loading: boolean = false;

  // Dictionaries to track dropdown state and event details by request id.
  dropdownOpen: { [requestId: string]: boolean } = {};
  eventDetails: { [requestId: string]: Event } = {};

  constructor(
    private inboxService: InboxService,
    private eventsService: EventsService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show'] && changes['show'].currentValue) {
      document.body.classList.add('no-scroll');
      this.fetchRequests();
    } else if (changes['show'] && !changes['show'].currentValue) {
      document.body.classList.remove('no-scroll');
    }
  }

  close(): void {
    document.body.classList.remove('no-scroll');
    this.closeModal.emit();
  }

  private fetchRequests(): void {
    this.loading = true;
    this.inboxService.getSpeakerRequests().subscribe(
      (requests) => {
        // Sort requests so that PENDING requests come first
        this.requests = requests.sort((a, b) => {
          if (a.status === 'PENDING' && b.status !== 'PENDING') {
            return -1;
          } else if (a.status !== 'PENDING' && b.status === 'PENDING') {
            return 1;
          }
          return 0;
        });
        this.loading = false;
      },
      (err) => {
        console.error('Error fetching speaker requests:', err);
        this.loading = false;
      }
    );
  }

  confirmRequest(requestId: string): void {
    this.inboxService.confirmSpeakerRequest(requestId).subscribe(
      () => {
        console.log(`Conferma clicked for request ID: ${requestId}`);
        // Optionally remove the confirmed request from the list.
        this.requests = this.requests.filter(request => request.id !== requestId);
      },
      error => {
        console.error('Error confirming speaker request:', error);
      }
    );
  }

  rejectRequest(requestId: string): void {
    this.inboxService.rejectSpeakerRequest(requestId).subscribe(
      () => {
        console.log(`Rifiuta clicked for request ID: ${requestId}`);
        // Optionally remove the rejected request from the list.
        this.requests = this.requests.filter(request => request.id !== requestId);
      },
      error => {
        console.error('Error rejecting speaker request:', error);
      }
    );
  }


  async toggleEventDetails(request: SpeakerRequest): Promise<void> {
    // If the selected event is already open for this request, close it.
    if (this.selectedEvent && this.selectedEvent.id === request.eventId) {
      this.selectedEvent = null;
      return;
    }
    try {
      this.selectedEvent = await this.eventsService.getEventById(request.eventId);
      console.log('Fetched event details:', this.selectedEvent);
    } catch (error) {
      console.error('Error fetching event details for event id:', request.eventId, error);
    }
  }

  protected readonly faTimes = faTimes;
}
