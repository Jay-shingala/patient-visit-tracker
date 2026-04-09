import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { Clinician, Patient } from "@/types";
import type { VisitFormValues } from "../../dashboard/types";

type VisitFormCardProps = {
  clinicians: Clinician[];
  patients: Patient[];
  defaultValues: VisitFormValues;
  isSubmitting: boolean;
  onSubmit: (values: VisitFormValues, reset: (values: VisitFormValues) => void) => Promise<void>;
};

export function VisitFormCard({ clinicians, patients, defaultValues, isSubmitting, onSubmit }: VisitFormCardProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VisitFormValues>({
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const isDisabled = isSubmitting || clinicians.length === 0 || patients.length === 0;

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values, reset);
      })}
      className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-950">Record visit</h2>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">API-backed</span>
      </div>
      <div className="mt-4 space-y-3">
        <select
          {...register("clinicianId", { required: "Please select a clinician." })}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-400"
        >
          <option value="">Select clinician</option>
          {clinicians.map((clinician) => (
            <option key={clinician.id} value={clinician.id}>
              {clinician.name}
            </option>
          ))}
        </select>
        {errors.clinicianId ? <p className="text-sm text-rose-600">{errors.clinicianId.message}</p> : null}
        <select
          {...register("patientId", { required: "Please select a patient." })}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-400"
        >
          <option value="">Select patient</option>
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name}
            </option>
          ))}
        </select>
        {errors.patientId ? <p className="text-sm text-rose-600">{errors.patientId.message}</p> : null}
        <input
          type="datetime-local"
          {...register("visitedAt", {
            validate: (value) => {
              if (!value) {
                return true;
              }
              return !Number.isNaN(new Date(value).getTime()) || "Visit date must be a valid date and time.";
            },
          })}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-400"
        />
        {errors.visitedAt ? <p className="text-sm text-rose-600">{errors.visitedAt.message}</p> : null}
        <textarea
          rows={5}
          {...register("notes")}
          placeholder="Optional notes from the visit"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-400"
        />
        <button
          type="submit"
          disabled={isDisabled}
          className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
        >
          {isSubmitting ? "Recording visit..." : "Record visit"}
        </button>
      </div>
      <p className="mt-4 text-sm text-slate-500">Create at least one clinician and one patient before recording a visit.</p>
    </form>
  );
}
