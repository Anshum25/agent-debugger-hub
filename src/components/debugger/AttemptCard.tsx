import { useState } from "react";
import { ChevronDown, ChevronUp, Search, Wrench, ShieldCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DebugStep {
  attempt_index: number;
  scanner_output: string;
  fixer_output: {
    fixed_code: string;
    change_log: string;
  };
  validator_output: {
    status: "VALID" | "INVALID";
    reasons: string[];
    suggested_feedback_for_fixer: string;
    confidence: number;
  };
  created_at: string;
}

interface AttemptCardProps {
  step: DebugStep;
  isExpanded: boolean;
  onToggle: () => void;
}

const AttemptCard = ({ step, isExpanded, onToggle }: AttemptCardProps) => {
  const [activeTab, setActiveTab] = useState("scanner");
  const isValid = step.validator_output.status === "VALID";

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:border-muted-foreground/30">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-secondary/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-foreground">
            Attempt #{step.attempt_index}
          </span>
          <span
            className={`px-2 py-0.5 text-xs font-medium rounded-full ${
              isValid
                ? "bg-success/10 text-success border border-success/30"
                : "bg-destructive/10 text-destructive border border-destructive/30"
            }`}
          >
            {step.validator_output.status}
          </span>
          <span className="text-xs text-muted-foreground">
            Confidence: {Math.round(step.validator_output.confidence * 100)}%
          </span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="text-xs">{step.created_at}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border animate-fade-in">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid grid-cols-3 bg-secondary/50 p-1 rounded-lg">
              <TabsTrigger
                value="scanner"
                className="flex items-center gap-1.5 text-xs data-[state=active]:bg-card rounded"
              >
                <Search className="w-3 h-3 text-accent" />
                Scanner
              </TabsTrigger>
              <TabsTrigger
                value="fixer"
                className="flex items-center gap-1.5 text-xs data-[state=active]:bg-card rounded"
              >
                <Wrench className="w-3 h-3 text-warning" />
                Fixer
              </TabsTrigger>
              <TabsTrigger
                value="validator"
                className="flex items-center gap-1.5 text-xs data-[state=active]:bg-card rounded"
              >
                <ShieldCheck className="w-3 h-3 text-success" />
                Validator
              </TabsTrigger>
            </TabsList>

            {/* Scanner Tab */}
            <TabsContent value="scanner" className="mt-3">
              <div className="bg-secondary/30 rounded-lg p-3">
                <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                  {step.scanner_output}
                </pre>
              </div>
            </TabsContent>

            {/* Fixer Tab */}
            <TabsContent value="fixer" className="mt-3 space-y-3">
              <div>
                <h4 className="text-xs font-medium text-foreground mb-2">Change Log</h4>
                <div className="bg-secondary/30 rounded-lg p-3">
                  <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                    {step.fixer_output.change_log}
                  </pre>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-medium text-foreground mb-2">Fixed Code Preview</h4>
                <div className="bg-secondary/30 rounded-lg p-3 max-h-40 overflow-auto">
                  <pre className="text-xs font-mono text-foreground whitespace-pre-wrap">
                    {step.fixer_output.fixed_code.slice(0, 300)}
                    {step.fixer_output.fixed_code.length > 300 && "..."}
                  </pre>
                </div>
              </div>
            </TabsContent>

            {/* Validator Tab */}
            <TabsContent value="validator" className="mt-3 space-y-3">
              <div>
                <h4 className="text-xs font-medium text-foreground mb-2">Reasons</h4>
                <ul className="space-y-1">
                  {step.validator_output.reasons.map((reason, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-muted-foreground flex items-start gap-2"
                    >
                      <span className={isValid ? "text-success" : "text-destructive"}>•</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
              {step.validator_output.suggested_feedback_for_fixer && (
                <div>
                  <h4 className="text-xs font-medium text-foreground mb-2">
                    Feedback for Fixer
                  </h4>
                  <p className="text-xs text-muted-foreground bg-secondary/30 rounded-lg p-3">
                    {step.validator_output.suggested_feedback_for_fixer}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default AttemptCard;
export type { DebugStep };
