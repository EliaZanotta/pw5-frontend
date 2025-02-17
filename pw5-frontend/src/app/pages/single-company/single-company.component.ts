import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router, ParamMap, RouterLink} from '@angular/router';
import {Host, HostService} from '../../host.service';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {AuthService} from '../../auth/auth.service';
import {Subscription} from 'rxjs';
import {MatButton} from '@angular/material/button';
import {ConfirmEventModalComponent} from './confirm-event-modal/confirm-event-modal.component';
import {EventDeleteModalComponent} from './event-delete-modal/event-delete-modal.component';
import {Event} from '../events/events.service';
import {EventEditModalComponent} from './event-edit-modal/event-edit-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-single-company',
  templateUrl: './single-company.component.html',
  imports: [
    NgIf,
    NgForOf,
    DatePipe,
    RouterLink,
    MatButton,
  ],
  standalone: true,
  styleUrls: ['./single-company.component.css']
})
export class SingleCompanyComponent implements OnInit, OnDestroy {
  host: Host | null = null;
  selectedTab: string = 'events';
  isCompany: boolean = false;
  paramSubscription: Subscription | null = null;

  isUpdateEventModalOpen: boolean = false;
  selectedEvent: Event | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hostService: HostService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    // Subscribe to route parameter changes.
    // This will let the component update if the user navigates to a different company profile.
    this.paramSubscription = this.route.paramMap.subscribe((params: ParamMap) => {
      const companyId = params.get('id');
      if (companyId) {
        // Reset data on parameter change.
        this.host = null;
        this.isCompany = false;
        // Load company data for the new company id.
        this.loadCompanyData(companyId);
      }
    });
  }

  /**
   * Load the company data while checking if the logged-in host (if any)
   * is the owner of the profile. If so, we set isCompany to true.
   */
  async loadCompanyData(companyId: string): Promise<void> {
    try {
      // Try to get the logged host (if any).
      // If not logged in as a host, we simply ignore the error.
      let loggedHostResponse = null;
      try {
        loggedHostResponse = await this.authService.getLoggedHost();
      } catch (e) {
        // It might fail if no host is logged in, but that's fine.
      }

      // If we got a logged host and its id matches the current company id,
      // mark this as the owner’s view.
      if (loggedHostResponse && loggedHostResponse.host && loggedHostResponse.host.id === companyId) {
        this.isCompany = true;
        // Optionally, you can use the host from the auth service.
        this.host = loggedHostResponse.host;
      } else {
        // Otherwise, fetch the company details independently.
        await this.fetchCompany(companyId);
      }
    } catch (error) {
      console.error('Error in loadCompanyData:', error);
      // You can decide whether to show an error message or take some other action here.
    }
  }

  /**
   * Fetches the company (host) details by id.
   */
  async fetchCompany(companyId: string): Promise<void> {
    try {
      this.host = await this.hostService.getHostById(companyId);
      console.log('Fetched Host:', this.host);
    } catch (error) {
      console.error('Error fetching Host:', error);
    }
  }

  setTab(tab: string): void {
    this.selectedTab = tab;
  }

  goBack(): void {
    this.router.navigate(['/partner-companies']);
  }

  goEvents(): void {
    this.router.navigate(['/events']);
  }

  async logout() {
    try {
      const response = await this.authService.logout();
      if (response) {
        // Redirect to home after logout.
        await this.router.navigate(['/']);
        window.location.reload();
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  // Called when the update button is clicked on an event card.
  openUpdateEventModal(event: Event) {
    const dialogRef = this.dialog.open(EventEditModalComponent, {
      width: '80%',
      height: '80%',
      data: {
        event: event
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Refresh the page
        window.location.reload();

        // Show the snackbar after a short delay to ensure the page reloads first
        setTimeout(() => {
          this.snackBar.open('Eventi aggiornati con successo!', 'Chiudi', {
            duration: 3000,
            verticalPosition: 'top'
          });
        }, 100);
      }
    });
  }

  closeModal(): void {
    this.isUpdateEventModalOpen = false;
    this.selectedEvent = null;
  }

  ngOnDestroy(): void {
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe();
    }
  }

  openConfirmEventModal(id: string): void {
    const dialogRef = this.dialog.open(ConfirmEventModalComponent, {
      width: '250px',
      data: { eventId: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the confirmation logic here
        console.log('Event confirmed:', id);
      }
    });
  }

  openDeleteEventModal(id: string): void {
    const dialogRef = this.dialog.open(EventDeleteModalComponent, {
      width: '250px',
      data: { eventId: id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the confirmation logic here
        console.log('Event confirmed:', id);
      }
    });
  }

}
