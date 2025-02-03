import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, HostListener, ElementRef } from '@angular/core';
import { InboxService, AdminNotification } from '../inbox.service';
import { DatePipe, NgForOf, NgIf, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {catchError, from, of} from 'rxjs';

@Component({
  selector: 'app-admin-notification-modal',
  standalone: true,
  templateUrl: './admin-notification-modal.component.html',
  styleUrls: ['./admin-notification-modal.component.css'],
  imports: [CommonModule, DatePipe, NgIf, NgForOf, MatButtonModule, MatIconModule],
})
export class AdminNotificationModalComponent implements OnChanges {
  @Input() notifications: AdminNotification[] = [];
  @Input() show: boolean = false;
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  sortedNotifications: AdminNotification[] = [];

  constructor(private inboxService: InboxService, private elementRef: ElementRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['notifications'] || changes['show']) {
      if (this.notifications.length > 0) {
        this.sortNotifications();
      }

      if (this.show) {
        this.lockBodyScroll();
        this.fetchNotifications();
      } else {
        this.unlockBodyScroll();
      }
    }
  }

  close(): void {
    this.unlockBodyScroll();
    this.closeModal.emit();
  }

  // API call to accept the notification
  acceptNotification(notificationId: string): void {
    from(this.inboxService.acceptNotification(notificationId)).pipe(
      catchError((error) => {
        console.error('Error accepting notification:', error);
        return of(null);
      })
    ).subscribe(() => {
      this.updateNotificationStatus(notificationId, 'ACCEPTED');
    });
  }

  rejectNotification(notificationId: string): void {
    this.inboxService.rejectNotification(notificationId).subscribe({
      next: () => {
        console.log('Notification rejected successfully.');
        this.updateNotificationStatus(notificationId, 'REJECTED');
      },
      error: (err) => {
        if (err.message === 'Unauthorized: User is not an admin.') {
          alert('You do not have permission to reject this notification.');
        } else {
          console.error('Error rejecting notification:', err);
        }
      }
    });
  }


  private updateNotificationStatus(notificationId: string, status: string): void {
    this.notifications = this.notifications.map((note) =>
      note.id === notificationId ? { ...note, status } : note
    );
    this.sortNotifications();
  }

  private sortNotifications(): void {
    // Move UNREAD notifications to the top, keeping others below
    this.sortedNotifications = [...this.notifications].sort((a, b) => {
      if (a.status === 'UNREAD' && b.status !== 'UNREAD') return -1;
      if (a.status !== 'UNREAD' && b.status === 'UNREAD') return 1;
      return 0;
    });
  }

  private fetchNotifications(): void {
    this.inboxService.getAdminNotifications().subscribe(
      (notifications) => {
        this.notifications = notifications;
        this.sortNotifications();
      },
      (err) => {
        console.error('Error fetching admin notifications:', err);
      }
    );
  }

  private lockBodyScroll(): void {
    document.body.classList.add('no-scroll');
  }

  private unlockBodyScroll(): void {
    document.body.classList.remove('no-scroll');
  }

}
