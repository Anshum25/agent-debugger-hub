import { useState } from "react";
import { AlertCircle, CheckCircle, Code, FileCode, MessageSquare } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const mockErrors = [
  { line: 12, description: "Undefined variable 'result'", severity: "high" },
  { line: 28, description: "Missing semicolon", severity: "low" },
  { line: 45, description: "Type mismatch: expected 'string', got 'number'", severity: "medium" },
];

const mockFix = `// Fixed code - Line 12
- const output = result.map(x => x * 2);
+ const result = getData();
+ const output = result.map(x => x * 2);

// Fixed code - Line 28
- console.log("Hello World")
+ console.log("Hello World");

// Fixed code - Line 45
- const name: string = 42;
+ const name: string = "42";`;

const mockFeedback = {
  status: "pass",
  reasoning: "All identified issues have been successfully resolved. The variable 'result' is now properly declared before use, the missing semicolon has been added, and the type mismatch has been corrected by converting the number to a string.",
  confidence: 94,
};

const OutputSection = () => {
  const [activeTab, setActiveTab] = useState("errors");

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/30";
      case "medium":
        return "bg-warning/10 text-warning border-warning/30";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <section id="output" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Debugger Output
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            See how the multi-agent system processes, fixes, and validates code issues.
          </p>
        </div>

        {/* Output Tabs */}
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3 bg-secondary/50 p-1 rounded-xl mb-6">
              <TabsTrigger
                value="errors"
                className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-lg"
              >
                <AlertCircle className="w-4 h-4 text-destructive" />
                <span>Error List</span>
              </TabsTrigger>
              <TabsTrigger
                value="fix"
                className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-lg"
              >
                <Code className="w-4 h-4 text-warning" />
                <span>Proposed Fix</span>
              </TabsTrigger>
              <TabsTrigger
                value="feedback"
                className="flex items-center gap-2 data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-lg"
              >
                <MessageSquare className="w-4 h-4 text-success" />
                <span>Validator Feedback</span>
              </TabsTrigger>
            </TabsList>

            {/* Error List */}
            <TabsContent value="errors" className="animate-fade-in">
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border bg-destructive/5">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-destructive" />
                    <span className="font-medium text-foreground">
                      {mockErrors.length} Issues Detected
                    </span>
                  </div>
                </div>
                <div className="divide-y divide-border">
                  {mockErrors.map((error, index) => (
                    <div key={index} className="p-4 flex items-center gap-4 hover:bg-secondary/30 transition-colors">
                      <div className="flex items-center gap-2 min-w-[80px]">
                        <FileCode className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-mono text-muted-foreground">
                          Line {error.line}
                        </span>
                      </div>
                      <p className="flex-1 text-sm text-foreground">{error.description}</p>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityStyles(
                          error.severity
                        )}`}
                      >
                        {error.severity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Proposed Fix */}
            <TabsContent value="fix" className="animate-fade-in">
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border bg-warning/5">
                  <div className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-warning" />
                    <span className="font-medium text-foreground">Code Diff</span>
                  </div>
                </div>
                <div className="p-4">
                  <pre className="font-mono text-sm leading-relaxed overflow-x-auto">
                    {mockFix.split("\n").map((line, index) => {
                      let lineClass = "text-muted-foreground";
                      if (line.startsWith("-")) lineClass = "text-destructive bg-destructive/10";
                      if (line.startsWith("+")) lineClass = "text-success bg-success/10";
                      if (line.startsWith("//")) lineClass = "text-muted-foreground italic";

                      return (
                        <div key={index} className={`px-2 py-0.5 ${lineClass}`}>
                          {line || " "}
                        </div>
                      );
                    })}
                  </pre>
                </div>
              </div>
            </TabsContent>

            {/* Validator Feedback */}
            <TabsContent value="feedback" className="animate-fade-in">
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border bg-success/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <span className="font-medium text-foreground">Validation Result</span>
                    </div>
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-success/10 text-success border border-success/30">
                      PASS
                    </span>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  {/* Confidence */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Confidence Score</span>
                      <span className="font-semibold text-foreground">{mockFeedback.confidence}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-success rounded-full transition-all duration-1000"
                        style={{ width: `${mockFeedback.confidence}%` }}
                      />
                    </div>
                  </div>

                  {/* Reasoning */}
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-2">Reasoning Summary</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {mockFeedback.reasoning}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default OutputSection;
