import type { Patient } from "@/types";

type PatientsCardProps = {
  patients: Patient[];
  loading: boolean;
};

export function PatientsCard({ patients, loading }: PatientsCardProps) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white shadow-sm mt-5 max-h-60 space-y-2 overflow-y-auto p-2 text-sm text-slate-600 ">
      {loading ? <p>Loading patients...</p> : null}
      {!loading && patients.length === 0 ? <p>No patients yet.</p> : null}
      {patients.map((patient) => (
        <div key={patient.id} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
          <p className="font-medium text-slate-900">{patient.name}</p>
          <p>{patient.email || "No email provided"}</p>
        </div>
      ))}
    </div>
  );
}
