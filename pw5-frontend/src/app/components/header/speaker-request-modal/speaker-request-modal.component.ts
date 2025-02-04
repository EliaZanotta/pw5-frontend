import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { InboxService, SpeakerRequestWithEvent } from '../inbox.service';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-speaker-request-modal',
  standalone: true,
  templateUrl: './speaker-request-modal.component.html',
  styleUrls: ['./speaker-request-modal.component.css'],
  imports: [
    CommonModule,
    NgIf,
    NgForOf,
    MatButton,
    FaIconComponent
  ]
})
export class SpeakerRequestModalComponent implements OnChanges {
  // We now expect that each request will have an event property available.
  // Adjust the type if you plan to display more event details.
  @Input() requests: SpeakerRequestWithEvent[] = [];
  @Input() show: boolean = false;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  isHovered: boolean = false;
  loading: boolean = false;
  expandedRequests: { [requestId: string]: boolean } = {};

  constructor(private inboxService: InboxService) { }

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

  private async fetchRequests(): Promise<void> {
    this.loading = true;
    try {
      const requestsWithEvent: SpeakerRequestWithEvent[] = await firstValueFrom(
        this.inboxService.getSpeakerRequestsWithEventInfo()
      );
      console.log('Speaker Requests with Event Info:', requestsWithEvent);

      // Define the custom sort order for statuses
      const statusOrder = {
        'PENDING': 2,
        'CONFIRMED': 3,
        'REJECTED': 0
      };

      // Sort the requests accordingly
      this.requests = requestsWithEvent.sort(
        (a, b) => (statusOrder[a.status as keyof typeof statusOrder] || 99) - (statusOrder[b.status as keyof typeof statusOrder] || 99)      );
    } catch (err) {
      console.error('Error fetching speaker requests with event info:', err);
    } finally {
      this.loading = false;
    }
  }


  // This helper returns the event for the given request.
  // Adjust your template to use request.event directly if desired.
  getEvent(eventId: string): any {
    const req = this.requests.find(r => r.event?.id === eventId);
    return req ? req.event : undefined;
  }

  async confirmRequest(requestId: string): Promise<void> {
    try {
      await firstValueFrom(this.inboxService.confirmSpeakerRequest(requestId));
      console.log(`Confirm clicked for request ID: ${requestId}`);
      this.requests = this.requests.filter(request => request.id !== requestId);
    } catch (error) {
      console.error('Error confirming speaker request:', error);
    }
  }

  async rejectRequest(requestId: string): Promise<void> {
    try {
      await firstValueFrom(this.inboxService.rejectSpeakerRequest(requestId));
      console.log(`Reject clicked for request ID: ${requestId}`);
      this.requests = this.requests.filter(request => request.id !== requestId);
    } catch (error) {
      console.error('Error rejecting speaker request:', error);
    }
  }

  toggleExpanded(requestId: string): void {
    this.expandedRequests[requestId] = !this.expandedRequests[requestId];
  }

  isExpanded(requestId: string): boolean {
    return this.expandedRequests[requestId];
  }

  protected readonly faTimes = faTimes;
}
