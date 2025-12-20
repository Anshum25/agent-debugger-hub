import { Search, Wrench, ShieldCheck, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

const steps = [
  {
    icon: Search,
    name: "Scanner Agent",
    description: "Scans the codebase to identify syntax errors, logical bugs, and warnings.",
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/30",
  },
  {
    icon: Wrench,
    name: "Fixer Agent",
    description: "Analyzes detected issues and attempts intelligent corrections.",
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/30",
  },
  {
    icon: ShieldCheck,
    name: "Validator Agent",
    description: "Validates whether the fix resolves the issue without introducing new bugs.",
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/30",
  },
];

const WorkflowSection = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="workflow" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How the Multi-Agent Debugger Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Three specialized agents work together in a pipeline to detect, fix, and validate code issues.
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === activeStep;

            return (
              <div key={index} className="flex items-center gap-4">
                {/* Step Card */}
                <div
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-500 cursor-pointer w-full lg:w-80 ${
                    isActive
                      ? `${step.borderColor} ${step.bgColor} scale-105 shadow-lg`
                      : "border-border bg-card hover:border-muted-foreground/30"
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  {/* Status Badge */}
                  <div className="absolute -top-3 left-6">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        isActive
                          ? `${step.bgColor} ${step.color} border ${step.borderColor}`
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {isActive ? "Running" : index < activeStep ? "Completed" : "Idle"}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className={`p-3 rounded-xl ${step.bgColor} w-fit mb-4 mt-2`}>
                    <Icon className={`w-6 h-6 ${step.color}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>

                  {/* Progress indicator for active step */}
                  {isActive && (
                    <div className="mt-4 h-1 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full animate-pulse ${step.color.replace("text-", "bg-")}`}
                        style={{ width: "100%", animation: "shimmer 2s linear infinite" }}
                      />
                    </div>
                  )}
                </div>

                {/* Arrow between steps */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex items-center">
                    <ArrowRight className="w-6 h-6 text-muted-foreground/50" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Process indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === activeStep ? "bg-primary w-6" : "bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
