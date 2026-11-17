import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeerlingService } from './leerling.service';
import { Leerling } from './leerling.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  title = 'Digitale School';
  leerlingen: Leerling[] = [];
  private leerlingService = inject(LeerlingService);

  ngOnInit() {
    this.leerlingService.getLeerlingen().subscribe({
      next: (data) => {
        this.leerlingen = data;
      },
      error: (err) => {
        console.error('Error fetching leerlingen', err);
      }
    });
  }
}
