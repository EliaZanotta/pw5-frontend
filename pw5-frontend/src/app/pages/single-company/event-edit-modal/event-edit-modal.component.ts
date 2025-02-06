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
    private dialogRef: MatDialogRef<EventEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { event: Event }
  ) {}

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      startDate: [{ value: this.data.event.startDate, disabled: true }, Validators.required],
      endDate: [{ value: this.data.event.endDate, disabled: true }, Validators.required],
      place: [this.data.event.place, Validators.required],
      pendingSpeakerRequests: this.fb.array(
        this.data.event.pendingSpeakerRequests.map((request) =>
          this.fb.group({
            email: [request.email, Validators.email]
          })
        )
      ),
      title: [this.data.event.title, Validators.required],
      maxParticipants: [
        this.data.event.maxParticipants,
        [Validators.required, Validators.min(1)]
      ],
      eventSubscription: [this.data.event.eventSubscription, Validators.required],
      description: [this.data.event.description]
    });

    this.topics = this.data.event.topics.map((topic: string) => {
      return { value: topic, deletable: false };
    });
  }

  // Shortcut to access the FormArray for speaker emails
  get pendingSpeakerRequests(): FormArray {
    return this.eventForm.get('pendingSpeakerRequests') as FormArray;
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  async onConfirm(): Promise<void> {
    console.log('Form value:', this.eventForm.value);
    if (this.eventForm.invalid) {
      return;
    }

    // Using eventForm.value excludes disabled controls (startDate and endDate).
    const formValue = this.eventForm.value;

    // Extract the speaker emails from the form array.
    const speakerEmails = formValue.pendingSpeakerRequests.map((req: any) => req.email);

    // Build payload without startDate and endDate.
    const payload = {
      ...formValue,
      pendingSpeakerRequests: speakerEmails,
      topics: this.topics.map((topic) => topic.value)
    };
    console.log('Payload to PUT:', JSON.stringify(payload, null, 2));


    try {
      const response = await this.eventService.updateEvent(
        this.data.event.id,
        payload
      );
      if (response.event) {
        this.dialogRef.close(true);
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  }

  // ----- Functions for managing speaker email bubbles -----
  addSpeakerEmail(): void {
    const email = this.newSpeakerEmail.trim();
    if (
      email &&
      !this.pendingSpeakerRequests.controls.some(
        (ctrl) => ctrl.get('email')?.value === email
      )
    ) {
      // Add new email with a 'deletable' flag set to true.
      this.pendingSpeakerRequests.push(
        this.fb.group({
          email: [email, Validators.email],
          deletable: true
        })
      );
      this.newSpeakerEmail = '';
    }
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

  // ----- Functions for managing topic bubbles -----
  addTopic(): void {
    const topic = this.newTopic.trim();
    if (topic && !this.topics.find((t) => t.value === topic)) {
      // New topics are marked as deletable.
      this.topics.push({ value: topic, deletable: true });
      this.newTopic = '';
    }
  }

  removeTopic(index: number): void {
    if (this.topics[index].deletable) {
      this.topics.splice(index, 1);
    }
  }

  // ----- Helpers for maxParticipants field -----
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
