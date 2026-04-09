import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { ClinicianFormValues } from "../../dashboard/types";

type ClinicianFormCardProps = {
  clinicianCount: number;
  defaultValues: ClinicianFormValues;
  isSubmitting: boolean;
  onSubmit: (values: ClinicianFormValues, reset: () => void) => Promise<void>;
};

export function ClinicianFormCard({ clinicianCount, defaultValues, isSubmitting, onSubmit }: ClinicianFormCardProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClinicianFormValues>({
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        await onSubmit(values, () => reset(defaultValues));
      })}
      className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-950">Clinicians</h2>
        <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">{clinicianCount} total</span>
      </div>
      <div className="mt-4 space-y-3">
        <input
          {...register("name", { required: "Clinician name is required." })}
          placeholder="Dr. Maya Lopez"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-amber-400"
        />
        {errors.name ? <p className="text-sm text-rose-600">{errors.name.message}</p> : null}
        <input
          {...register("specialty")}
          placeholder="Cardiology"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-amber-400"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-slate-950 px-4 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? "Saving clinician..." : "Add clinician"}
        </button>
      </div>
    </form>
  );
}
