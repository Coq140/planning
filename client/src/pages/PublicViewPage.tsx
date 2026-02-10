import { useRoute } from "wouter";
import { useBadge, useScanBadge } from "@/hooks/use-badges";
import { useSchedule } from "@/hooks/use-schedule";
import { useEffect } from "react";
import { Loader2, Calendar, MapPin, Ticket, Clock } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function PublicViewPage() {
  const [, params] = useRoute("/view/:id");
  const id = params?.id || "";
  
  const { data: badge, isLoading: isLoadingBadge, isError } = useBadge(id);
  const { data: schedule, isLoading: isLoadingSchedule } = useSchedule();
  const scanBadge = useScanBadge();

  // Register scan on mount
  useEffect(() => {
    if (id && !scanBadge.isSuccess) {
      scanBadge.mutate(id);
    }
  }, [id]);

  const sortedSchedule = schedule?.sort((a, b) => a.order - b.order) || [];
  const today = format(new Date(), "EEEE, MMMM do");

  if (isLoadingBadge || isLoadingSchedule) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading event details...</p>
      </div>
    );
  }

  if (isError || !badge) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
        <div className="w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-6">
          <Ticket className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold font-display mb-2">Invalid Badge</h1>
        <p className="text-muted-foreground max-w-xs mx-auto">
          We couldn't find a badge with this ID. Please contact the event organizer.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vh] h-[50vh] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vh] h-[50vh] bg-accent/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md mx-auto px-4 py-8 relative z-10">
        {/* Header Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 dark:bg-card/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-white/10 text-center mb-8"
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 mb-6 transform rotate-3">
             <span className="text-3xl font-bold text-white font-display">
               {badge.name.charAt(0)}
             </span>
          </div>
          
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Welcome</p>
          <h1 className="text-3xl font-bold font-display text-foreground mb-4">
            {badge.name}
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted/50 text-sm font-medium text-muted-foreground">
            <Ticket className="w-3.5 h-3.5" />
            Attendee
          </div>
        </motion.div>

        {/* Schedule Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold font-display flex items-center gap-2">
              Today's Agenda
            </h2>
            <span className="text-xs font-medium text-muted-foreground bg-white dark:bg-muted px-3 py-1 rounded-full shadow-sm border border-border/50">
              {today}
            </span>
          </div>

          <div className="space-y-4">
            {sortedSchedule.length === 0 ? (
              <div className="text-center py-12 bg-white/50 rounded-2xl border border-dashed border-border">
                <p className="text-muted-foreground">No events scheduled yet.</p>
              </div>
            ) : (
              sortedSchedule.map((item, index) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="group bg-white dark:bg-card p-4 rounded-2xl shadow-sm border border-border/50 flex gap-4 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-16 flex flex-col items-center justify-center border-r border-border/50 pr-4">
                    <span className="text-sm font-bold text-primary">{item.time.split(' ')[0]}</span>
                    <span className="text-[10px] text-muted-foreground font-medium uppercase">{item.time.split(' ')[1]}</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {item.activity}
                      </h3>
                      {item.delay && item.delay > 0 ? (
                        <span className="text-[10px] font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" /> +{item.delay} min
                        </span>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>Main Hall</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        <footer className="mt-12 text-center">
          <p className="text-xs text-muted-foreground/50">
            Scan ID: {id} • Powered by EventBadge
          </p>
        </footer>
      </div>
    </div>
  );
}
