import { useAdmins, useCreateAdmin, useDeleteAdmin } from "@/hooks/use-admins";
import { AdminLayout } from "@/components/AdminLayout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAdminSchema, type InsertAdmin } from "@shared/schema";
import { Loader2, Trash2, ShieldCheck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminsPage() {
  const { data: admins, isLoading } = useAdmins();
  const createAdmin = useCreateAdmin();
  const deleteAdmin = useDeleteAdmin();
  const { toast } = useToast();

  const form = useForm<InsertAdmin>({
    resolver: zodResolver(insertAdminSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: InsertAdmin) => {
    createAdmin.mutate(data, {
      onSuccess: () => {
        form.reset();
        toast({ title: "Admin Added", description: `${data.email} can now access the panel.` });
      },
      onError: (err) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h2 className="text-2xl font-bold font-display">Manage Admins</h2>
          <p className="text-muted-foreground text-sm">Control who has access to this dashboard</p>
        </div>

        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" /> Invite New Admin
            </CardTitle>
            <CardDescription>
              Enter the email address and password of the user you want to grant admin access to.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="colleague@example.com" {...field} className="h-11 rounded-lg" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input type="password" placeholder="Mot de passe" {...field} className="h-11 rounded-lg" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full h-11 px-6 bg-primary hover:bg-primary/90" disabled={createAdmin.isPending}>
                  {createAdmin.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Admin"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Current Admins</h3>
          
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="space-y-2">
              {admins?.map((admin) => (
                <div key={admin.id} className="flex items-center justify-between p-4 bg-card rounded-xl border border-border/50 group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className="font-medium">{admin.email}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => deleteAdmin.mutate(admin.id)}
                    className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    disabled={deleteAdmin.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
