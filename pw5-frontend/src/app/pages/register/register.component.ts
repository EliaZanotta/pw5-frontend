import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  imports: [CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  
  showUserForm = true;


  toggleForm() {
    this.showUserForm = !this.showUserForm;
  }
}
