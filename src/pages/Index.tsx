import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import WorkflowSection from "@/components/landing/WorkflowSection";
import AgentsDashboard from "@/components/landing/AgentsDashboard";
import OutputSection from "@/components/landing/OutputSection";
import WhyAgenticSection from "@/components/landing/WhyAgenticSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <WorkflowSection />
      <AgentsDashboard />
      <OutputSection />
      <WhyAgenticSection />
      <Footer />
    </div>
  );
};

export default Index;
