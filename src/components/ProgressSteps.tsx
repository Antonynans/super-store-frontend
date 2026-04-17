interface ProgressStepsProps {
  step1: boolean;
  step2: boolean;
  step3?: boolean;
}

const ProgressSteps = ({ step1, step2, step3 }: ProgressStepsProps) => {
  const steps = [
    { label: "Login", active: step1 },
    { label: "Shipping", active: step2 },
    { label: "Review & Pay", active: !!step3 },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {steps.map((step, index) => (
        <div
          key={step.label}
          className={`rounded-2xl border px-4 py-4 transition ${
            step.active
              ? "border-primary bg-primary-subtle text-primary"
              : "border-border bg-white text-text-secondary"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                step.active
                  ? "bg-primary text-white"
                  : "bg-surface-muted text-text-secondary"
              }`}
            >
              {index + 1}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em]">
                Step {index + 1}
              </p>
              <p className="text-sm font-semibold">{step.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressSteps;
