import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Calendar, Ticket, Shield, LogOut, Menu } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { logout, user } = useAuth();
  const [location] = useLocation();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/badges", label: "Badges", icon: Ticket },
    { href: "/admin/schedule", label: "Schedule", icon: Calendar },
    { href: "/admin/admins", label: "Admins", icon: Shield },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-8 border-b border-border/10">
        <h1 className="text-2xl font-bold font-display bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          EventBadge
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Administration</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href} className={`
              flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
              ${isActive 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 translate-x-1" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground hover:translate-x-1"}
            `}>
              <item.icon className={`w-5 h-5 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border/10">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <img 
            src={user?.profileImageUrl || "https://ui-avatars.com/api/?name=Admin"} 
            alt="Profile" 
            className="w-8 h-8 rounded-full border border-border" 
          />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate text-foreground">{user?.firstName || "Admin"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => logout()}
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 border-r border-border bg-card fixed h-full z-10">
        <NavContent />
      </aside>

      {/* Mobile Sidebar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-20 flex items-center px-4 justify-between">
        <h1 className="text-xl font-bold font-display bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          EventBadge
        </h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
