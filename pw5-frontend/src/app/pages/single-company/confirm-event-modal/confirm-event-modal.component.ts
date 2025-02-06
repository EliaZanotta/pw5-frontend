import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';

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
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
