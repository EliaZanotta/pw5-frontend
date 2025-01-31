import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  onSubmit(event: Event): void {
    event.preventDefault();
    alert('Richiesta inviata con successo!');
    (event.target as HTMLFormElement).reset();
  }
}
