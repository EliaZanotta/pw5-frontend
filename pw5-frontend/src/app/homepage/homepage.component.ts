import { Component, AfterViewInit } from '@angular/core';
import Swiper from 'swiper';
import { Navigation, Autoplay } from 'swiper/modules'; // Importa i moduli dai percorsi corretti

Swiper.use([Navigation, Autoplay]);

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements AfterViewInit {
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
