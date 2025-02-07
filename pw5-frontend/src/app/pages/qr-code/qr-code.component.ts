import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TicketService } from '../../ticket.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.component.html',
  standalone: true,
  imports: [
    NgIf
  ],
  styleUrls: ['./qr-code.component.css']
})
export class QrCodeComponent implements OnInit {
  ticketConfirmed: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const ticketCode = params['ticketCode'];

      if (ticketCode) {
        this.ticketService.confirmTicket(ticketCode).subscribe({
          next: (response) => {
            if (response && response.message === 'Ticket confirmed successfully.') {
              this.ticketConfirmed = true;
            } else {
              this.errorMessage = 'Unexpected response from the server. Please try again!';
            }
          },
          error: (err) => {
            console.error('Error confirming ticket:', err);
            if (err.error && err.error.error === 'Ticket is already confirmed.') {
              this.errorMessage = '🎫 This ticket is already confirmed.';
            } else if (err.status === 400) {
              this.errorMessage = 'Invalid request. Please check your ticket code.';
            } else {
              this.errorMessage = 'Failed to confirm the ticket. Please try again!';
            }
          }
        });
      } else {
        this.errorMessage = '⚠️ No ticket code found in the URL.';
      }
    });
  }
}
