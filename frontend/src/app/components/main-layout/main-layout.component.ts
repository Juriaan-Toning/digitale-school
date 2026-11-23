import {ChangeDetectorRef, Component, inject, OnInit, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterOutlet} from '@angular/router';
import {LeerlingService} from '../../services/leerling.service';
import {AuthService} from '../../services/auth.service';
import {Leerling} from '../../models/leerling.model';
import {Coach} from '../../models/coach.model';

// Material Imports
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
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
import {MatSort, MatSortModule} from '@angular/material/sort';

import {AddLeerlingDialogComponent} from '../add-leerling-dialog/add-leerling-dialog.component';
import {AddCoachDialogComponent} from '../add-coach-dialog/add-coach-dialog.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    RouterOutlet,
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
    MatDialogModule,
    MatSortModule
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css'
})
export class MainLayoutComponent implements OnInit {
  title = 'Digitale School';
  leerlingen = new MatTableDataSource<Leerling>([]);
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
  isLoading = false;

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.leerlingen.sort = sort;
  }

  private leerlingService = inject(LeerlingService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);
  private dialog = inject(MatDialog);

  ngOnInit() {
    this.loadLeerlingen();
    this.loadCoaches();
  }

  logout() {
    this.authService.logout();
  }

  loadLeerlingen() {
    this.isLoading = true;
    this.leerlingService.getLeerlingen().subscribe({
      next: (data) => {
        this.leerlingen.data = data;
        this.leerlingen.sortingDataAccessor = (item, property) => {
          switch (property) {
            case 'coachNaam':
              return item.coachNaam || '';
            default:
              return (item as any)[property];
          }
        };
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching leerlingen', err);
        this.isLoading = false;
        this.cdr.detectChanges();
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
    const value = event.value; 
    if (!value) return;

    const date = new Date(value);
    const day = date.getDay();
    if (day === 0 || day === 6) {
      alert('Weekenden zijn niet toegestaan. Kies een doordeweekse dag.');
      this.loadLeerlingen(); 
      this.editingField = null;
      return;
    }

    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
    (leerling as any)[field] = adjustedDate.toISOString().split('T')[0];
    
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
        this.loadLeerlingen(); 
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
    return day !== 0 && day !== 6;
  };

  private getLeerlingStatus(leerling: Leerling): { cssClass: string, title: string } {
    const datumVelden = [
      leerling.startGesprek,
      leerling.evaluatieGesprek1,
      leerling.evaluatieGesprek2,
      leerling.evaluatieGesprek3,
      leerling.evaluatieGesprek4,
      leerling.eindGesprek
    ];

    const nu = new Date();
    nu.setHours(0, 0, 0, 0);

    const ingevuldeDatums = datumVelden
      .filter(d => d !== null && d !== '')
      .map(d => new Date(d!));
    
    const alleGesprekveldenIngevuldEnInVerleden = datumVelden.every(d => d !== null && d !== '') && 
                                                 ingevuldeDatums.every(d => d < nu);

    if (alleGesprekveldenIngevuldEnInVerleden) {
      return { 
        cssClass: 'row-past', 
        title: 'Alle gesprekken zijn afgerond (liggen in het verleden).' 
      };
    }

    const alleDatumVeldenLeeg = datumVelden.every(d => d === null || d === '');
    const geenCoach = leerling.coachId === null;

    if (alleDatumVeldenLeeg || geenCoach) {
      let reden = '';
      if (geenCoach && alleDatumVeldenLeeg) {
        reden = 'Er is geen coach toegewezen en er zijn nog geen gesprekken ingepland.';
      } else if (geenCoach) {
        reden = 'Er is geen coach toegewezen.';
      } else {
        reden = 'Er is nog geen startgesprek ingepland.';
      }
      return { cssClass: 'row-warning', title: reden };
    }

    const heeftLegeVelden = datumVelden.some(d => d === null || d === '');
    const laatsteDatumInVerleden = ingevuldeDatums.length > 0 && 
                                   Math.max(...ingevuldeDatums.map(d => d.getTime())) < nu.getTime();

    if (heeftLegeVelden && laatsteDatumInVerleden) {
      return { 
        cssClass: 'row-danger', 
        title: 'Het laatste gesprek is geweest, maar er is nog geen nieuw gesprek ingepland.'
      };
    }

    return { cssClass: '', title: '' };
  }

  getRowClass(leerling: Leerling): string {
    return this.getLeerlingStatus(leerling).cssClass;
  }

  getRowTitle(leerling: Leerling): string {
    return this.getLeerlingStatus(leerling).title;
  }

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
