import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { 
  Clock, 
  LogIn, 
  LogOut, 
  Calendar,
  MapPin,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AttendanceRecord {
  id: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  status: string;
  location: string | null;
}

const Attendance: React.FC = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (user) {
      fetchTodayAttendance();
    }
  }, [user]);

  const fetchTodayAttendance = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (error) throw error;
      setTodayRecord(data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!user) return;
    
    setCheckingIn(true);
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const checkInTime = new Date().toISOString();

      const { error } = await supabase
        .from('attendance')
        .insert({
          user_id: user.id,
          date: today,
          check_in: checkInTime,
          status: 'present',
          location: 'Office',
        });

      if (error) throw error;

      await fetchTodayAttendance();
      toast.success('Checked in successfully!');
    } catch (error: any) {
      console.error('Error checking in:', error);
      toast.error(error.message || 'Failed to check in');
    } finally {
      setCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    if (!user || !todayRecord) return;
    
    setCheckingOut(true);
    try {
      const checkOutTime = new Date().toISOString();

      const { error } = await supabase
        .from('attendance')
        .update({ check_out: checkOutTime })
        .eq('id', todayRecord.id);

      if (error) throw error;

      await fetchTodayAttendance();
      toast.success('Checked out successfully!');
    } catch (error: any) {
      console.error('Error checking out:', error);
      toast.error(error.message || 'Failed to check out');
    } finally {
      setCheckingOut(false);
    }
  };

  const formatTime = (isoString: string | null) => {
    if (!isoString) return '--:--';
    return format(new Date(isoString), 'hh:mm a');
  };

  const calculateHoursWorked = () => {
    if (!todayRecord?.check_in) return '0h 0m';
    
    const checkIn = new Date(todayRecord.check_in);
    const checkOut = todayRecord.check_out 
      ? new Date(todayRecord.check_out) 
      : new Date();
    
    const diff = checkOut.getTime() - checkIn.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  // Mock monthly data
  const monthlyData = [
    { date: '2026-01-01', status: 'holiday' },
    { date: '2026-01-02', status: 'present' },
    { date: '2026-01-03', status: 'present' },
    { date: '2026-01-04', status: 'weekend' },
    { date: '2026-01-05', status: 'weekend' },
    { date: '2026-01-06', status: 'present' },
    { date: '2026-01-07', status: 'present' },
    { date: '2026-01-08', status: 'absent' },
    { date: '2026-01-09', status: 'present' },
    { date: '2026-01-10', status: 'present' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-success text-success-foreground';
      case 'absent': return 'bg-destructive text-destructive-foreground';
      case 'leave': return 'bg-accent text-accent-foreground';
      case 'holiday': return 'bg-secondary text-secondary-foreground';
      case 'weekend': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Attendance</h1>
          <p className="text-muted-foreground">Track your daily attendance and work hours</p>
        </div>

        {/* Today's Attendance Card */}
        <Card className="glass-card overflow-hidden">
          <div className="gradient-bg p-6 text-white">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-white/80 text-sm">Today</p>
                <h2 className="text-2xl font-bold">
                  {format(new Date(), 'EEEE, MMMM d, yyyy')}
                </h2>
              </div>
              <div className="text-4xl font-bold font-mono">
                {format(currentTime, 'HH:mm:ss')}
              </div>
            </div>
          </div>
          
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Check In */}
              <div className="text-center p-6 rounded-xl bg-success/5 border border-success/10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
                  <LogIn className="w-8 h-8 text-success" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">Check In</p>
                <p className="text-2xl font-bold">
                  {formatTime(todayRecord?.check_in || null)}
                </p>
                {!todayRecord?.check_in && (
                  <Button 
                    onClick={handleCheckIn} 
                    disabled={checkingIn}
                    className="mt-4 gradient-bg"
                  >
                    {checkingIn ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <LogIn className="w-4 h-4 mr-2" />
                    )}
                    Check In
                  </Button>
                )}
              </div>

              {/* Hours Worked */}
              <div className="text-center p-6 rounded-xl bg-primary/5 border border-primary/10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">Hours Worked</p>
                <p className="text-2xl font-bold">{calculateHoursWorked()}</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {todayRecord?.location || 'Not checked in'}
                  </span>
                </div>
              </div>

              {/* Check Out */}
              <div className="text-center p-6 rounded-xl bg-warning/5 border border-warning/10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-warning/10 flex items-center justify-center">
                  <LogOut className="w-8 h-8 text-warning" />
                </div>
                <p className="text-sm text-muted-foreground mb-1">Check Out</p>
                <p className="text-2xl font-bold">
                  {formatTime(todayRecord?.check_out || null)}
                </p>
                {todayRecord?.check_in && !todayRecord?.check_out && (
                  <Button 
                    onClick={handleCheckOut} 
                    disabled={checkingOut}
                    variant="outline"
                    className="mt-4"
                  >
                    {checkingOut ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <LogOut className="w-4 h-4 mr-2" />
                    )}
                    Check Out
                  </Button>
                )}
              </div>
            </div>

            {/* Status */}
            {todayRecord && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span className="text-sm font-medium">
                  You are marked as <Badge className="status-present ml-1">Present</Badge> today
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attendance History */}
        <Tabs defaultValue="weekly">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Attendance History</h2>
            <TabsList>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="weekly">
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="grid grid-cols-7 gap-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground pb-2">
                      {day}
                    </div>
                  ))}
                  {['present', 'present', 'present', 'absent', 'present', 'weekend', 'weekend'].map((status, i) => (
                    <div 
                      key={i}
                      className={cn(
                        "aspect-square rounded-lg flex items-center justify-center",
                        getStatusColor(status)
                      )}
                    >
                      {status === 'present' && <CheckCircle2 className="w-5 h-5" />}
                      {status === 'absent' && <XCircle className="w-5 h-5" />}
                      {status === 'weekend' && <span className="text-xs">Off</span>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monthly">
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground pb-2">
                      {day}
                    </div>
                  ))}
                  {/* Empty cells for first day offset */}
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {/* Days */}
                  {Array.from({ length: 31 }).map((_, i) => {
                    const day = i + 1;
                    const isWeekend = [4, 5, 11, 12, 18, 19, 25, 26].includes(day);
                    const isToday = day === new Date().getDate();
                    
                    return (
                      <div 
                        key={day}
                        className={cn(
                          "aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-colors",
                          isToday && "ring-2 ring-primary",
                          isWeekend ? "bg-muted text-muted-foreground" : "bg-success/10 text-success hover:bg-success/20"
                        )}
                      >
                        {day}
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-success" />
                    <span className="text-sm">Present</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-destructive" />
                    <span className="text-sm">Absent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-warning" />
                    <span className="text-sm">Half Day</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-accent" />
                    <span className="text-sm">Leave</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-secondary" />
                    <span className="text-sm">Holiday</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-success">22</p>
              <p className="text-sm text-muted-foreground">Present Days</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-destructive">1</p>
              <p className="text-sm text-muted-foreground">Absent Days</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-accent">3</p>
              <p className="text-sm text-muted-foreground">Leave Days</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">176h</p>
              <p className="text-sm text-muted-foreground">Total Hours</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
