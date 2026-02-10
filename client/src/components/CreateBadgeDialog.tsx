import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertBadgeSchema } from "@shared/schema";
import { useCreateBadge } from "@/hooks/use-badges";
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
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { nanoid } from "nanoid";

// Form schema - auto-generate ID if empty
const formSchema = insertBadgeSchema.extend({
  qrCodeId: z.string().default(() => nanoid(10)),
});

type FormData = z.infer<typeof formSchema>;

export function CreateBadgeDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const createBadge = useCreateBadge();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      qrCodeId: nanoid(10),
    },
  });

  const onSubmit = (data: FormData) => {
    createBadge.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset({ name: "", qrCodeId: nanoid(10) });
        toast({ title: "Success", description: "Badge created successfully" });
      },
      onError: (err) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
          <Plus className="w-4 h-4" /> Add Badge
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Create New Badge</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} className="h-11 rounded-lg" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="qrCodeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Badge ID (Auto-generated)</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input {...field} readOnly className="bg-muted h-11 rounded-lg font-mono text-sm" />
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="h-11"
                        onClick={() => form.setValue("qrCodeId", nanoid(10))}
                      >
                        Regenerate
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createBadge.isPending} className="min-w-[100px]">
                {createBadge.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Badge"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
