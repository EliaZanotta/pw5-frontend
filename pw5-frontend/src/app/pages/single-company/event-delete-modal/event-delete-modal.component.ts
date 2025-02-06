import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import {EventsService} from '../../events/events.service';

@Component({
  selector: 'app-event-delete-modal',
  templateUrl: './event-delete-modal.component.html',
  styleUrls: ['./event-delete-modal.component.css'],
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle
  ]
})
export class EventDeleteModalComponent {
  constructor(
    public dialogRef: MatDialogRef<EventDeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private eventsService: EventsService
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  async onConfirm(): Promise<void> {
    try {
      // Call the confirmEvent method using the eventId from the modal's data.
      const response = await this.eventsService.deleteEventAsHost(this.data.eventId);
      // Close the dialog passing the response (could be true or an object).
      this.dialogRef.close(response);
    } catch (error) {
      console.error('Error confirming event:', error);
      // Optionally, you could pass an error flag or message to the calling component.
      this.dialogRef.close(false);
    }
  }
}
