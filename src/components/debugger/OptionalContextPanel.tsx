import { HelpCircle, Terminal } from "lucide-react";

interface OptionalContextPanelProps {
  userDescription: string;
  setUserDescription: (value: string) => void;
  terminalError: string;
  setTerminalError: (value: string) => void;
}

const OptionalContextPanel = ({
  userDescription,
  setUserDescription,
  terminalError,
  setTerminalError,
}: OptionalContextPanelProps) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-5 h-5 text-muted-foreground" />
        <h3 className="font-semibold text-foreground">
          Optional Context <span className="text-muted-foreground font-normal">(improves debugging)</span>
        </h3>
      </div>

      <div className="flex-1 space-y-4">
        {/* Problem Description */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-foreground mb-2">
            Explain the problem (optional)
          </label>
          <textarea
            value={userDescription}
            onChange={(e) => setUserDescription(e.target.value)}
            placeholder="Describe what you were trying to do, what you expected, and what happened..."
            className="w-full h-28 p-3 bg-secondary/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Help the debugger understand your intent.
          </p>
        </div>

        {/* Terminal Error */}
        <div className="flex-1">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
            <Terminal className="w-4 h-4" />
            Paste terminal error / stack trace (optional)
          </label>
          <textarea
            value={terminalError}
            onChange={(e) => setTerminalError(e.target.value)}
            placeholder="Paste the exact error message from your terminal or browser console..."
            className="w-full h-28 p-3 bg-secondary/50 border border-border rounded-xl font-mono text-xs text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            spellCheck={false}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Stack traces help identify the exact issue location.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OptionalContextPanel;
