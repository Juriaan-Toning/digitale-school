import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeerlingService } from './leerling.service';
import { Leerling } from './leerling.model';

// Material Imports
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    CommonModule, 
    FormsModule,
    MatTableModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  title = 'Digitale School';
  leerlingen: Leerling[] = [];
  displayedColumns: string[] = [
    'naam', 
    'coachNaam', 
    'startGesprek', 
    'evaluatieGesprek1', 
    'evaluatieGesprek2', 
    'evaluatieGesprek3', 
    'evaluatieGesprek4', 
    'eindGesprek'
  ];
  editingField: { id: number, field: string } | null = null;

  private leerlingService = inject(LeerlingService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.loadLeerlingen();
  }

  loadLeerlingen() {
    this.leerlingService.getLeerlingen().subscribe({
      next: (data) => {
        this.leerlingen = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching leerlingen', err);
      }
    });
  }

  editField(id: number, field: string) {
    this.editingField = { id, field };
  }

  isEditing(id: number, field: string): boolean {
    return this.editingField?.id === id && this.editingField?.field === field;
  }

  onDateChange(leerling: Leerling, field: keyof Leerling, event: any) {
    const value = event.value; // MatDatepicker event has .value
    if (!value) return;

    const date = new Date(value);
    const day = date.getDay();
    if (day === 0 || day === 6) {
      alert('Weekenden zijn niet toegestaan. Kies een doordeweekse dag.');
      this.loadLeerlingen(); // Reset de waarde
      this.editingField = null;
      return;
    }

    // Formatteer naar yyyy-mm-dd voor backend (ISO string split)
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
    const formattedDate = adjustedDate.toISOString().split('T')[0];

    // Update lokaal
    (leerling as any)[field] = formattedDate;
    
    // Sla op in backend
    this.leerlingService.updateLeerling(leerling).subscribe({
      next: () => {
        this.editingField = null;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error updating leerling', err);
        alert('Er is een fout opgetreden bij het opslaan.');
        this.loadLeerlingen();
        this.editingField = null;
      }
    });
  }

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Voorkom zaterdag en zondag.
    return day !== 0 && day !== 6;
  };
}
