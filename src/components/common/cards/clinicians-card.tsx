import type { Clinician } from "@/types";

type CliniciansCardProps = {
  clinicians: Clinician[];
  loading: boolean;
};

export function CliniciansCard({ clinicians, loading }: CliniciansCardProps) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white shadow-sm mt-5 max-h-60 space-y-2 overflow-y-auto p-2 text-sm text-slate-600">
      {loading ? <p>Loading clinicians...</p> : null}
      {!loading && clinicians.length === 0 ? <p>No clinicians yet.</p> : null}
      {clinicians.map((clinician) => (
        <div key={clinician.id} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
          <p className="font-medium text-slate-900">{clinician.name}</p>
          <p>{clinician.specialty || "General practice"}</p>
        </div>
      ))}
    </div>
  );
}
