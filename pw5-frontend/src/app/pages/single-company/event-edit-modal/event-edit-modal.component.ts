import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {EventsService, Event} from '../../events/events.service';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-event-edit-modal',
  templateUrl: './event-edit-modal.component.html',
  styleUrls: ['./event-edit-modal.component.css'],
  imports: [
    ReactiveFormsModule,
    NgForOf
  ],
  standalone: true
})
export class EventEditModalComponent implements OnInit {
  eventForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private eventService: EventsService,
    private dialogRef: MatDialogRef<EventEditModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { event: Event }
  ) {
  }

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      startDate: [this.data.event.startDate, Validators.required],
      endDate: [this.data.event.endDate, Validators.required],
      place: [this.data.event.place, Validators.required],
      pendingSpeakerRequests: this.fb.array(this.data.event.pendingSpeakerRequests.map(request => this.fb.group({
        email: [request.email, Validators.email]
      }))),
      topics: [this.data.event.topics.join(', '), Validators.required],
      title: [this.data.event.title, Validators.required],
      maxParticipants: [this.data.event.maxParticipants, [Validators.required, Validators.min(1)]],
      eventSubscription: [this.data.event.eventSubscription, Validators.required],
      description: [this.data.event.description]
    });
  }

  get pendingSpeakerRequests(): FormArray {
    return this.eventForm.get('pendingSpeakerRequests') as FormArray;
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  async onConfirm(): Promise<void> {
    if (this.eventForm.invalid) {
      return;
    }

    const formValue = this.eventForm?.value;
    const payload = {
      ...formValue,
      topics: formValue.topics.split(',').map((topic: string) => topic.trim())
    };

    try {
      const response = await this.eventService.updateEvent(this.data.event.id, payload);
      if (response.event) {
        this.dialogRef.close(true);
      }
    } catch (errorResponse) {
      console.error('Error updating event:', errorResponse);
    }
  }
}
