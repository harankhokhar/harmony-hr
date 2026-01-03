import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format, differenceInDays } from 'date-fns';
import { 
  CalendarPlus, 
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

type LeaveType = 'paid' | 'sick' | 'casual' | 'unpaid';
type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

interface LeaveRequest {
  id: string;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  reason: string | null;
  status: LeaveStatus;
  created_at: string;
  is_half_day: boolean;
}

interface LeaveBalance {
  leave_type: LeaveType;
  total_days: number;
  used_days: number;
}

const Leave: React.FC = () => {
  const { user, role } = useAuth();
  const isAdminOrHR = role === 'admin' || role === 'hr';
  
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [leaveType, setLeaveType] = useState<LeaveType>('paid');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [isHalfDay, setIsHalfDay] = useState(false);

  useEffect(() => {
    if (user) {
      fetchLeaveData();
    }
  }, [user]);

  const fetchLeaveData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch user's leaves
      const { data: leavesData, error: leavesError } = await supabase
        .from('leaves')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (leavesError) throw leavesError;
      setLeaves(leavesData || []);

      // Fetch leave balances
      const { data: balancesData, error: balancesError } = await supabase
        .from('leave_balances')
        .select('*')
        .eq('user_id', user.id);

      if (balancesError) throw balancesError;
      setBalances(balancesData || []);

      // If admin/HR, fetch pending approvals
      if (isAdminOrHR) {
        const { data: pendingData, error: pendingError } = await supabase
          .from('leaves')
          .select(`
            *,
            profiles:user_id (first_name, last_name, employee_id, designation)
          `)
          .eq('status', 'pending')
          .order('created_at', { ascending: true });

        if (pendingError) throw pendingError;
        setPendingApprovals(pendingData || []);
      }
    } catch (error) {
      console.error('Error fetching leave data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || !startDate || !endDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('leaves')
        .insert({
          user_id: user.id,
          leave_type: leaveType,
          start_date: startDate,
          end_date: endDate,
          reason: reason || null,
          is_half_day: isHalfDay,
          status: 'pending',
        });

      if (error) throw error;

      toast.success('Leave request submitted successfully');
      setDialogOpen(false);
      resetForm();
      fetchLeaveData();
    } catch (error: any) {
      console.error('Error submitting leave:', error);
      toast.error(error.message || 'Failed to submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproval = async (leaveId: string, approve: boolean) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('leaves')
        .update({
          status: approve ? 'approved' : 'rejected',
          approved_by: user.id,
          approved_at: new Date().toISOString(),
        })
        .eq('id', leaveId);

      if (error) throw error;

      toast.success(`Leave request ${approve ? 'approved' : 'rejected'}`);
      fetchLeaveData();
    } catch (error: any) {
      console.error('Error updating leave:', error);
      toast.error('Failed to update leave request');
    }
  };

  const resetForm = () => {
    setLeaveType('paid');
    setStartDate('');
    setEndDate('');
    setReason('');
    setIsHalfDay(false);
  };

  const getStatusBadge = (status: LeaveStatus) => {
    const styles = {
      pending: 'status-pending',
      approved: 'status-approved',
      rejected: 'status-rejected',
      cancelled: 'bg-muted text-muted-foreground',
    };
    return <Badge className={cn('capitalize', styles[status])}>{status}</Badge>;
  };

  const getLeaveTypeLabel = (type: LeaveType) => {
    const labels = {
      paid: 'Paid Leave',
      sick: 'Sick Leave',
      casual: 'Casual Leave',
      unpaid: 'Unpaid Leave',
    };
    return labels[type];
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const days = differenceInDays(new Date(endDate), new Date(startDate)) + 1;
    return isHalfDay ? 0.5 : days;
  };

  const getBalance = (type: LeaveType) => {
    const balance = balances.find(b => b.leave_type === type);
    return balance ? balance.total_days - Number(balance.used_days) : 0;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Leave Management</h1>
            <p className="text-muted-foreground">Apply for leave and track your requests</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-bg">
                <CalendarPlus className="w-4 h-4 mr-2" />
                Apply Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Apply for Leave</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Leave Type</Label>
                  <Select value={leaveType} onValueChange={(v: LeaveType) => setLeaveType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid Leave ({getBalance('paid')} days left)</SelectItem>
                      <SelectItem value="sick">Sick Leave ({getBalance('sick')} days left)</SelectItem>
                      <SelectItem value="casual">Casual Leave ({getBalance('casual')} days left)</SelectItem>
                      <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={format(new Date(), 'yyyy-MM-dd')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || format(new Date(), 'yyyy-MM-dd')}
                    />
                  </div>
                </div>

                {startDate && endDate && (
                  <div className="p-3 rounded-lg bg-primary/10 text-sm">
                    <span className="font-medium">Duration: </span>
                    {calculateDays()} {calculateDays() === 1 ? 'day' : 'days'}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter reason for leave..."
                    rows={3}
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={submitting || !startDate || !endDate}
                  className="w-full gradient-bg"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <CalendarPlus className="w-4 h-4 mr-2" />
                  )}
                  Submit Request
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Leave Balance Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { type: 'paid' as LeaveType, label: 'Paid Leave', color: 'text-primary bg-primary/10' },
            { type: 'sick' as LeaveType, label: 'Sick Leave', color: 'text-warning bg-warning/10' },
            { type: 'casual' as LeaveType, label: 'Casual Leave', color: 'text-secondary bg-secondary/10' },
            { type: 'unpaid' as LeaveType, label: 'Unpaid Leave', color: 'text-muted-foreground bg-muted' },
          ].map(({ type, label, color }) => {
            const balance = balances.find(b => b.leave_type === type);
            const total = balance?.total_days || 0;
            const used = balance?.used_days || 0;
            const remaining = total - Number(used);
            
            return (
              <Card key={type} className="glass-card">
                <CardContent className="p-4">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", color)}>
                    <Calendar className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-bold">{remaining}</span>
                    <span className="text-sm text-muted-foreground">/ {total}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Tabs */}
        <Tabs defaultValue={isAdminOrHR ? "approvals" : "history"}>
          <TabsList>
            {isAdminOrHR && (
              <TabsTrigger value="approvals" className="gap-2">
                <Clock className="w-4 h-4" />
                Pending Approvals
                {pendingApprovals.length > 0 && (
                  <Badge variant="destructive" className="ml-1 h-5 w-5 p-0 justify-center">
                    {pendingApprovals.length}
                  </Badge>
                )}
              </TabsTrigger>
            )}
            <TabsTrigger value="history" className="gap-2">
              <FileText className="w-4 h-4" />
              My Requests
            </TabsTrigger>
          </TabsList>

          {/* Pending Approvals (Admin) */}
          {isAdminOrHR && (
            <TabsContent value="approvals">
              <Card className="glass-card">
                <CardContent className="p-0">
                  {pendingApprovals.length === 0 ? (
                    <div className="text-center py-12">
                      <CheckCircle2 className="w-12 h-12 mx-auto text-success mb-4" />
                      <p className="text-muted-foreground">No pending leave requests</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Employee</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingApprovals.map((leave) => (
                          <TableRow key={leave.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">
                                  {leave.profiles?.first_name} {leave.profiles?.last_name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {leave.profiles?.employee_id}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {leave.leave_type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="text-sm">
                                  {format(new Date(leave.start_date), 'MMM d')} - {format(new Date(leave.end_date), 'MMM d, yyyy')}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {differenceInDays(new Date(leave.end_date), new Date(leave.start_date)) + 1} days
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[200px]">
                              <p className="text-sm truncate">{leave.reason || '-'}</p>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleApproval(leave.id, true)}
                                  className="bg-success hover:bg-success/90"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleApproval(leave.id, false)}
                                >
                                  <XCircle className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Leave History */}
          <TabsContent value="history">
            <Card className="glass-card">
              <CardContent className="p-0">
                {leaves.length === 0 ? (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No leave requests yet</p>
                    <Button 
                      className="mt-4" 
                      variant="outline"
                      onClick={() => setDialogOpen(true)}
                    >
                      Apply for Leave
                    </Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Days</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Applied On</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaves.map((leave) => (
                        <TableRow key={leave.id}>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {leave.leave_type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {format(new Date(leave.start_date), 'MMM d')} - {format(new Date(leave.end_date), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            {leave.is_half_day ? 0.5 : differenceInDays(new Date(leave.end_date), new Date(leave.start_date)) + 1}
                          </TableCell>
                          <TableCell>{getStatusBadge(leave.status)}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(leave.created_at), 'MMM d, yyyy')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Leave;
