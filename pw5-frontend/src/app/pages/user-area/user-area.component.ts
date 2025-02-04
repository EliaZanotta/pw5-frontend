import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {AuthService, User} from '../../auth/auth.service';
import {Event, EventsService} from '../events/events.service';
import {AsyncPipe, DatePipe, NgForOf, NgIf} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpErrorResponse} from '@angular/common/http';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faPlus, faMinus, faCircleExclamation} from '@fortawesome/free-solid-svg-icons';
import {Topic, TopicService} from '../../topic.service';
import {UserService} from '../../user.service';
import {
  MatCell, MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable,
  MatTableDataSource
} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {async, Observable, startWith} from 'rxjs';
import {map} from 'rxjs/operators';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {EventsManagementComponent} from './admin dashboards/events-management/events-management.component';
import {HostManagementComponent} from './admin dashboards/host-management/host-management.component';
import {UserManagementComponent} from './admin dashboards/user-management/user-management.component';


@Component({
  selector: 'app-user-area',
  templateUrl: './user-area.component.html',
  styleUrls: ['./user-area.component.css'],
  imports: [DatePipe, NgForOf, NgIf, FontAwesomeModule, RouterLink, MatFormField, MatLabel, MatInput, ReactiveFormsModule, MatAutocompleteTrigger, MatAutocomplete, MatOption, MatTable, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatCell, MatCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatPaginator, AsyncPipe, EventsManagementComponent, HostManagementComponent, UserManagementComponent],
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
  selectedEvent: any = null;

  constructor(private router: Router, private authService: AuthService, private eventsService: EventsService, private snackBar: MatSnackBar, private topicService: TopicService, private userService: UserService) {
  }

  async ngOnInit(): Promise<void> {
    try {
      this.user = (await this.authService.getLoggedUser()).user;
      this.allTopics = (await this.topicService.getALlTopics()).topics;
      if (this.allTopics) {
        this.userUnfavTopics = this.allTopics.filter(topic =>
          !this.user?.userDetails?.favouriteTopics?.some(favTopic => favTopic.id === topic.id)
        );
      }
      const savedTab = localStorage.getItem('selectedTab');
      if (savedTab) {
        this.selectedTab = savedTab;
      } else {
        localStorage.setItem('selectedTab', this.selectedTab);
      }
      // TODO: Se l'utente è SPEAKER, carica gli eventi associati utilizzando la inbox
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
      // TODO: Se l'utente è SPEAKER, carica gli eventi associati utilizzando la inbox
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
    this.dataSource.filter = (value ?? '').trim().toLowerCase();
  }


  deleteTopic(name: string) {
    this.dataSource.data = this.dataSource.data.filter(topic => topic.name !== name);
  }

  setTab(tab: string): void {
    this.selectedTab = tab;
    localStorage.setItem('selectedTab', tab);
  }

  openConfirmTicketModal(event?: Event): void {
    if (!this.isConfirmTicketModalOpen) {
      this.selectedEvent = event;
      this.isConfirmTicketModalOpen = true;
    }
  }

  openRevokeEventModal(event?: Event) {
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
          duration: 20000,
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
          duration: 20000,
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
    }
  }

  async removeFavouriteTopic(topic: Topic) {
    try {
      if (topic.id != null) {
        let response = await this.userService.removeFavouriteTopic(topic.id);
        if (response.user) {
          this.snackBar.open('Argomento rimosso dai preferiti con successo!', 'Chiudi', {
            duration: 20000,
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
          duration: 20000,
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
            duration: 20000,
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
          duration: 20000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'error-snackbar'
        });
      }
    }
  }

  becomeSpeaker() {
    alert('🎤 Richiesta inviata con successo! Attendere la conferma da parte dell\'amministratore');
  }

  protected readonly async = async;
}
