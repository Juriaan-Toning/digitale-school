export interface Leerling {
  id: number;
  naam: string;
  coachNaam: string | null;
  coachId: number | null;
  evaluatieGesprek1: string | null;
  evaluatieGesprek2: string | null;
  evaluatieGesprek3: string | null;
  evaluatieGesprek4: string | null;
  eindGesprek: string | null;
  startGesprek: string | null;
}
