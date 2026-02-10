import { useSchedule, useDeleteScheduleItem } from "@/hooks/use-schedule";
import { AdminLayout } from "@/components/AdminLayout";
import { ScheduleDialog } from "@/components/ScheduleDialog";
import { Loader2, Trash2, Clock, AlignLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SchedulePage() {
  const { data: schedule, isLoading } = useSchedule();
  const deleteItem = useDeleteScheduleItem();

  const sortedSchedule = schedule?.sort((a, b) => a.order - b.order);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold font-display">Event Schedule</h2>
            <p className="text-muted-foreground text-sm">Manage the daily agenda shown on public pages</p>
          </div>
          <ScheduleDialog mode="create" />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {isLoading ? (
            <div className="py-20 flex justify-center text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : sortedSchedule?.length === 0 ? (
            <div className="py-20 text-center bg-card rounded-2xl border border-border/50 border-dashed">
              <p className="text-muted-foreground">No items in the schedule yet.</p>
            </div>
          ) : (
            sortedSchedule?.map((item) => (
              <div 
                key={item.id} 
                className="bg-card p-4 rounded-xl border border-border/50 shadow-sm flex items-center justify-between group hover:border-primary/20 transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-secondary/50 text-secondary-foreground">
                    <Clock className="w-5 h-5 mb-1 opacity-50" />
                    <span className="text-xs font-bold text-center leading-tight">{item.time}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{item.activity}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <AlignLeft className="w-3 h-3" /> Order: {item.order}
                      </p>
                      {item.delay && item.delay > 0 ? (
                        <p className="text-xs text-destructive font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Retard: {item.delay} min
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ScheduleDialog mode="edit" item={item} />
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Schedule Item?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove "{item.activity}" from the public schedule permanently.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => deleteItem.mutate(item.id)}
                          className="bg-destructive hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
