import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { EVProvider } from "./contexts/EVContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Map from "./pages/Map";
import Stations from "./pages/Stations";
import Notifications from "./pages/Notifications";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Services from "./pages/Services";
import SafetyCompanion from "./pages/SafetyCompanion";
import NotFound from "./pages/NotFound";
import { SiriAssistant } from "./components/SiriAssistant";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <EVProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SiriAssistant />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/map" element={<Map />} />
            <Route path="/stations" element={<Stations />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/services" element={<Services />} />
            <Route path="/safety-companion" element={<SafetyCompanion />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </EVProvider>
  </QueryClientProvider>
);

export default App;
