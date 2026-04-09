import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { PatientFormValues } from "../../dashboard/types";

type PatientFormCardProps = {
  patientCount: number;
  defaultValues: PatientFormValues;
  isSubmitting: boolean;
  onSubmit: (values: PatientFormValues, reset: () => void) => Promise<void>;
};

export function PatientFormCard({ patientCount, defaultValues, isSubmitting, onSubmit }: PatientFormCardProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientFormValues>({
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
        <h2 className="text-xl font-semibold text-slate-950">Patients</h2>
        <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-800">{patientCount} total</span>
      </div>
      <div className="mt-4 space-y-3">
        <input
          {...register("name", { required: "Patient name is required." })}
          placeholder="Jordan Lee"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400"
        />
        {errors.name ? <p className="text-sm text-rose-600">{errors.name.message}</p> : null}
        <input
          type="email"
          {...register("email")}
          placeholder="jordan@example.com"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400"
        />
        <label className="block text-sm font-medium text-slate-600">Date of Birth</label>
        <input
          type="date"
          {...register("dateOfBirth", {
            validate: (value) => {
              if (!value) {
                return true;
              }
              return !Number.isNaN(new Date(value).getTime()) || "Patient date of birth must be a valid date.";
            },
          })}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400"
        />
        {errors.dateOfBirth ? <p className="text-sm text-rose-600">{errors.dateOfBirth.message}</p> : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-slate-950 px-4 py-3 font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? "Saving patient..." : "Add patient"}
        </button>
      </div>
    </form>
  );
}
