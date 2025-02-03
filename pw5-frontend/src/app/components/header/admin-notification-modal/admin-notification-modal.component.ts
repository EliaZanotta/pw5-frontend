import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { InboxService, AdminNotification } from '../inbox.service';
import { DatePipe, NgForOf, NgIf, CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-notification-modal',
  standalone: true,
  templateUrl: './admin-notification-modal.component.html',
  styleUrls: ['./admin-notification-modal.component.css'],
  imports: [CommonModule, DatePipe, NgIf, NgForOf]
})
export class AdminNotificationModalComponent implements OnChanges {
  @Input() notifications: AdminNotification[] = [];
  @Input() show: boolean = false;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  loading: boolean = false;

  constructor(private inboxService: InboxService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show'] && changes['show'].currentValue) {
      this.fetchNotifications();
    }
  }

  close(): void {
    this.closeModal.emit();
  }

  private fetchNotifications(): void {
    this.loading = true;

    this.inboxService.getAdminNotifications().subscribe(
      (notifications) => {
        this.notifications = notifications;
        this.loading = false;
      },
      (err) => {
        console.error('Error fetching admin notifications:', err);
        this.loading = false;
      }
    );
  }
}
