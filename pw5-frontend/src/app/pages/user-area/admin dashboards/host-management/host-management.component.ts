import {Component, OnInit, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AdminTableModule } from '../../../../modules/admin-table.module';
import { PartnerCompaniesService } from '../../../partner-companies/partner-companies.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {Host, HostService} from '../../../../host.service';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-host-management',
  templateUrl: './host-management.component.html',
  styleUrls: ['./host-management.component.css'],
  standalone: true,
  imports: [
    AdminTableModule,
    MatIconModule,
    MatButtonModule,
  ]
})
export class HostManagementComponent implements OnInit {
  // Added the new "azioni" column to the displayedColumns array.
  displayedColumns: string[] = ['name', 'type', 'email', 'status', 'azioni'];
  dataSource = new MatTableDataSource<Host>();

  // Filters and autocomplete options
  filters = {
    name: '',
    type: ''
  };
  filteredNames!: Observable<string[]>;
  nameSearchControl = new FormControl('');

  // For delete modal
  isDeleteModalOpen = false;
  hostToDelete: number | null = null;

  allHosts: Host[] = [];

  constructor(
    private partnerCompaniesService: PartnerCompaniesService,
    private hostService: HostService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.fetchHosts();

    // Initialize filtered options for autocomplete
    this.dataSource.paginator = this.paginator;
    this.filteredNames = this.nameSearchControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterOptions(value ?? '', this.allHosts.map(host => host.name || '')))
    );
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  applyFilters(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.data = this.allHosts.filter(host => {
      const matchesName = host.name?.toLowerCase().includes(this.filters.name.toLowerCase()) ?? false;
      const matchesType = this.filters.type ? host.type === this.filters.type : true;
      return matchesName && matchesType;
    });
  }

  private filterOptions(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter(option => option.toLowerCase().includes(filterValue));
  }

  openDeleteModal(hostId: number): void {
    this.hostToDelete = hostId;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.hostToDelete = null;
  }

  async confirmDelete(): Promise<void> {
    if (this.hostToDelete !== null) {
      try {
        // Convert the host ID to string if needed by the hostService.
        await this.hostService.deleteHost(String(this.hostToDelete));
        console.log('Host deleted successfully');
        await this.fetchHosts();
      } catch (error) {
        console.error('Error deleting host:', error);
      } finally {
        this.closeDeleteModal();
      }
    }
  }
}
