import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface CodeInputPanelProps {
  code: string;
  setCode: (code: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  maxAttempts: number;
  setMaxAttempts: (attempts: number) => void;
  mode: "fast" | "deep";
  setMode: (mode: "fast" | "deep") => void;
  onRun: () => void;
  onReset: () => void;
  isRunning: boolean;
}

const languages = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "Other", label: "Other" },
];

const defaultCode = `def calculate_sum(numbers):
    result = 0
    for num in numbrs:  # Typo: 'numbrs' should be 'numbers'
        result += num
    return reslt  # Typo: 'reslt' should be 'result'

# Type error: passing string instead of list
total = calculate_sum("1, 2, 3")
console.log(total)  # Wrong: using JS syntax in Python`;

const CodeInputPanel = ({
  code,
  setCode,
  language,
  setLanguage,
  maxAttempts,
  setMaxAttempts,
  mode,
  setMode,
  onRun,
  onReset,
  isRunning,
}: CodeInputPanelProps) => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getMonacoLanguage = (lang: string) => {
    const languageMap: Record<string, string> = {
      python: "python",
      javascript: "javascript",
      typescript: "typescript",
      java: "java",
      csharp: "csharp",
      go: "go",
      rust: "rust",
    };
    return languageMap[lang] || "python";
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 h-full flex flex-col">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        {/* Language Select */}
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-40 bg-secondary border-border">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Max Attempts Slider */}


        {/* Mode Toggle */}
        <div className="flex rounded-lg bg-secondary p-1">
          <button
            onClick={() => {
              setMode("fast");
              setMaxAttempts(1);
            }}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${mode === "fast"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Fast
          </button>
          <button
            onClick={() => {
              setMode("deep");
              setMaxAttempts(5);
            }}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${mode === "deep"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
              }`}
          >
            Deep Debug
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 relative overflow-hidden rounded-xl border border-border">
        {mounted && (
          <Editor
            height="100%"
            defaultLanguage={getMonacoLanguage(language)}
            language={getMonacoLanguage(language)}
            value={code}
            onChange={(value) => setCode(value || "")}
            theme={theme === "dark" ? "vs-dark" : "vs"}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              wordWrap: "on",
              formatOnPaste: true,
              formatOnType: true,
              automaticLayout: true,
            }}
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-4">
        <Button
          onClick={onRun}
          disabled={isRunning || !code.trim()}
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
        >
          {isRunning ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Running...
            </>
          ) : (
            "Run Multi-Agent Debugger"
          )}
        </Button>
        <Button
          onClick={onReset}
          variant="outline"
          className="border-border hover:bg-secondary"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export { CodeInputPanel, defaultCode };
