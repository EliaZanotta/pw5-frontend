import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { InboxService, SpeakerRequest } from '../inbox.service';
import { NgForOf, NgIf, CommonModule } from '@angular/common';

@Component({
  selector: 'app-speaker-request-modal',
  standalone: true,
  templateUrl: './speaker-request-modal.component.html',
  styleUrls: ['./speaker-request-modal.component.css'],
  imports: [CommonModule, NgIf, NgForOf]
})
export class SpeakerRequestModalComponent implements OnChanges {
  @Input() requests: SpeakerRequest[] = [];
  @Input() show: boolean = false;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  loading: boolean = false;

  constructor(private inboxService: InboxService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show'] && changes['show'].currentValue) {
      this.fetchRequests();
    }
  }

  close(): void {
    this.closeModal.emit();
  }

  private fetchRequests(): void {
    this.loading = true;

    this.inboxService.getSpeakerRequests().subscribe(
      (requests) => {
        this.requests = requests;
        this.loading = false;
      },
      (err) => {
        console.error('Error fetching speaker requests:', err);
        this.loading = false;
      }
    );
  }
}
