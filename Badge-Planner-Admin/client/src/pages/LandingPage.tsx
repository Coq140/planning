import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, QrCode, Calendar, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-bold font-display">
              E
            </div>
            <span className="text-xl font-bold font-display tracking-tight">EventBadge</span>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <a href="/api/login">Log In</a>
            </Button>
            <Button asChild className="rounded-full px-6 bg-primary hover:bg-primary/90">
              <a href="/api/login">Get Started</a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[80vh]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-bold font-display tracking-tight text-foreground mb-6">
            Smart Badges for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Modern Events
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
            Générez des badges QR, gérez les plannings et suivez la présence en temps réel.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="rounded-full px-12 h-14 text-lg w-full sm:w-auto shadow-xl shadow-primary/20 font-display" asChild>
              <a href="/api/login">
                Se connecter
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-3xl shadow-sm border border-border/50 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display mb-3">Instant QR Badges</h3>
              <p className="text-muted-foreground leading-relaxed">
                Generate unique QR codes for every attendee instantly. Print or share digitally for seamless check-ins.
              </p>
            </div>
            <div className="bg-background p-8 rounded-3xl shadow-sm border border-border/50 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display mb-3">Live Schedule</h3>
              <p className="text-muted-foreground leading-relaxed">
                Attendees scan their badge to see their personalized daily agenda, always up-to-date in real-time.
              </p>
            </div>
            <div className="bg-background p-8 rounded-3xl shadow-sm border border-border/50 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display mb-3">Attendance Tracking</h3>
              <p className="text-muted-foreground leading-relaxed">
                Monitor scan analytics to see engagement levels and track which attendees are active.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} EventBadge. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
