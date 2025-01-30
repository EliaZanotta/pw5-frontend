import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-change-password-host',
  imports: [FormsModule],
  templateUrl: './change-password-host.component.html',
  styleUrl: './change-password-host.component.css'
})
export class ChangePasswordHostComponent {
onSubmit() {
throw new Error('Method not implemented.');
}
oldPassword: any;
newPassword: any;
confirmPassword: any;

}
