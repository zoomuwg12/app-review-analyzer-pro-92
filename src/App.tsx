
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppHeader from "./components/AppHeader";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Analysis from "./pages/Analysis";
import EDAAnalysis from "./pages/EDAAnalysis";
import Preprocessing from "./pages/Preprocessing";
import TFIDF from "./pages/TFIDF";
import NGram from "./pages/NGram";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-background">
          <AppHeader />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="/eda-analysis" element={<EDAAnalysis />} />
              <Route path="/preprocessing" element={<Preprocessing />} />
              <Route path="/tfidf" element={<TFIDF />} />
              <Route path="/ngram" element={<NGram />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
