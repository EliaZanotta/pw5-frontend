import {Component, OnInit, ViewChild} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AdminTableModule } from '../../../../modules/admin-table.module';
import { User, UserService } from '../../../../user.service';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  standalone: true,
  imports: [
    AdminTableModule,
    MatIcon,
    MatIconButton
  ]
})
export class UserManagementComponent implements OnInit {
  displayedColumns: string[] = ['firstName', 'lastName', 'email', 'role', 'status', 'actions'];
  dataSource = new MatTableDataSource<User>();
  allUsers: User[] = [];
  isDeleteModalOpen = false;
  userIdToDelete: string | null = null;

  // Filters and autocomplete options
  filters = {
    name: '',
    role: '',
    status: ''
  };
  filteredNames!: Observable<string[]>;
  nameSearchControl = new FormControl('');

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  constructor(private userService: UserService) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.fetchUsers();
      this.dataSource.paginator = this.paginator;
      this.dataSource.data = this.allUsers;

      // Initialize filtered options for autocomplete
      this.filteredNames = this.nameSearchControl.valueChanges.pipe(
        startWith(''),
        map(value => this.filterOptions(value ?? '', Array.from(new Set(this.allUsers.map(user => user.firstName + ' ' + user.lastName)))))
      );
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }


  async fetchUsers(): Promise<void> {
    try {
      const response = await this.userService.getAllUsers();
      console.log('Fetched response:', response);
      this.allUsers = response.users;  // Extract the 'users' array from the response
      this.dataSource.data = this.allUsers;
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  }

  applyFilters(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.data = this.allUsers.filter(user => {
      const matchesName = (user.firstName + ' ' + user.lastName).toLowerCase().includes(this.filters.name.toLowerCase());
      const matchesRole = this.filters.role ? user.role === this.filters.role : true;
      const matchesStatus = this.filters.status ? user.status === this.filters.status : true;
      return matchesName && matchesRole && matchesStatus;

    });
  }

  private filterOptions(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter(option => option.toLowerCase().includes(filterValue));
  }

  openDeleteModal(userId: string): void {
    this.userIdToDelete = userId;
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.userIdToDelete = null;
  }

  async confirmDelete(): Promise<void> {
    if (this.userIdToDelete) {
      try {
        await this.userService.deleteUser(this.userIdToDelete);
        await this.fetchUsers();
        this.closeDeleteModal();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  }
}
