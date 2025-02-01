import { Component, OnInit } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {Host, PartnerCompaniesService} from './partner-companies.service';
import {DatePipe, NgClass, NgForOf, NgIf, SlicePipe} from '@angular/common';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-partner-companies',
  templateUrl: './partner-companies.component.html',
  styleUrls: ['./partner-companies.component.css'],
  imports: [
    NgForOf,
    NgClass
  ],
  standalone: true
})
export class PartnerCompaniesComponent implements OnInit {
  partnerCompanies: Host[] = [];

  constructor(
    private router: Router,
    private partnerCompaniesService: PartnerCompaniesService
  ) {}

  ngOnInit(): void {
    // Fetch partner companies from the service
    this.partnerCompaniesService.getAllHosts().subscribe(
      (companies: Host[]) => {
        this.partnerCompanies = companies;
      },
      (error: any) => {
        console.error('Error fetching companies:', error);
      }
    );
  }

  goToCompany(id: string): void {
    this.router.navigate(['/partner-companies', id]);
    console.log('Navigating to partner with id:', id);
  }
  trackById(index: number, item: Host): string {
    return item.id;
  }
}
