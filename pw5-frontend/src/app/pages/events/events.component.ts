import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

export const MY_DATE_FORMATS = { parse: { dateInput: 'DD/MM/YYYY', }, display: { dateInput: 'DD/MM/YYYY', monthYearLabel: 'MMMM YYYY', dateA11yLabel: 'LL', monthYearA11yLabel: 'MMMM YYYY', }, };

@Component({
  selector: 'app-events',
  imports: [MatCardModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, RouterLink],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS] },
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ],
})
export class EventsComponent {

  futureEvents = [
    {
      id: 1,
      title: 'Frontend Workshop',
      date: '10-02-2025',
      time: '10:00 AM',
      location: 'TechHub Conference Room 1',
      image: 'img/pynight_techtalks_2.png'
    },
    {
      id: 2,
      title: 'Backend Conference',
      date: '15-03-2025',
      time: '09:30 AM',
      location: 'Main Auditorium, City Center',
      image: 'img/eventibg.webp'
    },
    {
      id: 3,
      title: 'DevOps Meetup',
      date: '20-04-2025',
      time: '06:00 PM',
      location: 'DevSpace Meetup Hub',
      image: 'img/eventibg.webp'
    },
    {
      id: 4,
      title: 'AI Seminar',
      date: '05-05-2025',
      time: '02:00 PM',
      location: 'Innovation Park, Building 5',
      image: 'img/eventibg.webp'
    },
  ];

  pastEvents = [
    {
      id: 5,
      title: 'Code & Cheers - Xmas version',
      date: '19-12-2024',
      time: '07:00 PM',
      location: 'Gallarate',
      image: 'img/code_cheers_xmas.png'
    },
    {
      id: 6,
      title: 'Code & Cheers',
      date: '03-10-2024',
      time: '08:00 PM',
      location: 'Gallarate',
      image: 'img/code_cheers.png'
    },
    {
      id: 7,
      title: 'PyNight & TechTalks',
      date: '13-06-2024',
      time: '06:30 PM',
      location: 'Elmec',
      image: 'img/pynight_techtalks_2.png'
    },
    {
      id: 8,
      title: 'On Tech X',
      date: '04-06-2024',
      time: '10:00 AM',
      location: 'Reti',
      image: 'img/ontechx.png'
    },
  ];


  constructor(private router: Router) { }

  ngOnInit(): void { }

  goToEvent(id: number): void {
    // Redirect to the specific event page
    this.router.navigate(['/events', id]);
    console.log('Navigating to event with id:', id);
  }

  // Filtro per data 

  filteredFutureEvents = [...this.futureEvents]; // Copia iniziale degli eventi
  filteredPastEvents = [...this.pastEvents];

  onDateFilterChange(event: any): void {
    const selectedDate = event.value; // Selected date as a Date object
    if (selectedDate) {
      const filterDate = new Date(selectedDate);

      // Filter future events from the selected date onward
      this.filteredFutureEvents = this.futureEvents.filter((ev) => {
        const [day, month, year] = ev.date.split('-').map(Number); // Extract DD-MM-YYYY
        const eventDate = new Date(year, month - 1, day); // Create Date object
        return eventDate >= filterDate; // Include events on or after the selected date
      });

      // Filter past events up to the selected date
      this.filteredPastEvents = this.pastEvents.filter((ev) => {
        const [day, month, year] = ev.date.split('-').map(Number); // Extract DD-MM-YYYY
        const eventDate = new Date(year, month - 1, day); // Create Date object
        return eventDate <= filterDate; // Include events on or before the selected date
      });
    } else {
      // Reset filters if no date is selected
      this.filteredFutureEvents = [...this.futureEvents];
      this.filteredPastEvents = [...this.pastEvents];
    }
  }
}
