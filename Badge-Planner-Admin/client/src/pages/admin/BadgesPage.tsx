import { useBadges } from "@/hooks/use-badges";
import { AdminLayout } from "@/components/AdminLayout";
import { CreateBadgeDialog } from "@/components/CreateBadgeDialog";
import { QRDialog } from "@/components/QRDialog";
import { Loader2, Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@shared/schema";

export default function BadgesPage() {
  const { data: badges, isLoading } = useBadges();
  const [search, setSearch] = useState("");

  const filteredBadges = badges?.filter(badge => 
    badge.name.toLowerCase().includes(search.toLowerCase()) || 
    badge.qrCodeId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold font-display">Badges</h2>
            <p className="text-muted-foreground text-sm">Manage attendees and QR codes</p>
          </div>
          <CreateBadgeDialog />
        </div>

        <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border/50 bg-muted/20">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name or ID..." 
                className="pl-9 h-10 bg-background rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30 text-xs uppercase text-muted-foreground font-medium">
                <tr>
                  <th className="px-6 py-4 text-left">Name</th>
                  <th className="px-6 py-4 text-left">Badge ID</th>
                  <th className="px-6 py-4 text-center">Scans</th>
                  <th className="px-6 py-4 text-left">Last Scanned</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" /> Loading badges...
                      </div>
                    </td>
                  </tr>
                ) : filteredBadges?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-muted-foreground">
                      No badges found. Create one to get started.
                    </td>
                  </tr>
                ) : (
                  filteredBadges?.map((badge) => (
                    <tr key={badge.id} className="group hover:bg-muted/10 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <User className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-foreground">{badge.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono text-sm text-muted-foreground">
                        {badge.qrCodeId}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                          {badge.scanCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {badge.lastScannedAt ? format(new Date(badge.lastScannedAt), 'MMM d, h:mm a') : 'Never'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <QRDialog badge={badge} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
