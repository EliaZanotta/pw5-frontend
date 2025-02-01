import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-speaker',
  imports: [MatCardModule],
  templateUrl: './speaker.component.html',
  styleUrl: './speaker.component.css'
})
export class SpeakerComponent implements OnInit {

  speakerId!: number;
  speaker: any | null = null;

  // Lista statica dei relatori (può essere sostituita da un servizio)
  speakers = [
    { id: 101, name: 'Jane Doe', bio: 'Esperto di Frontend con anni di esperienza. Guru del Backend e dei database. Specialista in DevOps e CI/CD. Pioniere nell’Intelligenza Artificiale. ', image: 'img/speaker.jpg' },
    { id: 102, name: 'John Smith', bio: 'Guru del Backend e dei database.', image: 'assets/images/john.jpg' },
    { id: 103, name: 'Alice Brown', bio: 'Specialista in DevOps e CI/CD.', image: 'assets/images/alice.jpg' },
    { id: 104, name: 'Bob Johnson', bio: 'Pioniere nell’Intelligenza Artificiale.', image: 'assets/images/bob.jpg' },
  ];

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    // Recupera l'id del relatore dall'URL
    this.speakerId = Number(this.route.snapshot.paramMap.get('id'));
    this.speaker = this.speakers.find((sp) => sp.id === this.speakerId);
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }

}
