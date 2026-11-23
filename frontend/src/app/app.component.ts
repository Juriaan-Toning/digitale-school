import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeerlingService } from './leerling.service';
import { Leerling } from './leerling.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  title = 'Digitale School';
  leerlingen: Leerling[] = [];
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
    const value = event.target.value;
    if (!value) return;

    const date = new Date(value);
    const day = date.getDay();
    if (day === 0 || day === 6) {
      alert('Weekenden zijn niet toegestaan. Kies een doordeweekse dag.');
      this.loadLeerlingen(); // Reset de waarde
      this.editingField = null;
      return;
    }

    // Update lokaal
    (leerling as any)[field] = value;
    
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

  stopEditing() {
    this.editingField = null;
  }
}
