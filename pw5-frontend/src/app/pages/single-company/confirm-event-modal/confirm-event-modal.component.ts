import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import {HostService} from '../../../host.service';

@Component({
  selector: 'app-confirm-event-modal',
  templateUrl: './confirm-event-modal.component.html',
  styleUrls: ['./confirm-event-modal.component.css'],
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle
  ]
})
export class ConfirmEventModalComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmEventModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private hostSevice: HostService
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  async onConfirm(): Promise<void> {
    try {
      // Call the confirmEvent method using the eventId from the modal's data.
      const response = await this.hostSevice.confirmEvent(this.data.eventId);
      // Close the dialog passing the response (could be true or an object).
      this.dialogRef.close(response);
    } catch (error) {
      console.error('Error confirming event:', error);
      // Optionally, you could pass an error flag or message to the calling component.
      this.dialogRef.close(false);
    }
  }
}
