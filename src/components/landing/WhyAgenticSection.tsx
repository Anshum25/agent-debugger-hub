import { Brain, GitBranch, Layers, MessageSquare, Puzzle, Zap } from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Multi-Agent Communication",
    description: "Agents communicate through shared state for coordinated debugging.",
  },
  {
    icon: Brain,
    title: "Independent Reasoning",
    description: "Each agent reasons independently about its specialized task.",
  },
  {
    icon: GitBranch,
    title: "Logical Error Resolution",
    description: "Structured pipeline ensures systematic issue resolution.",
  },
  {
    icon: Puzzle,
    title: "Scalable & Modular",
    description: "Easily extend with new agents for different debugging needs.",
  },
  {
    icon: Layers,
    title: "State Passing",
    description: "Context flows between agents improving fix accuracy.",
  },
  {
    icon: Zap,
    title: "Fast Iteration",
    description: "Multiple attempts with feedback loops for complex bugs.",
  },
];

const WhyAgenticSection = () => {
  return (
    <section id="about" className="py-24 bg-card/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Why Multi-Agent Architecture?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Agentic AI systems outperform single models by specializing tasks and coordinating solutions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group p-6 bg-card border border-border rounded-xl hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyAgenticSection;
