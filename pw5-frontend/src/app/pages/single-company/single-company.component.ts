import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Host, HostService } from '../../host.service';
import { DatePipe, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-single-company',
  templateUrl: './single-company.component.html',
  imports: [
    NgIf,
    NgForOf,
    DatePipe
  ],
  styleUrls: ['./single-company.component.css']
})
export class SingleCompanyComponent implements OnInit {
  companyId: string | undefined;
  host: Host | any = {}; // Will be populated from the backend.
  // Change the default tab to "events" so that events are displayed immediately.
  selectedTab: string = 'events';
  userRole: string = '';
  userCompanyId: number | null = null; // Logged-in user's Host ID

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hostService: HostService
  ) {}

  ngOnInit(): void {
    // Get the Host ID from the route parameters.
    this.companyId = this.route.snapshot.paramMap.get('id') || undefined;

    // Simulate login for demonstration purposes.
    localStorage.setItem('userRole', 'Host');
    localStorage.setItem('userCompanyId', '1');

    // Retrieve the user data from localStorage.
    this.userRole = localStorage.getItem('userRole') || '';
    this.userCompanyId = localStorage.getItem('userCompanyId')
      ? Number(localStorage.getItem('userCompanyId'))
      : null;

    // Fetch the Host data asynchronously.
    this.fetchCompany();
  }

  async fetchCompany(): Promise<void> {
    if (this.companyId) {
      try {
        this.host = await this.hostService.getHostById(this.companyId);
        console.log('Fetched Host:', this.host);
      } catch (error) {
        console.error('Error fetching Host:', error);
      }
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

  isCompany(): boolean {
    // Compare by converting host.id to a number if needed
    return this.userRole === 'Host' && Number(this.userCompanyId) === Number(this.host.id);
  }

  async logout() {
    let response = await this.hostService.logout();
    if (response) {
      await this.router.navigate(['/']);
      window.location.reload();
    }
  }

  // This method is called when the update button is clicked on an event card.
  // For now, it just logs the event id.
  updateEvent(eventId: string): void {
    console.log('Update event:', eventId);
  }
}
