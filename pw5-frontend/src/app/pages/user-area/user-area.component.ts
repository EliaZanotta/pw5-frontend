import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService, User} from '../../auth/auth.service';
import {Event, EventsService} from '../events/events.service';
import {AsyncPipe} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpErrorResponse} from '@angular/common/http';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faPlus, faMinus, faCircleExclamation} from '@fortawesome/free-solid-svg-icons';
import {Topic, TopicService} from '../../topic.service';
import {UserService} from '../../user.service';
import {
  MatTableDataSource
} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {FormControl, FormsModule} from '@angular/forms';
import {async, Observable, startWith, firstValueFrom} from 'rxjs';
import {map} from 'rxjs/operators';
import {EventsManagementComponent} from './admin dashboards/events-management/events-management.component';
import {HostManagementComponent} from './admin dashboards/host-management/host-management.component';
import {UserManagementComponent} from './admin dashboards/user-management/user-management.component';
import {InboxService} from '../../components/header/inbox.service';
import {MatCheckbox} from '@angular/material/checkbox';
import {AdminTableModule} from '../../modules/admin-table.module';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';


@Component({
  selector: 'app-user-area',
  templateUrl: './user-area.component.html',
  styleUrls: ['./user-area.component.css'],
  imports: [ AdminTableModule, FontAwesomeModule, RouterLink, AsyncPipe, EventsManagementComponent,
    HostManagementComponent, UserManagementComponent, MatCheckbox, FormsModule],
  standalone: true
})
export class UserAreaComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  searchControl = new FormControl('');
  filteredOptions!: Observable<string[]>;

  faPlus = faPlus;
  faMinus = faMinus;
  faCircleExclamation = faCircleExclamation

  user: User | null = null;
  eventsAsSpeaker: Event[] | null = null;
  userUnfavTopics: Topic[] | null = null;

  allTopics: Topic[] | null = null;
  displayedColumns: string[] = ['name'];
  dataSource = new MatTableDataSource<Topic>();

  avatar: string = 'https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg'
  image: string = 'https://cdn-magazine.startupitalia.eu/wp-content/uploads/2024/11/25153624/PBO5180.jpg'

  selectedTab: string = 'bookedEvents';
  isConfirmTicketModalOpen: boolean = false;
  isRevokeEventModalOpen: boolean = false;
  selectedEvent: Event | null = null;
  isSpeaker = false;

  constructor(private router: Router, private authService: AuthService, private eventsService: EventsService, private snackBar: MatSnackBar, private topicService: TopicService, private userService: UserService, private inboxservice: InboxService) {
  }

  async ngOnInit(): Promise<void> {
    this.dataSource.paginator = this.paginator;
    try {
      this.user = (await this.authService.getLoggedUser()).user;
      this.allTopics = (await this.topicService.getALlTopics()).topics;
      if (this.allTopics) {
        this.userUnfavTopics = this.allTopics.filter(topic =>
          !this.user?.userDetails?.favouriteTopics?.some((favTopic: Topic) => favTopic.id === topic.id)
        );
        if (this.user) {
          this.isSpeaker = this.user.role === 'SPEAKER';
        }
      }
      const savedTab = localStorage.getItem('selectedTab');
      if (savedTab) {
        this.selectedTab = savedTab;
      } else {
        localStorage.setItem('selectedTab', this.selectedTab);
      }
      if (this.isSpeaker) {
        const speakerRequestsWithEvent = await firstValueFrom(this.inboxservice.getSpeakerRequestsWithEventInfo());
        this.eventsAsSpeaker = speakerRequestsWithEvent.filter(request => request.status === 'CONFIRMED' && !!request.event
        ).map(request => request.event as Event);

      }
    } catch (errorResponse: any) {
      if (errorResponse.status === 401) {
        await this.router.navigate(['/auth/login']);
      }
    }
  }

  async ngAfterViewInit(): Promise<void> {
    try {
      this.user = (await this.authService.getLoggedUser()).user;
      this.allTopics = (await this.topicService.getALlTopics()).topics;
      if (this.user?.role === 'ADMIN' && this.allTopics) {
        this.dataSource = new MatTableDataSource<Topic>(this.allTopics);
        this.dataSource.paginator = this.paginator;
        this.filteredOptions = this.searchControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value ?? ''))
        );
      }
      const savedTab = localStorage.getItem('selectedTab');
      if (savedTab) {
        this.selectedTab = savedTab;
      } else {
        localStorage.setItem('selectedTab', this.selectedTab);
      }
    } catch (errorResponse: any) {
      if (errorResponse.status === 401) {
        await this.router.navigate(['/auth/login']);
      }
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.dataSource.data
      .map(topic => topic.name)
      .filter(name => name?.toLowerCase().includes(filterValue)) as string[];
  }

  applyFilter(value: string | null) {
    this.dataSource.paginator = this.paginator;
    this.dataSource.filter = (value ?? '').trim().toLowerCase();
  }


  deleteTopic(name: string) {
    this.dataSource.data = this.dataSource.data.filter(topic => topic.name !== name);
  }

  setTab(tab: string): void {
    this.selectedTab = tab;
    localStorage.setItem('selectedTab', tab);
  }

  openConfirmTicketModal(event: Event) {
    if (!this.isConfirmTicketModalOpen) {
      this.selectedEvent = event;
      this.isConfirmTicketModalOpen = true;
    }
  }

  openRevokeEventModal(event: Event) {
    if (!this.isRevokeEventModalOpen) {
      this.selectedEvent = event;
      this.isRevokeEventModalOpen = true;
    }
  }

  closeModal(): void {
    this.isConfirmTicketModalOpen = false;
    this.isRevokeEventModalOpen = false;
    this.selectedEvent = null;
  }

  activateTicket(): void {
    alert(`✅ Ticket attivato per: ${this.selectedEvent?.title || "evento"}!`);
    this.closeModal();
  }

  async revokeEvent(): Promise<void> {
    const payload = {
      id: this.selectedEvent?.id
    }

    try {
      let response = await this.eventsService.revokeEvent(payload);
      let event = response.event;
      if (event) {
        this.snackBar.open('Evento revocato con successo!', 'Chiudi', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'success-snackbar'
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (errorResponse) {
      if (errorResponse instanceof HttpErrorResponse) {
        this.snackBar.open("Errore durante la revoca dell'evento", 'Chiudi', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'error-snackbar'
        });
      }
    }
    this.closeModal();
  }

  async logout() {
    let response = await this.authService.logout();
    if (response) {
      await this.router.navigate(['/']);
      window.location.reload();
    }
  }

  async removeFavouriteTopic(topic: Topic) {
    try {
      if (topic.id != null) {
        let response = await this.userService.removeFavouriteTopic(topic.id);
        if (response.user) {
          this.snackBar.open('Argomento rimosso dai preferiti con successo!', 'Chiudi', {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: 'success-snackbar'
          });
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }
      }
    } catch (errorResponse: any) {
      if (errorResponse instanceof HttpErrorResponse) {
        this.snackBar.open('Errore durante la rimozione dell\'argomento dai preferiti', 'Chiudi', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'error-snackbar'
        });
      }
    }
  }

  async addFavouriteTopic(topic: Topic) {
    try {
      if (topic.id != null) {
        let response = await this.userService.addFavouriteTopic(topic.id);
        if (response.user) {
          this.snackBar.open('Argomento aggiunto ai preferiti con successo!', 'Chiudi', {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: 'success-snackbar'
          });
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }
      }
    } catch (errorResponse: any) {
      if (errorResponse instanceof HttpErrorResponse) {
        this.snackBar.open('Errore durante l\'aggiunta dell\'argomento ai preferiti', 'Chiudi', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'error-snackbar'
        });
      }
    }
  }

  async toggleSpeaker(checked: boolean): Promise<void> {
    try {
      if (checked && this.user?.role !== 'SPEAKER') {
        // Call service to become speaker
        await this.userService.becomeSpeaker();
        if (this.user) {
          this.user.role = 'SPEAKER';
          this.isSpeaker = true;
        }
        this.snackBar.open(
          '🎤 Sei diventato uno speaker, puoi essere ora invitato a parlare agli eventi!',
          'Chiudi',
          {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: 'success-snackbar'
          }
        );
      } else if (!checked && this.user?.role !== 'USER') {
        // Call service to revert role to user
        await this.userService.becomeSpeaker();
        if (this.user) {
          this.user.role = 'USER';
          this.isSpeaker = false;
        }
        this.snackBar.open(
          '😢 Sei diventato uno user, non puoi più essere invitato a parlare agli eventi!',
          'Chiudi',
          {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: 'error-snackbar'
          }
        );
      }
    } catch (error) {
      console.error('Errore durante il cambio di ruolo', error);
      // Optionally, display an error snackbar here
      this.snackBar.open(
        'Si è verificato un errore durante il cambio di ruolo!',
        'Chiudi',
        {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        }
      );
    }
  }

  protected readonly async = async;

  async downloadTicketPDF(eventTicket: Event) {
    try {
      // Get all booked tickets for the logged user
      const bookedTickets = await this.eventsService.getUserBookedTickets();

      // Find the ticket that matches the event ID
      const matchingTicket = bookedTickets.find((ticket: { eventId: string; }) => ticket.eventId === eventTicket.id);

      if (matchingTicket) {
        const qrCodeUrl = matchingTicket.qrCodeUrl;
        alert(`🎫 Ticket QR Code URL: ${qrCodeUrl}`);
        this.generatePDF(matchingTicket, qrCodeUrl);
      } else {
        this.snackBar.open('Nessun ticket trovato per questo evento!', 'Chiudi', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'error-snackbar'
        });
      }
    } catch (error) {
      console.error('Error during ticket download:', error);
      this.snackBar.open('Errore durante il download del ticket!', 'Chiudi', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'error-snackbar'
      });
    }
  }

  async generatePDF(ticket: any, qrCodeUrl: string) {
    const doc = new jsPDF();

    try {
      // Extract the ticket code from the URL (split by `/`)
      const ticketCode = qrCodeUrl.split('/').slice(-2, -1)[0];

      // Construct the new URL using ticketCode
      const newQrCodeUrl = `http://localhost:4200/qr-code?ticketCode=${ticketCode}`;

      // Generate the QR code for the new URL
      const qrCodeImage = await QRCode.toDataURL(newQrCodeUrl);

      // Add ticket details to the PDF
      doc.text('Ticket Information', 10, 10);
      doc.text(`Event ID: ${ticket.eventId}`, 10, 20);
      doc.text(`Ticket Code: ${ticketCode}`, 10, 30);

      // Add the new QR code to the PDF
      doc.addImage(qrCodeImage, 'PNG', 10, 40, 50, 50);

      // Save the PDF
      doc.save('ticket.pdf');
    } catch (error) {
      console.error('Error generating QR code:', error);
      this.snackBar.open('Errore durante la generazione del PDF!', 'Chiudi', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'error-snackbar'
      });
    }
  }
}
