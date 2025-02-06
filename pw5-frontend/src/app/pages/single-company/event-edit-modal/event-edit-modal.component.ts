import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventsService, Event } from '../../events/events.service';
import { NgForOf, NgIf } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

interface ApiError {
  error?: {
    message?: string;
  };
  message?: string;  // Top-level message for cases where the error is not nested
}



interface Tag {
  value: string;
  deletable: boolean;
}

@Component({
  selector: 'app-event-edit-modal',
  templateUrl: './event-edit-modal.component.html',
  styleUrls: ['./event-edit-modal.component.css'],
  imports: [ReactiveFormsModule, FormsModule, NgForOf, NgIf],
  standalone: true
})
export class EventEditModalComponent implements OnInit {
  eventForm!: FormGroup;
  newSpeakerEmail: string = '';
  newTopic: string = '';
  topics: Tag[] = [];

  constructor(
    private fb: FormBuilder,
    private eventService: EventsService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<EventEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { event: Event }
  ) {}

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      startDate: [{ value: this.data.event.startDate, disabled: true }, Validators.required],
      endDate: [{ value: this.data.event.endDate, disabled: true }, Validators.required],
      place: [this.data.event.place, Validators.required],
      pendingSpeakerRequests: this.fb.array([]),  // Start with an empty array
      title: [this.data.event.title, Validators.required],
      maxParticipants: [
        this.data.event.maxParticipants,
        [Validators.required, Validators.min(0)]
      ],
      eventSubscription: [this.data.event.eventSubscription || 'FREE', Validators.required],
      description: [this.data.event.description]
    });

    // Initialize topics without removing pending speaker requests from the data
    this.topics = this.data.event.topics.map((topic: string) => {
      return { value: topic, deletable: false };
    });
  }


  get pendingSpeakerRequests(): FormArray {
    return this.eventForm.get('pendingSpeakerRequests') as FormArray;
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  async onConfirm(): Promise<void> {
    console.log('Form valid:', this.eventForm.valid);
    console.log('Form errors:', this.eventForm.errors);
    console.log('Form value:', this.eventForm.value);

    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      this.snackBar.open('Si prega di correggere gli errori del modulo.', 'Chiudi', {
        duration: 3000,
        verticalPosition: 'top'
      });

      return;
    }

    const formValue = this.eventForm.getRawValue(); // Get disabled fields too
    const payload = {
      ...formValue,
      topics: this.topics.map((topic) => topic.value)
    };

    try {
      const response = await this.eventService.updateEvent(this.data.event.id, payload);
      this.dialogRef.close(true);
      this.snackBar.open('Evento aggiornato con successo!', 'Chiudi', {
        duration: 3000,
        verticalPosition: 'top'
      });
    } catch (err) {
      console.error('Error updating event:', err);

      const error = err as ApiError;
      let errorMessage = 'Impossibile aggiornare l\'evento. Riprova.';

      if (error.error?.message) {
        errorMessage = error.error.message;  // Access the API error message
      } else if (error.message) {
        errorMessage = error.message;  // Use the general error message if available
      }

      this.snackBar.open(errorMessage, 'Close', {
        duration: 3000,
        verticalPosition: 'top'
      });
    }

  }


  addSpeakerEmail(): void {
    const email = this.newSpeakerEmail.trim();

    if (!email) {
      this.snackBar.open('L\'email non può essere vuota.', 'Chiudi', {
        duration: 3000,
        verticalPosition: 'top'
      });
      return;
    }

    const emailExists = this.pendingSpeakerRequests.controls.some(
      (ctrl) => ctrl.get('email')?.value === email
    );

    if (emailExists) {
      this.snackBar.open(`La richiesta per il relatore con email: ${email} esiste già.`, 'Chiudi', {
        duration: 3000,
        verticalPosition: 'top'
      });
      return;
    }

    this.pendingSpeakerRequests.push(
      this.fb.group({
        email: [email, Validators.email],
        deletable: true
      })
    );

    this.newSpeakerEmail = '';
  }

  removeSpeakerEmail(index: number): void {
    const ctrl = this.pendingSpeakerRequests.at(index);
    if (ctrl.get('deletable') && ctrl.get('deletable')?.value) {
      this.pendingSpeakerRequests.removeAt(index);
    }
  }

  isDeletableEmail(index: number): boolean {
    const ctrl = this.pendingSpeakerRequests.at(index);
    return ctrl.get('deletable') ? ctrl.get('deletable')?.value : false;
  }

  addTopic(): void {
    const topic = this.newTopic.trim();
    if (topic && !this.topics.find((t) => t.value === topic)) {
      this.topics.push({ value: topic, deletable: true });
      this.newTopic = '';
    }
  }

  removeTopic(index: number): void {
    if (this.topics[index].deletable) {
      this.topics.splice(index, 1);
    }
  }

  handleFocus(event: FocusEvent): void {
    const target = event.target as HTMLInputElement;
    if (target.value === '0') {
      target.value = '';
    }
  }

  handleBlur(event: FocusEvent): void {
    const target = event.target as HTMLInputElement;
    if (target.value === '') {
      target.value = '0';
    }
  }
}
