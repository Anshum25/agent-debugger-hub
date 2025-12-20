import { useState } from "react";
import { Clock, Loader2 } from "lucide-react";
import AttemptCard, { DebugStep } from "./AttemptCard";

interface ThinkingConsoleProps {
  steps: DebugStep[];
  isLoading: boolean;
  currentPhase: string;
}

const ThinkingConsole = ({ steps, isLoading, currentPhase }: ThinkingConsoleProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <div className="bg-card border border-border rounded-2xl p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Clock className="w-5 h-5 text-muted-foreground" />
          Thinking Console
        </h3>
        {steps.length > 0 && (
          <span className="text-xs text-muted-foreground">
            {steps.length} attempt{steps.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto space-y-4">
        {/* Loading State */}
        {isLoading && (
          <div className="bg-secondary/30 border border-primary/30 rounded-xl p-4 animate-pulse">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
              <div>
                <p className="text-sm font-medium text-foreground">Running multi-agent debugger...</p>
                <p className="text-xs text-muted-foreground mt-1">{currentPhase}</p>
              </div>
            </div>
            <div className="mt-3 h-1 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full animate-shimmer" style={{ width: "60%" }} />
            </div>
          </div>
        )}

        {/* Attempt Cards */}
        {steps.map((step, index) => (
          <AttemptCard
            key={step.attempt_index}
            step={step}
            isExpanded={expandedIndex === index}
            onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
          />
        ))}

        {/* Empty State */}
        {!isLoading && steps.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-center py-12">
            <div>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
                <Clock className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground text-sm">
                No debugging attempts yet.
              </p>
              <p className="text-muted-foreground/60 text-xs mt-1">
                Run the debugger to see the thinking process.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThinkingConsole;
