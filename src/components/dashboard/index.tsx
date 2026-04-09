"use client";

import { useEffect, useState } from "react";
import { fetchJson } from "@/lib/fetch-json";
import type { Clinician, Patient, Visit } from "@/types";
import { ClinicianFormCard } from "../common/cards/clinician-form-card";
import { CliniciansCard } from "../common/cards/clinicians-card";
import { PatientFormCard } from "../common/cards/patient-form-card";
import { PatientsCard } from "../common/cards/patients-card";
import { StatusBanner } from "./status-banner";
import {
  createInitialVisitForm,
  emptyClinicianForm,
  emptyPatientForm,
  initialFilters,
  type ClinicianFormValues,
  type DashboardData,
  type PatientFormValues,
  type VisitFilters,
  type VisitFormValues,
} from "./types";
import { VisitFormCard } from "../common/cards/visit-form-card";
import { VisitsSection } from "./visits-section";

type SubmissionType = "clinician" | "patient" | "visit" | null;

export function Dashboard() {
  const [data, setData] = useState<DashboardData>({ clinicians: [], patients: [], visits: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeSubmission, setActiveSubmission] = useState<SubmissionType>(null);
  const [visitFormDefaults, setVisitFormDefaults] = useState<VisitFormValues>(createInitialVisitForm);
  const [filters, setFilters] = useState<VisitFilters>(initialFilters);

  const filteredVisitsEndpoint = (() => {
    const params = new URLSearchParams();
    if (filters.clinicianId) {
      params.set("clinicianId", filters.clinicianId);
    }
    if (filters.patientId) {
      params.set("patientId", filters.patientId);
    }
    const query = params.toString();
    return query ? `/api/visits?${query}` : "/api/visits";
  })();

  const clearMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  const getErrorMessage = (error: unknown, fallback: string) => {
    return error instanceof Error ? error.message : fallback;
  };

  const ensureVisitDefaults = (clinicians: Clinician[], patients: Patient[]) => {
    setVisitFormDefaults((current) => ({
      ...current,
      clinicianId: current.clinicianId || clinicians[0]?.id || "",
      patientId: current.patientId || patients[0]?.id || "",
    }));
  };

  const loadInitialData = async () => {
    try {
      setLoading(true);
      clearMessages();
      const [clinicians, patients] = await Promise.all([
        fetchJson<Clinician[]>("/api/clinicians"),
        fetchJson<Patient[]>("/api/patients"),
      ]);
      setData((current) => ({ ...current, clinicians, patients }));
      ensureVisitDefaults(clinicians, patients);
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to load data."));
    } finally {
      setLoading(false);
    }
  };

  const loadVisits = async () => {
    try {
      setError(null);
      const visits = await fetchJson<Visit[]>(filteredVisitsEndpoint);
      setData((current) => ({ ...current, visits }));
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to load visits."));
    }
  };

  useEffect(() => {
     loadInitialData();

  }, []);

  useEffect(() => {
    if (!loading) {
       loadVisits();
    }
  }, [filters, loading]);

  const handleClinicianSubmit = async (values: ClinicianFormValues, resetForm: () => void) => {
    try {
      setActiveSubmission("clinician");
      clearMessages();

      const clinician = await fetchJson<Clinician>("/api/clinicians", {
        method: "POST",
        body: JSON.stringify(values),
      });

      setData((current) => {
        const clinicians = [...current.clinicians, clinician].sort((a, b) => a.name.localeCompare(b.name));
        ensureVisitDefaults(clinicians, current.patients);
        return {
          ...current,
          clinicians,
        };
      });
      resetForm();
      setSuccessMessage("Clinician created successfully.");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to create clinician."));
    } finally {
      setActiveSubmission(null);
    }
  };

  const handlePatientSubmit = async (values: PatientFormValues, resetForm: () => void) => {
    try {
      setActiveSubmission("patient");
      clearMessages();

      const patient = await fetchJson<Patient>("/api/patients", {
        method: "POST",
        body: JSON.stringify(values),
      });

      setData((current) => {
        const patients = [...current.patients, patient].sort((a, b) => a.name.localeCompare(b.name));
        ensureVisitDefaults(current.clinicians, patients);
        return {
          ...current,
          patients,
        };
      });
      resetForm();
      setSuccessMessage("Patient created successfully.");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to create patient."));
    } finally {
      setActiveSubmission(null);
    }
  };

  const handleVisitSubmit = async (
    values: VisitFormValues,
    resetForm: (values: VisitFormValues) => void,
  ) => {
    try {
      setActiveSubmission("visit");
      clearMessages();

      await fetchJson<Visit>("/api/visits", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          visitedAt: values.visitedAt ? new Date(values.visitedAt).toISOString() : undefined,
        }),
      });

      const nextDefaults: VisitFormValues = {
        ...values,
        visitedAt: createInitialVisitForm().visitedAt,
        notes: "",
      };
      setVisitFormDefaults(nextDefaults);
      resetForm(nextDefaults);
      await loadVisits();
      setSuccessMessage("Visit recorded successfully.");
    } catch (requestError) {
      setError(getErrorMessage(requestError, "Unable to create visit."));
    } finally {
      setActiveSubmission(null);
    }
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#fef3c7,_transparent_35%),linear-gradient(180deg,_#fffaf0_0%,_#f8fafc_100%)] text-slate-900">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:px-10">
        <section className="rounded-[2rem] border border-amber-200/70 bg-white/80 p-8 shadow-[0_20px_70px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">Patient Visit Tracker</p>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Manage clinicians, patients, and visits from one dashboard.</h1>
              <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
                Built with Next.js route handlers, Prisma ORM, and Neon PostgreSQL. Create records quickly, record visits, and filter the timeline by clinician or patient.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-950 px-5 py-4 text-sm text-slate-100">
              <p>Visits are sorted newest first.</p>
              <p className="mt-1 text-slate-300">Use the filter controls below to narrow the timeline.</p>
            </div>
          </div>
        </section>

        {error ? <StatusBanner tone="error" message={error} /> : null}
        {successMessage ? <StatusBanner tone="success" message={successMessage} /> : null}

        <section className="grid gap-6 lg:grid-cols-[1.1fr_1.1fr_1.3fr]">
          <div>
            <ClinicianFormCard
              clinicianCount={data.clinicians.length}
              defaultValues={emptyClinicianForm}
              isSubmitting={activeSubmission === "clinician"}
              onSubmit={handleClinicianSubmit}
            />
            <CliniciansCard clinicians={data.clinicians} loading={loading} />
          </div>

          <div>
            <PatientFormCard
              patientCount={data.patients.length}
              defaultValues={emptyPatientForm}
              isSubmitting={activeSubmission === "patient"}
              onSubmit={handlePatientSubmit}
            />
            <PatientsCard patients={data.patients} loading={loading} />
          </div>

          <VisitFormCard
            clinicians={data.clinicians}
            patients={data.patients}
            defaultValues={visitFormDefaults}
            isSubmitting={activeSubmission === "visit"}
            onSubmit={handleVisitSubmit}
          />
        </section>

        <VisitsSection
          loading={loading}
          visits={data.visits}
          clinicians={data.clinicians}
          patients={data.patients}
          filters={filters}
          onFiltersChange={setFilters}
        />
      </div>
    </main>
  );
}
