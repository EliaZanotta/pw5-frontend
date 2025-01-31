import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
// import { AuthService } from '../../auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  
  showUserForm = true;


  toggleForm() {
    this.showUserForm = !this.showUserForm;
  }

  // constructor(private authService: AuthService) { }

  // onSubmit(form: any) {
  //   this.authService.register(form.value).subscribe({
  //     next: (response) => {
  //       console.log('Registration successful', response);
  //     },
  //     error: (error) => {
  //       console.error('Registration failed', error);
  //     }
  //   });
  // }
}
