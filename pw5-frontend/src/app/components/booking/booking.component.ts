import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {EventsService} from '../../pages/events/events.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-booking',
  imports: [],
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css'
})
export class BookingComponent {

  constructor(public dialogRef: MatDialogRef<BookingComponent>, @Inject(MAT_DIALOG_DATA) public data: { id: string, eventName: string }, private snackBar: MatSnackBar, private eventsService: EventsService) {}

  closeDialog() {
    this.dialogRef.close();
  }

  async confirmBooking() {
    const payload = {
      id: this.data.id
    }

    try {
      let response = await this.eventsService.bookEvent(payload);
      let event = response.event;
      if (event) {
        this.snackBar.open('Prenotazione effettuata con successo!', 'Chiudi', {
          duration: 20000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'success-snackbar'
        });
        this.dialogRef.close();
      }
    } catch (errorResponse) {
      if (errorResponse instanceof HttpErrorResponse) {
        this.snackBar.open(errorResponse.error.message, 'Chiudi', {
          duration: 20000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'error-snackbar'
        });
      }
    }
  }
}
