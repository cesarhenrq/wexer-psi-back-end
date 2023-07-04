export interface CreatePatientDto {
  user: string;
  name: string;
  contact: string;
  birthdate: Date;
  demands?: string;
  personalAnnotations?: string;
}
