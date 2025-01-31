import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {DatePipe, NgForOf} from '@angular/common';


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
  imports: [
    RouterLink,
    NgForOf,
    DatePipe
  ],
  standalone: true
})
export class EventsComponent {
  eventCategories = [
    {
      title: 'Upcoming Events',
      events: [
        {id: 1, title: 'Tech Conference 2023', date: '2023-09-15', image: 'img/code_cheers.png'},
        {id: 2, title: 'AI Summit', date: '2023-10-01', image: 'img/code_cheers.png'},
        {id: 3, title: 'Web Dev Bootcamp', date: '2023-10-15', image: 'img/code_cheers.png'},
        {id: 4, title: 'Startup Pitch Night', date: '2023-11-01', image: 'img/code_cheers.png'},
      ]
    },
    {
      title: 'Past Events',
      events: [
        {id: 5, title: 'Data Science Workshop', date: '2023-05-20', image: 'img/code_cheers.png'},
        {id: 6, title: 'UX Design Seminar', date: '2023-06-10', image: 'img/code_cheers.png'},
        {id: 7, title: 'Blockchain Symposium', date: '2023-07-05', image: 'img/code_cheers.png'},
        {id: 8, title: 'Mobile App Hackathon', date: '2023-08-01', image: 'img/code_cheers.png'},
      ]
    }
  ];
}
