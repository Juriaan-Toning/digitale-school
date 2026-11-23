import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-add-coach-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './add-coach-dialog.component.html',
  styleUrl: './add-coach-dialog.component.css'
})
export class AddCoachDialogComponent {
  private dialogRef = inject(MatDialogRef<AddCoachDialogComponent>);
  naam: string = '';

  onNoClick(): void {
    this.dialogRef.close();
  }
}
