import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { Leerling } from '../../leerling.model';
import { Coach } from '../../coach.model';

@Component({
  selector: 'app-add-leerling-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatSelectModule
  ],
  templateUrl: './add-leerling-dialog.component.html',
  styleUrl: './add-leerling-dialog.component.css'
})
export class AddLeerlingDialogComponent {
  private dialogRef = inject(MatDialogRef<AddLeerlingDialogComponent>);
  private data = inject(MAT_DIALOG_DATA);

  leerling: Partial<Leerling> = {
    naam: '',
    coachId: null,
    startGesprek: null,
    evaluatieGesprek1: null,
    evaluatieGesprek2: null,
    evaluatieGesprek3: null,
    evaluatieGesprek4: null,
    eindGesprek: null
  };
  
  coaches: Coach[] = this.data.coaches;

  onNoClick(): void {
    this.dialogRef.close();
  }

  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    return day !== 0 && day !== 6;
  };
}
