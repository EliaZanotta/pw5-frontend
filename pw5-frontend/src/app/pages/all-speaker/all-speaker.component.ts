import { Component, OnInit } from '@angular/core';
import { Speaker, SpeakerService } from './all-speaker.service';
import { NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-all-speaker',
  templateUrl: './all-speaker.component.html',
  styleUrls: ['./all-speaker.component.css'],
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    RouterLink
  ]
})
export class AllSpeakerComponent implements OnInit {
  speakers: Speaker[] = [];

  constructor(private speakerService: SpeakerService) { }

  ngOnInit(): void {
    this.loadSpeakers();
  }

  async loadSpeakers() {
    this.speakers = await this.speakerService.getSpeakers();
    console.log("Speakers caricati:", this.speakers);
  }
}
