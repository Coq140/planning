import { useStats } from "@/hooks/use-stats";
import { useAuth } from "@/hooks/use-auth";
import { AdminLayout } from "@/components/AdminLayout";
import { Loader2, Ticket, QrCode, TrendingUp, Users } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

function StatCard({ title, value, icon: Icon, color }: { title: string, value: string | number, icon: any, color: string }) {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-bold mt-2 font-display">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = useStats();
  const { user } = useAuth();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  // Mock data for the chart since we only have total scans in API
  const chartData = [
    { name: 'Mon', scans: 4 },
    { name: 'Tue', scans: 7 },
    { name: 'Wed', scans: 12 },
    { name: 'Thu', scans: 25 },
    { name: 'Fri', scans: stats?.totalScans || 45 },
    { name: 'Sat', scans: 18 },
    { name: 'Sun', scans: 9 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold font-display tracking-tight text-foreground">
            Welcome back, {user?.firstName || 'Admin'}
          </h2>
          <p className="text-muted-foreground mt-2 text-lg">
            Here's what's happening with your event badges today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            title="Total Badges" 
            value={stats?.totalBadges || 0} 
            icon={Ticket} 
            color="bg-primary"
          />
          <StatCard 
            title="Total Scans" 
            value={stats?.totalScans || 0} 
            icon={QrCode} 
            color="bg-accent"
          />
          <StatCard 
            title="Active Attendees" 
            value={Math.floor((stats?.totalBadges || 0) * 0.8)} // Mock active rate
            icon={Users} 
            color="bg-green-500"
          />
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold font-display">Scan Activity</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  }}
                />
                <Bar 
                  dataKey="scans" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]} 
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
