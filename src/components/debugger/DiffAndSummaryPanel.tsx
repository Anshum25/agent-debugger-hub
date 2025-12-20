import { useState } from "react";
import { CheckCircle, XCircle, Code, FileCode, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateLineDiff } from "@/lib/diff-utils";

interface InitialError {
  id: string;
  line: number | null;
  category: string;
  explanation: string;
  criticality: "low" | "medium" | "high";
}

interface DiffAndSummaryPanelProps {
  originalCode: string;
  finalFix: string;
  status: "Success" | "Max attempts reached" | null;
  attemptsTaken: number;
  initialErrors: InitialError[];
  validatorFeedback: string;
}

const DiffAndSummaryPanel = ({
  originalCode,
  finalFix,
  status,
  attemptsTaken,
  initialErrors,
  validatorFeedback,
}: DiffAndSummaryPanelProps) => {
  const [activeTab, setActiveTab] = useState("original");

  const getCriticalityStyles = (criticality: string) => {
    switch (criticality) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/30";
      case "medium":
        return "bg-warning/10 text-warning border-warning/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const highSeverityCount = initialErrors.filter((e) => e.criticality === "high").length;

  return (
    <div className="bg-card border border-border rounded-2xl p-6 h-full flex flex-col">
      {/* Summary Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-4 pb-4 border-b border-border">
        {/* Status Badge */}
        {status && (
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
              status === "Success"
                ? "bg-success/10 text-success border border-success/30"
                : "bg-warning/10 text-warning border border-warning/30"
            }`}
          >
            {status === "Success" ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            {status}
          </div>
        )}

        {/* Attempts Pill */}
        {attemptsTaken > 0 && (
          <div className="px-3 py-1.5 rounded-full bg-secondary text-muted-foreground text-sm">
            {attemptsTaken} attempt{attemptsTaken !== 1 ? "s" : ""}
          </div>
        )}

        {/* Errors Fixed */}
        {initialErrors.length > 0 && (
          <div className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm">
            {highSeverityCount > 0 ? `${highSeverityCount} high-severity fixed` : `${initialErrors.length} issues found`}
          </div>
        )}
      </div>

      {/* Initial Errors Summary */}
      {initialErrors.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-destructive" />
            Initial Errors Detected
          </h4>
          <div className="space-y-2 max-h-32 overflow-auto">
            {initialErrors.map((error) => (
              <div
                key={error.id}
                className="flex items-center gap-3 text-xs p-2 bg-secondary/30 rounded-lg"
              >
                <span className="text-muted-foreground font-mono">
                  {error.line ? `Line ${error.line}` : "—"}
                </span>
                <span className="flex-1 text-foreground">{error.explanation}</span>
                <span
                  className={`px-2 py-0.5 rounded-full border text-xs ${getCriticalityStyles(
                    error.criticality
                  )}`}
                >
                  {error.criticality}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Code Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-2 bg-secondary/50 p-1 rounded-lg">
          <TabsTrigger
            value="original"
            className="flex items-center gap-1.5 text-sm data-[state=active]:bg-card rounded"
          >
            <FileCode className="w-4 h-4" />
            Original Code
          </TabsTrigger>
          <TabsTrigger
            value="final"
            className="flex items-center gap-1.5 text-sm data-[state=active]:bg-card rounded"
          >
            <Code className="w-4 h-4" />
            Final Fix
          </TabsTrigger>
        </TabsList>

        <TabsContent value="original" className="flex-1 mt-3">
          <div className="h-full bg-secondary/30 rounded-xl p-4 overflow-auto">
            {originalCode ? (
              <div className="text-sm font-mono text-foreground">
                {finalFix ? (
                  calculateLineDiff(originalCode, finalFix).map((diff, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start ${
                        diff.type === "removed"
                          ? "bg-destructive/20"
                          : diff.type === "added"
                          ? "bg-transparent"
                          : ""
                      }`}
                    >
                      <span className="w-8 text-muted-foreground/50 text-right mr-2 flex-shrink-0 select-none">
                        {diff.type === "removed" ? "-" : ""}
                      </span>
                      <span className="w-8 text-muted-foreground/50 text-right mr-4 flex-shrink-0 select-none">
                        {diff.type !== "added" ? diff.lineNumber : ""}
                      </span>
                      <span
                        className={`flex-1 ${
                          diff.type === "removed"
                            ? "text-destructive line-through"
                            : ""
                        }`}
                      >
                        {diff.content || " "}
                      </span>
                    </div>
                  ))
                ) : (
                  originalCode.split("\n").map((line, idx) => (
                    <div key={idx} className="flex">
                      <span className="w-8 text-muted-foreground/50 text-right mr-4 select-none">
                        {idx + 1}
                      </span>
                      <span>{line}</span>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No code submitted yet.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="final" className="flex-1 mt-3">
          <div className="h-full bg-secondary/30 rounded-xl p-4 overflow-auto">
            {finalFix ? (
              <div className="text-sm font-mono text-foreground">
                {calculateLineDiff(originalCode, finalFix).map((diff, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start ${
                      diff.type === "added"
                        ? "bg-success/20"
                        : diff.type === "removed"
                        ? "bg-transparent"
                        : ""
                    }`}
                  >
                    <span className="w-8 text-muted-foreground/50 text-right mr-2 flex-shrink-0 select-none">
                      {diff.type === "added" ? "+" : ""}
                    </span>
                    <span className="w-8 text-muted-foreground/50 text-right mr-4 flex-shrink-0 select-none">
                      {diff.type !== "removed" ? diff.lineNumber : ""}
                    </span>
                    <span
                      className={`flex-1 ${
                        diff.type === "added"
                          ? "text-success"
                          : diff.type === "removed"
                          ? "line-through opacity-50"
                          : ""
                      }`}
                    >
                      {diff.content || " "}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Run the debugger to see the fixed code.
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Validator Feedback */}
      {validatorFeedback && (
        <div className="mt-4 p-3 bg-success/5 border border-success/20 rounded-xl">
          <h4 className="text-xs font-medium text-success mb-1">Validator Summary</h4>
          <p className="text-xs text-muted-foreground">{validatorFeedback}</p>
        </div>
      )}
    </div>
  );
};

export default DiffAndSummaryPanel;
