import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/LandingPage";
import PublicViewPage from "@/pages/PublicViewPage";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import BadgesPage from "@/pages/admin/BadgesPage";
import SchedulePage from "@/pages/admin/SchedulePage";
import AdminsPage from "@/pages/admin/AdminsPage";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // Redirect to auth endpoint which handles Replit auth flow
    window.location.href = "/api/login";
    return null;
  }

  return <Component />;
}

function Router() {
  const { user, isLoading } = useAuth();

  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/view/:id" component={PublicViewPage} />
      
      {/* Admin Routes - Protected */}
      <Route path="/admin">
        <ProtectedRoute component={AdminDashboard} />
      </Route>
      <Route path="/admin/badges">
        <ProtectedRoute component={BadgesPage} />
      </Route>
      <Route path="/admin/schedule">
        <ProtectedRoute component={SchedulePage} />
      </Route>
      <Route path="/admin/admins">
        <ProtectedRoute component={AdminsPage} />
      </Route>

      {/* Root Route */}
      <Route path="/">
        {isLoading ? (
          <div className="min-h-screen flex items-center justify-center bg-background">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : user ? (
          <Redirect to="/admin" />
        ) : (
          <LandingPage />
        )}
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
