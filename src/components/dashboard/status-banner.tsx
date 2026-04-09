type StatusBannerProps = {
  tone: "error" | "success";
  message: string;
};

const toneClasses = {
  error: "border-rose-200 bg-rose-50 text-rose-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

export function StatusBanner({ tone, message }: StatusBannerProps) {
  return <div className={`rounded-2xl border px-4 py-3 text-sm ${toneClasses[tone]}`}>{message}</div>;
}
