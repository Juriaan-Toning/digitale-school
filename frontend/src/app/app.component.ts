import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {LeerlingService} from './leerling.service';
import {Leerling} from './leerling.model';
import {Coach} from './coach.model';

// Material Imports
import {MatTableModule} from '@angular/material/table';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';

import {AddLeerlingDialogComponent} from './components/add-leerling-dialog/add-leerling-dialog.component';
import {AddCoachDialogComponent} from './components/add-coach-dialog/add-coach-dialog.component';

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
    MatButtonModule,
    MatSelectModule,
    MatDialogModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  title = 'Digitale School';
  leerlingen: Leerling[] = [];
  coaches: Coach[] = [];
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
  private dialog = inject(MatDialog);

  ngOnInit() {
    this.loadLeerlingen();
    this.loadCoaches();
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

  loadCoaches() {
    this.leerlingService.getCoaches().subscribe({
      next: (data) => {
        this.coaches = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching coaches', err);
      }
    });
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
    this.saveLeerling(leerling);
  }

  onCoachChange(leerling: Leerling, coachId: number | null) {
    leerling.coachId = coachId;
    this.saveLeerling(leerling);
  }

  private saveLeerling(leerling: Leerling) {
    this.leerlingService.updateLeerling(leerling).subscribe({
      next: () => {
        this.editingField = null;
        this.loadLeerlingen(); // Reload to get the new coach name from the JOIN
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

  openAddLeerlingDialog() {
    const dialogRef = this.dialog.open(AddLeerlingDialogComponent, {
      width: '600px',
      data: { coaches: this.coaches }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.leerlingService.addLeerling(result).subscribe(() => {
          this.loadLeerlingen();
        });
      }
    });
  }

  openAddCoachDialog() {
    const dialogRef = this.dialog.open(AddCoachDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.leerlingService.addCoach(result).subscribe(() => {
          this.loadCoaches();
        });
      }
    });
  }
}
