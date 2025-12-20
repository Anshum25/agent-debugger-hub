import { Search, Wrench, ShieldCheck, Activity, CheckCircle, XCircle, Clock } from "lucide-react";

const agents = [
  {
    name: "Scanner Agent",
    icon: Search,
    color: "text-accent",
    bgColor: "bg-accent/10",
    status: "online",
    stats: [
      { label: "Last Scan", value: "2 min ago", icon: Clock },
      { label: "Issues Found", value: "7", icon: Activity },
      { label: "Severity High", value: "2", icon: XCircle },
    ],
  },
  {
    name: "Fixer Agent",
    icon: Wrench,
    color: "text-warning",
    bgColor: "bg-warning/10",
    status: "online",
    stats: [
      { label: "Fix Attempts", value: "12", icon: Activity },
      { label: "Success Rate", value: "92%", icon: CheckCircle },
      { label: "Suggested Fixes", value: "5", icon: Wrench },
    ],
  },
  {
    name: "Validator Agent",
    icon: ShieldCheck,
    color: "text-success",
    bgColor: "bg-success/10",
    status: "online",
    stats: [
      { label: "Validations", value: "18", icon: Activity },
      { label: "Passed", value: "15", icon: CheckCircle },
      { label: "Failed", value: "3", icon: XCircle },
    ],
  },
];

const AgentsDashboard = () => {
  return (
    <section id="agents" className="py-24 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Active Agents
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Monitor the status and performance of each specialized agent in real-time.
          </p>
        </div>

        {/* Agent Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {agents.map((agent, index) => {
            const Icon = agent.icon;

            return (
              <div
                key={index}
                className="bg-card border border-border rounded-2xl p-6 hover:border-muted-foreground/30 transition-all duration-300 hover:shadow-lg group"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${agent.bgColor}`}>
                      <Icon className={`w-5 h-5 ${agent.color}`} />
                    </div>
                    <h3 className="font-semibold text-foreground">{agent.name}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span className="text-xs text-success font-medium">Online</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-4">
                  {agent.stats.map((stat, statIndex) => {
                    const StatIcon = stat.icon;
                    return (
                      <div
                        key={statIndex}
                        className="flex items-center justify-between py-3 border-b border-border/50 last:border-0"
                      >
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <StatIcon className="w-4 h-4" />
                          <span className="text-sm">{stat.label}</span>
                        </div>
                        <span className="font-semibold text-foreground">{stat.value}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Activity indicator */}
                <div className="mt-6 h-1 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${agent.color.replace("text-", "bg-")}`}
                    style={{ width: `${60 + index * 15}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AgentsDashboard;
