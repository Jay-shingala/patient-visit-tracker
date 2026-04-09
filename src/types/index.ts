export type Clinician = {
  id: string;
  name: string;
  specialty: string | null;
  createdAt: string;
};

export type Patient = {
  id: string;
  name: string;
  email: string | null;
  dateOfBirth: string | null;
  createdAt: string;
};

export type Visit = {
  id: string;
  clinicianId: string;
  patientId: string;
  visitedAt: string;
  notes: string | null;
  clinician: {
    id: string;
    name: string;
    specialty: string | null;
  };
  patient: {
    id: string;
    name: string;
    email: string | null;
  };
};
