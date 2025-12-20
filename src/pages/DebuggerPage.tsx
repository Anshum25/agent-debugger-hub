import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Bug, ArrowLeft, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { CodeInputPanel, defaultCode } from "@/components/debugger/CodeInputPanel";
import OptionalContextPanel from "@/components/debugger/OptionalContextPanel";
import ThinkingConsole from "@/components/debugger/ThinkingConsole";
import DiffAndSummaryPanel from "@/components/debugger/DiffAndSummaryPanel";
import { DebugStep } from "@/components/debugger/AttemptCard";

const mockSteps: DebugStep[] = [
  {
    attempt_index: 1,
    scanner_output: `Found 3 issues:
- Line 3: NameError - 'numbrs' is not defined (typo for 'numbers')
- Line 5: NameError - 'reslt' is not defined (typo for 'result')  
- Line 8: TypeError - calculate_sum expects list, got string
- Line 9: NameError - 'console' is not defined in Python`,
    fixer_output: {
      fixed_code: `def calculate_sum(numbers):
    result = 0
    for num in numbers:  # Fixed typo
        result += num
    return result  # Fixed typo

# Fixed: passing list instead of string
total = calculate_sum([1, 2, 3])
print(total)  # Fixed: using Python print()`,
      change_log: `• Fixed typo: 'numbrs' → 'numbers' on line 3
• Fixed typo: 'reslt' → 'result' on line 5
• Fixed type error: "1, 2, 3" → [1, 2, 3] on line 8
• Fixed syntax: console.log → print on line 9`,
    },
    validator_output: {
      status: "VALID",
      reasons: [
        "All variable names are now correctly spelled",
        "Function receives correct data type (list)",
        "Python syntax is used correctly (print instead of console.log)",
      ],
      suggested_feedback_for_fixer: "",
      confidence: 0.95,
    },
    created_at: "Just now",
  },
];

const mockInitialErrors = [
  { id: "1", line: 3, category: "NameError", explanation: "'numbrs' is not defined", criticality: "high" as const },
  { id: "2", line: 5, category: "NameError", explanation: "'reslt' is not defined", criticality: "high" as const },
  { id: "3", line: 8, category: "TypeError", explanation: "Expected list, got string", criticality: "medium" as const },
  { id: "4", line: 9, category: "NameError", explanation: "'console' is not defined in Python", criticality: "low" as const },
];

const phases = [
  "Scanner Agent analyzing code...",
  "Identifying syntax errors and bugs...",
  "Fixer Agent proposing corrections...",
  "Applying intelligent fixes...",
  "Validator Agent checking results...",
  "Verifying fix correctness...",
];

const DebuggerPage = () => {
  const [code, setCode] = useState(defaultCode);
  const [language, setLanguage] = useState("python");
  const [maxAttempts, setMaxAttempts] = useState(3);
  const [mode, setMode] = useState<"fast" | "deep">("fast");
  const [userDescription, setUserDescription] = useState("");
  const [terminalError, setTerminalError] = useState("");
  
  const [isRunning, setIsRunning] = useState(false);
  const [currentPhase, setCurrentPhase] = useState("");
  const [steps, setSteps] = useState<DebugStep[]>([]);
  const [status, setStatus] = useState<"Success" | "Max attempts reached" | null>(null);
  const [initialErrors, setInitialErrors] = useState<typeof mockInitialErrors>([]);
  const [validatorFeedback, setValidatorFeedback] = useState("");
  const [finalFix, setFinalFix] = useState("");

  const runDebugger = useCallback(async () => {
    setIsRunning(true);
    setSteps([]);
    setStatus(null);
    setInitialErrors([]);
    setFinalFix("");
    setValidatorFeedback("");

    // Simulate animated phases
    for (let i = 0; i < phases.length; i++) {
      setCurrentPhase(phases[i]);
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    // Set mock results
    setSteps(mockSteps);
    setInitialErrors(mockInitialErrors);
    setFinalFix(mockSteps[0].fixer_output.fixed_code);
    setValidatorFeedback("All identified issues have been successfully resolved. The code now runs without errors.");
    setStatus("Success");
    setIsRunning(false);
  }, []);

  const resetDebugger = useCallback(() => {
    setCode(defaultCode);
    setSteps([]);
    setStatus(null);
    setInitialErrors([]);
    setFinalFix("");
    setValidatorFeedback("");
    setUserDescription("");
    setTerminalError("");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back</span>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Bug className="w-4 h-4 text-primary" />
                </div>
                <span className="font-semibold text-foreground">Multi-Agent Debugger</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Row */}
          <CodeInputPanel
            code={code}
            setCode={setCode}
            language={language}
            setLanguage={setLanguage}
            maxAttempts={maxAttempts}
            setMaxAttempts={setMaxAttempts}
            mode={mode}
            setMode={setMode}
            onRun={runDebugger}
            onReset={resetDebugger}
            isRunning={isRunning}
          />
          <OptionalContextPanel
            userDescription={userDescription}
            setUserDescription={setUserDescription}
            terminalError={terminalError}
            setTerminalError={setTerminalError}
          />

          {/* Bottom Row */}
          <ThinkingConsole steps={steps} isLoading={isRunning} currentPhase={currentPhase} />
          <DiffAndSummaryPanel
            originalCode={code}
            finalFix={finalFix}
            status={status}
            attemptsTaken={steps.length}
            initialErrors={initialErrors}
            validatorFeedback={validatorFeedback}
          />
        </div>
      </main>
    </div>
  );
};

export default DebuggerPage;
