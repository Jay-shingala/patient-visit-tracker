import type { Clinician, Patient, Visit } from "@/types";

export type DashboardData = {
  clinicians: Clinician[];
  patients: Patient[];
  visits: Visit[];
};

export type ClinicianFormValues = {
  name: string;
  specialty: string;
};

export type PatientFormValues = {
  name: string;
  email: string;
  dateOfBirth: string;
};

export type VisitFormValues = {
  clinicianId: string;
  patientId: string;
  visitedAt: string;
  notes: string;
};

export type VisitFilters = {
  clinicianId: string;
  patientId: string;
};

export const emptyClinicianForm: ClinicianFormValues = {
  name: "",
  specialty: "",
};

export const emptyPatientForm: PatientFormValues = {
  name: "",
  email: "",
  dateOfBirth: "",
};

export const createInitialVisitForm = (): VisitFormValues => ({
  clinicianId: "",
  patientId: "",
  visitedAt: new Date().toISOString().slice(0, 16),
  notes: "",
});

export const initialFilters: VisitFilters = {
  clinicianId: "",
  patientId: "",
};
