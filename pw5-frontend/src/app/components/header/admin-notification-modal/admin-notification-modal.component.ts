import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ElementRef } from '@angular/core';
import { InboxService, AdminNotification } from '../inbox.service';
import { DatePipe, NgForOf, NgIf, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { catchError, from, of } from 'rxjs';

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

  // Chiamata API per accettare la notifica
  acceptNotification(notificationId: string): void {
    from(this.inboxService.acceptNotification(notificationId))
      .pipe(
        catchError((error) => {
          console.error('Errore durante l\'accettazione della notifica:', error);
          return of(null);
        })
      )
      .subscribe(() => {
        // Rimuove la notifica dalla lista visualizzata
        this.removeNotification(notificationId);
      });
  }

  // Chiamata API per rifiutare la notifica
  rejectNotification(notificationId: string): void {
    this.inboxService.rejectNotification(notificationId).subscribe({
      next: () => {
        console.log('Notifica rifiutata con successo.');
        // Rimuove la notifica dalla lista visualizzata
        this.removeNotification(notificationId);
      },
      error: (err) => {
        if (err.message === 'Unauthorized: User is not an admin.') {
          alert('Non hai il permesso di rifiutare questa notifica.');
        } else {
          console.error('Errore durante il rifiuto della notifica:', err);
        }
      }
    });
  }

  // Rimuove la notifica dalla lista corrente
  private removeNotification(notificationId: string): void {
    this.sortedNotifications = this.sortedNotifications.filter(
      (note) => note.id !== notificationId
    );
  }

  // Ordina le notifiche in modo che quelle non lette siano in cima
  private sortNotifications(): void {
    this.sortedNotifications = [...this.notifications].sort((a, b) => {
      if (a.status === 'UNREAD' && b.status !== 'UNREAD') return -1;
      if (a.status !== 'UNREAD' && b.status === 'UNREAD') return 1;
      return 0;
    });
  }

  // Ricarica le notifiche dal backend quando la modale viene aperta
  private fetchNotifications(): void {
    this.inboxService.getAdminNotifications().subscribe(
      (notifications) => {
        this.notifications = notifications;
        this.sortNotifications();
      },
      (err) => {
        console.error('Errore durante il recupero delle notifiche admin:', err);
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
