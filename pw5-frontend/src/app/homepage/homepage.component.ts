import {Component, AfterViewInit, OnInit, LOCALE_ID} from '@angular/core';
import {EventsService} from '../pages/events/events.service';
import Swiper from 'swiper';
import {Navigation, Autoplay} from 'swiper/modules';
import { Event } from '../pages/events/events.component';
import {DatePipe, NgForOf, registerLocaleData} from '@angular/common';
import localeIt from '@angular/common/locales/it';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {RouterLink} from '@angular/router';

registerLocaleData(localeIt);

Swiper.use([Navigation, Autoplay]);

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css'],
  imports: [
    NgForOf,
    DatePipe,
    FontAwesomeModule,
    RouterLink
  ],
  standalone: true,
  providers: [{provide: LOCALE_ID, useValue: 'it-IT'}]
})
export class HomepageComponent implements AfterViewInit, OnInit {
  incomingEvents: Event[] = [];

  constructor(private eventsService: EventsService) {
  }

  ngOnInit(): void {
    this.eventsService.getEvents().subscribe((events: Event[]) => {
      this.incomingEvents = events.filter(event => event.status === 'CONFIRMED').slice(0, 3);
    });
  }

  ngAfterViewInit(): void {
    new Swiper('.swiper-container', {
      slidesPerView: 5, // Numero di loghi visibili contemporaneamente
      spaceBetween: 30, // Spaziatura tra i loghi
      loop: true, // Loop infinito
      speed: 4000, // Velocità di transizione in millisecondi
      autoplay: {
        delay: 0, // Nessuna pausa tra le transizioni
        disableOnInteraction: false // L'autoplay non si ferma se l'utente interagisce
      },
      allowTouchMove: false, // Disabilita lo scorrimento manuale con mouse o touch
      breakpoints: {
        768: {
          slidesPerView: 3 // Riduce i loghi visibili su tablet
        },
        480: {
          slidesPerView: 2 // Riduce ulteriormente i loghi visibili su smartphone
        }
      }
    });
  }
}
