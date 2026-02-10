import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertScheduleSchema, type ScheduleItem } from "@shared/schema";
import { useCreateScheduleItem, useUpdateScheduleItem } from "@/hooks/use-schedule";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { z } from "zod";

const formSchema = insertScheduleSchema;
type FormData = z.infer<typeof formSchema>;

interface ScheduleDialogProps {
  mode: "create" | "edit";
  item?: ScheduleItem;
}

export function ScheduleDialog({ mode, item }: ScheduleDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const createItem = useCreateScheduleItem();
  const updateItem = useUpdateScheduleItem();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      time: "",
      activity: "",
      delay: 0,
      order: 0,
    },
  });

  // Reset form when opening in edit mode
  useEffect(() => {
    if (open && mode === "edit" && item) {
      form.reset({
        time: item.time,
        activity: item.activity,
        delay: item.delay || 0,
        order: item.order,
      });
    } else if (open && mode === "create") {
      form.reset({ time: "", activity: "", delay: 0, order: 0 });
    }
  }, [open, mode, item, form]);

  const onSubmit = (data: FormData) => {
    const action = mode === "create" 
      ? createItem.mutateAsync(data)
      : updateItem.mutateAsync({ id: item!.id, ...data });

    action
      .then(() => {
        setOpen(false);
        toast({ title: "Success", description: `Schedule item ${mode}d successfully` });
      })
      .catch((err) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      });
  };

  const isPending = createItem.isPending || updateItem.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" /> Add Event
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
            <Pencil className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {mode === "create" ? "Add Schedule Item" : "Edit Item"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <div className="grid grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input placeholder="09:00 AM" {...field} className="h-11 rounded-lg" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Sort</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        className="h-11 rounded-lg"
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="activity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Activity Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Keynote Speech..." {...field} className="h-11 rounded-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="delay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Retard (minutes)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="0" 
                      {...field} 
                      className="h-11 rounded-lg"
                      value={field.value ?? 0}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="min-w-[100px]">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
