import type { Clinician, Patient, Visit } from "@/types";
import type { VisitFilters } from "./types";

type VisitsSectionProps = {
  loading: boolean;
  visits: Visit[];
  clinicians: Clinician[];
  patients: Patient[];
  filters: VisitFilters;
  onFiltersChange: (filters: VisitFilters) => void;
};

export function VisitsSection({ loading, visits, clinicians, patients, filters, onFiltersChange }: VisitsSectionProps) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-950">Recent visits</h2>
          <p className="mt-1 text-sm text-slate-500">Newest records appear first. Filters call the visits API with query parameters.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <select
            value={filters.clinicianId}
            onChange={(event) => onFiltersChange({ ...filters, clinicianId: event.target.value })}
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-amber-400"
          >
            <option value="">All clinicians</option>
            {clinicians.map((clinician) => (
              <option key={clinician.id} value={clinician.id}>
                {clinician.name}
              </option>
            ))}
          </select>
          <select
            value={filters.patientId}
            onChange={(event) => onFiltersChange({ ...filters, patientId: event.target.value })}
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400"
          >
            <option value="">All patients</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full border-collapse">
            <thead className="bg-slate-50">
              <tr className="text-left text-sm font-medium text-slate-600">
                <th className="px-5 py-3">Clinician</th>
                <th className="px-5 py-3">Patient</th>
                <th className="px-5 py-3">Visited at</th>
                <th className="px-5 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-sm text-slate-500">
                    Loading dashboard...
                  </td>
                </tr>
              ) : null}
              {!loading && visits.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-sm text-slate-500">
                    No visits match the current filters.
                  </td>
                </tr>
              ) : null}
              {visits.map((visit) => (
                <tr key={visit.id} className="align-top">
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-900">{visit.clinician.name}</p>
                    <p className="text-sm text-slate-500">{visit.clinician.specialty || "General practice"}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-900">{visit.patient.name}</p>
                    <p className="text-sm text-slate-500">{visit.patient.email || "No email provided"}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{new Date(visit.visitedAt).toLocaleString()}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{visit.notes || "No notes"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-slate-200 md:hidden">
          {loading ? <p className="px-5 py-6 text-sm text-slate-500">Loading dashboard...</p> : null}
          {!loading && visits.length === 0 ? <p className="px-5 py-6 text-sm text-slate-500">No visits match the current filters.</p> : null}
          {visits.map((visit) => (
            <div key={visit.id} className="space-y-3 px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Clinician</p>
                <p className="font-medium text-slate-900">{visit.clinician.name}</p>
                <p className="text-sm text-slate-500">{visit.clinician.specialty || "General practice"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Patient</p>
                <p className="font-medium text-slate-900">{visit.patient.name}</p>
                <p className="text-sm text-slate-500">{visit.patient.email || "No email provided"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Visited at</p>
                <p className="text-sm text-slate-600">{new Date(visit.visitedAt).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Notes</p>
                <p className="text-sm text-slate-600">{visit.notes || "No notes"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
