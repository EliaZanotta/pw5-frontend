import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Initialize the form with form controls and validators
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  // Method to handle form submission
  onSubmit() {
    if (this.contactForm.valid) {
      // Here you can handle form submission, e.g., send data to a server
      console.log('Form Submitted', this.contactForm.value);
      alert('Form Submitted');
      // Reset the form after submission
      this.contactForm.reset();
    } else {
      // Mark all fields as touched to trigger validation messages
      this.contactForm.markAllAsTouched();
    }
  }
}
