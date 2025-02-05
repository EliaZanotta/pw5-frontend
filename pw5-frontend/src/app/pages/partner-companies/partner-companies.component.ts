import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Host, PartnerCompaniesService } from './partner-companies.service';
import { faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';
import {FiltersModule} from '../../modules/filters.module';

@Component({
  selector: 'app-partner-companies',
  templateUrl: './partner-companies.component.html',
  styleUrls: ['./partner-companies.component.css'],
  imports: [ FiltersModule ],
  standalone: true
})
export class PartnerCompaniesComponent implements OnInit {
  partnerCompanies: Host[] = [];
  filteredCompanies: Host[] = [];
  filteredNames: string[] = [];
  faFilterCircleXmark = faFilterCircleXmark;

  isLoading = true;
  errorMessage: string | null = null;

  filters = {
    name: '',
    type: ''
  };

  constructor(
    private router: Router,
    private partnerCompaniesService: PartnerCompaniesService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      // Fetch partner companies from the service
      const companies = ((await this.partnerCompaniesService.getAllHosts()).hosts);
      this.partnerCompanies = companies;
      this.filteredCompanies = companies;
      this.filteredNames = companies.map(c => c.name);
      this.isLoading = false;
    } catch (error) {
      console.error('Error fetching companies:', error);
      this.errorMessage = 'Errore nel recupero delle aziende. Riprova più tardi.';
      this.isLoading = false;
    }
  }

  applyFilters(): void {
    const { name, type } = this.filters;

    this.filteredCompanies = this.partnerCompanies.filter(company => {
      const matchesName = company.name.toLowerCase().includes(name.toLowerCase());
      const matchesType = type ? company.type === type : true;
      return matchesName && matchesType;
    });

    // Update name suggestions
    this.filteredNames = this.partnerCompanies
      .filter(company => company.name.toLowerCase().includes(name.toLowerCase()))
      .map(company => company.name);
  }

  clearFilters(): void {
    this.filters = { name: '', type: '' };
    this.applyFilters();
  }

  goToCompany(id: string): void {
    this.router.navigate(['/partner-companies', id]);
    console.log('Navigating to partner with id:', id);
  }

  trackById(index: number, item: Host): string {
    return item.id;
  }
}
