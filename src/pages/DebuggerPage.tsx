import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bug, ArrowLeft, Moon, Sun, Clock } from "lucide-react";
import { useTheme } from "next-themes";
import { CodeInputPanel, defaultCode } from "@/components/debugger/CodeInputPanel";
import OptionalContextPanel from "@/components/debugger/OptionalContextPanel";
import ThinkingConsole from "@/components/debugger/ThinkingConsole";
import DiffAndSummaryPanel from "@/components/debugger/DiffAndSummaryPanel";
import { DebugStep } from "@/components/debugger/AttemptCard";
import HistoryDrawer from "@/components/debugger/HistoryDrawer";
import { useSessionStore } from "@/store/sessionStore";

interface InitialError {
  id: string;
  line: number | null;
  category: string;
  explanation: string;
  criticality: "low" | "medium" | "high";
}

const DebuggerPage = () => {
  const { theme, setTheme } = useTheme();
  const { data: sessionData, loadingSession } = useSessionStore();
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
  const [initialErrors, setInitialErrors] = useState<InitialError[]>([]);
  const [validatorFeedback, setValidatorFeedback] = useState("");
  const [finalFix, setFinalFix] = useState("");
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // When a session is loaded from the History Drawer, hydrate the UI quadrants
  useEffect(() => {
    if (!sessionData) return;

    setCode(sessionData.code);
    setLanguage(sessionData.language);
    setUserDescription(sessionData.userDescription ?? "");
    setTerminalError(sessionData.terminalError ?? "");
    setSteps(sessionData.steps as DebugStep[]);
    setInitialErrors(sessionData.initialErrors as InitialError[]);
    setFinalFix(sessionData.finalFix);
    setValidatorFeedback(sessionData.validatorFeedback);
    setStatus((sessionData.status === "Failed" ? "Max attempts reached" : sessionData.status) as
      | "Success"
      | "Max attempts reached"
      | null);
  }, [sessionData]);

  const runDebugger = useCallback(async () => {
    setIsRunning(true);
    setSteps([]);
    setStatus(null);
    setInitialErrors([]);
    setFinalFix("");
    setValidatorFeedback("");

    setCurrentPhase("Connecting to agents...");

    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const wsUrl = `${protocol}://${window.location.host}/api/ws/debug`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          code,
          language,
          maxAttempts,
          mode,
          userDescription,
          terminalError,
        })
      );
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (!msg || typeof msg !== "object") return;

        if (msg.type === "phase") {
          setCurrentPhase(String(msg.message ?? ""));
          return;
        }

        if (msg.type === "initial_errors") {
          const errs = Array.isArray(msg.initialErrors) ? (msg.initialErrors as InitialError[]) : [];
          setInitialErrors(errs);
          return;
        }

        if (msg.type === "attempt") {
          const step = msg.step as DebugStep;
          if (!step) return;
          setSteps((prev) => [...prev, step]);
          return;
        }

        if (msg.type === "final") {
          const session = msg.session as {
            status: "Success" | "Max attempts reached" | "Failed" | null;
            finalFix: string;
            validatorFeedback: string;
          };

          setFinalFix(session?.finalFix ?? "");
          setValidatorFeedback(session?.validatorFeedback ?? "");
          setStatus((session?.status === "Failed" ? "Max attempts reached" : session?.status) as
            | "Success"
            | "Max attempts reached"
            | null);
          setIsRunning(false);
          setCurrentPhase("");
          ws.close();
          return;
        }

        if (msg.type === "error") {
          setValidatorFeedback(String(msg.message ?? "Debugger failed"));
          setIsRunning(false);
          setCurrentPhase("");
          ws.close();
        }
      } catch (e) {
        console.error("WS message parse error", e);
      }
    };

    ws.onerror = () => {
      setValidatorFeedback("Failed to connect to the debugger backend.");
      setIsRunning(false);
      setCurrentPhase("");
    };

    ws.onclose = () => {
      setIsRunning(false);
      setCurrentPhase("");
    };
  }, [code, language, maxAttempts, mode, userDescription, terminalError]);

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
        <div className="w-full px-4 sm:px-8 lg:px-16 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsHistoryOpen((prev) => !prev)}
                className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors hidden md:inline-flex"
                title="Toggle history drawer"
              >
                <Clock className="w-5 h-5" />
              </button>
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full mx-auto px-4 sm:px-8 lg:px-16 py-6">
        <div
          className={`relative h-full grid grid-cols-1 gap-4 ${isHistoryOpen ? "xl:grid-cols-[minmax(0,1fr)_18rem]" : "xl:grid-cols-[minmax(0,1fr)]"
            }`}
        >
          {/* Workspace grid */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[calc(100vh-180px)]">
            {/* Column 1: Code Editor */}
            <div className="overflow-hidden">
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
                isRunning={isRunning || loadingSession}
              />
            </div>

            {/* Column 2: Optional Context + Thinking Console */}
            <div className="grid gap-6 overflow-hidden grid-rows-[2fr_3fr]">
              <OptionalContextPanel
                userDescription={userDescription}
                setUserDescription={setUserDescription}
                terminalError={terminalError}
                setTerminalError={setTerminalError}
              />
              <ThinkingConsole steps={steps} isLoading={isRunning} currentPhase={currentPhase} />
            </div>

            {/* Column 3: Diff & Summary */}
            <div className="overflow-hidden">
              <DiffAndSummaryPanel
                originalCode={code}
                finalFix={finalFix}
                status={status}
                attemptsTaken={steps.length}
                initialErrors={initialErrors}
                validatorFeedback={validatorFeedback}
              />
            </div>
          </div>

          {/* History Drawer */}
          {isHistoryOpen && (
            <div className="hidden xl:block h-[calc(100vh-180px)]">
              <HistoryDrawer isOpen={isHistoryOpen} onOpenChange={setIsHistoryOpen} />
            </div>
          )}

          {/* Loading Session overlay across workspace */}
          {loadingSession && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/70 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2 rounded-xl bg-slate-950/90 px-4 py-3 border border-slate-800">
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-xs text-slate-200 font-medium">Loading session...</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DebuggerPage;
