import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-booking',
  imports: [],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent {

  constructor(public dialogRef: MatDialogRef<BookingComponent>, @Inject(MAT_DIALOG_DATA) public data: { eventName: string }, private snackBar: MatSnackBar) { }

  closeDialog() {
    this.dialogRef.close();
  }

  confirmBooking() {
    this.snackBar.open('Iscrizione completata', 'Chiudi', {
      duration: 20000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: 'success-snackbar'
    });
    this.dialogRef.close();
  }
}
