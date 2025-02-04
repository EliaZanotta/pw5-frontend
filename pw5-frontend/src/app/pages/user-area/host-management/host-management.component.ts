import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import {FormControl} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AdminTableModule } from '../../../modules/admin-table.module';
import {Host, PartnerCompaniesService } from '../../partner-companies/partner-companies.service';

@Component({
  selector: 'app-host-management',
  templateUrl: './host-management.component.html',
  styleUrls: ['./host-management.component.css'],
  standalone: true,
  imports: [
    AdminTableModule,
  ]
})
export class HostManagementComponent implements OnInit {
  displayedColumns: string[] = ['name', 'type', 'email', 'status'];
  dataSource = new MatTableDataSource<Host>();

  // Filters and autocomplete options
  filters = {
    name: '',
    type: ''
  };
  filteredNames!: Observable<string[]>;
  nameSearchControl = new FormControl('');

  allHosts: Host[] = [];

  constructor(private partnerCompaniesService: PartnerCompaniesService) {}

  async ngOnInit(): Promise<void> {
    await this.fetchHosts();

    // Initialize filtered options for autocomplete
    this.filteredNames = this.nameSearchControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterOptions(value ?? '', this.allHosts.map(host => host.name || ''))));
  }

  async fetchHosts(): Promise<void> {
    try {
      const response = await this.partnerCompaniesService.getAllHosts();
      console.log('Fetched response:', response);
      const hosts = response.hosts;
      console.log('Fetched hosts:', hosts);
      this.allHosts = hosts;
      this.dataSource.data = hosts;
    } catch (error) {
      console.error('Failed to load hosts:', error);
    }
  }

  applyFilters(): void {
    this.dataSource.data = this.allHosts.filter(host => {
      const matchesName = host.name.toLowerCase().includes(this.filters.name.toLowerCase());
      const matchesType = this.filters.type ? host.type === this.filters.type : true;
      return matchesName && matchesType;
    });
  }

  private filterOptions(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter(option => option.toLowerCase().includes(filterValue));
  }
}
