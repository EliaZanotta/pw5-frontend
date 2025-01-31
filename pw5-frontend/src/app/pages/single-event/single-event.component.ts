import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-single-event',
  imports: [MatCardModule, RouterLink],
  templateUrl: './single-event.component.html',
  styleUrl: './single-event.component.css'
})
export class SingleEventComponent implements OnInit {
  event: any | null = null; // Evento attuale

  // Lista statica di eventi (da sostituire con un servizio eventualmente)
  events = [
    {
      id: 1,
      title: 'Frontend Workshop',
      date: '10-02-2025',
      time: '10:00 AM',
      location: 'TechHub Conference Room 1',
      image: 'img/pynight_techtalks_2.png',
      speaker: 'Jane Doe',
      speakerId: 101,
      participants: 25,
      status: 'open',
    },
    { id: 2, title: 'Backend Conference', date: '15-03-2025', image: 'img/eventibg.webp' },
    { id: 3, title: 'DevOps Meetup', date: '20-04-2025', image: 'img/eventibg.webp' },
    { id: 4, title: 'AI Seminar', date: '05-05-2025', image: 'img/eventibg.webp' },
    { id: 5, title: 'Code & Cheers - Xmas version', date: '19-12-2024', image: 'img/code_cheers_xmas.png', location: 'Gallarate' },
    { id: 6, title: 'Code & Cheers', date: '03-10-2024', image: 'img/code_cheers.png', location: 'Gallarate' },
    { id: 7, title: 'PyNight & TechTalks', date: '13-06-2024', image: 'img/pynight_techtalks_2.png', location: 'Elmec', speaker: 'Fabio Lipreri ' + ',' + 'Fabio Scantamburlo', speakerId: 102 + ',' + 103, },
    { id: 8, title: 'On Tech X', date: '04-06-2024', image: 'img/ontechx.png', location: 'Reti' },
  ];

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // Recupera l'ID dall'URL
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.event = this.events.find((ev) => ev.id === id);
  }

  goBooking(): void {
    this.router.navigate(['/booking',]);
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }

}
