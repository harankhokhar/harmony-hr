import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { 
  DollarSign, 
  Download, 
  TrendingUp,
  TrendingDown,
  FileText,
  Calculator,
  Wallet,
  CreditCard,
  PiggyBank
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SalaryStructure {
  basic_salary: number;
  hra: number;
  da: number;
  transport_allowance: number;
  medical_allowance: number;
  special_allowance: number;
  pf_deduction: number;
  tax_deduction: number;
  other_deductions: number;
}

interface PayrollRecord {
  id: string;
  month: number;
  year: number;
  gross_salary: number;
  total_deductions: number;
  net_salary: number;
  payment_status: string;
  payment_date: string | null;
}

const Payroll: React.FC = () => {
  const { user, role } = useAuth();
  const [salaryStructure, setSalaryStructure] = useState<SalaryStructure | null>(null);
  const [payrollHistory, setPayrollHistory] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock salary structure for demo
  const mockSalary: SalaryStructure = {
    basic_salary: 5000,
    hra: 1500,
    da: 500,
    transport_allowance: 300,
    medical_allowance: 200,
    special_allowance: 500,
    pf_deduction: 600,
    tax_deduction: 700,
    other_deductions: 100,
  };

  // Mock payroll history
  const mockPayrollHistory: PayrollRecord[] = [
    { id: '1', month: 1, year: 2026, gross_salary: 8000, total_deductions: 1400, net_salary: 6600, payment_status: 'paid', payment_date: '2026-01-31' },
    { id: '2', month: 12, year: 2025, gross_salary: 8000, total_deductions: 1400, net_salary: 6600, payment_status: 'paid', payment_date: '2025-12-31' },
    { id: '3', month: 11, year: 2025, gross_salary: 8000, total_deductions: 1400, net_salary: 6600, payment_status: 'paid', payment_date: '2025-11-30' },
    { id: '4', month: 10, year: 2025, gross_salary: 7500, total_deductions: 1350, net_salary: 6150, payment_status: 'paid', payment_date: '2025-10-31' },
    { id: '5', month: 9, year: 2025, gross_salary: 7500, total_deductions: 1350, net_salary: 6150, payment_status: 'paid', payment_date: '2025-09-30' },
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setSalaryStructure(mockSalary);
      setPayrollHistory(mockPayrollHistory);
      setLoading(false);
    }, 500);
  }, [user]);

  const calculateTotals = () => {
    if (!salaryStructure) return { gross: 0, deductions: 0, net: 0 };
    
    const earnings = 
      salaryStructure.basic_salary +
      salaryStructure.hra +
      salaryStructure.da +
      salaryStructure.transport_allowance +
      salaryStructure.medical_allowance +
      salaryStructure.special_allowance;

    const deductions = 
      salaryStructure.pf_deduction +
      salaryStructure.tax_deduction +
      salaryStructure.other_deductions;

    return {
      gross: earnings,
      deductions,
      net: earnings - deductions,
    };
  };

  const totals = calculateTotals();

  const earningsBreakdown = salaryStructure ? [
    { label: 'Basic Salary', amount: salaryStructure.basic_salary, percentage: (salaryStructure.basic_salary / totals.gross) * 100 },
    { label: 'HRA', amount: salaryStructure.hra, percentage: (salaryStructure.hra / totals.gross) * 100 },
    { label: 'Dearness Allowance', amount: salaryStructure.da, percentage: (salaryStructure.da / totals.gross) * 100 },
    { label: 'Transport Allowance', amount: salaryStructure.transport_allowance, percentage: (salaryStructure.transport_allowance / totals.gross) * 100 },
    { label: 'Medical Allowance', amount: salaryStructure.medical_allowance, percentage: (salaryStructure.medical_allowance / totals.gross) * 100 },
    { label: 'Special Allowance', amount: salaryStructure.special_allowance, percentage: (salaryStructure.special_allowance / totals.gross) * 100 },
  ] : [];

  const deductionsBreakdown = salaryStructure ? [
    { label: 'Provident Fund', amount: salaryStructure.pf_deduction, percentage: (salaryStructure.pf_deduction / totals.deductions) * 100 },
    { label: 'Income Tax', amount: salaryStructure.tax_deduction, percentage: (salaryStructure.tax_deduction / totals.deductions) * 100 },
    { label: 'Other Deductions', amount: salaryStructure.other_deductions, percentage: (salaryStructure.other_deductions / totals.deductions) * 100 },
  ] : [];

  const getMonthName = (month: number) => {
    return new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Payroll</h1>
            <p className="text-muted-foreground">View your salary details and payslips</p>
          </div>
          <Button className="gradient-bg">
            <Download className="w-4 h-4 mr-2" />
            Download Payslip
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-card overflow-hidden">
            <div className="gradient-bg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Net Salary</p>
                  <h2 className="text-3xl font-bold mt-1">${totals.net.toLocaleString()}</h2>
                  <p className="text-white/70 text-sm mt-1">January 2026</p>
                </div>
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                  <Wallet className="w-7 h-7" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Gross Earnings</p>
                  <h2 className="text-2xl font-bold text-success mt-1">${totals.gross.toLocaleString()}</h2>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="w-4 h-4 text-success" />
                    <span className="text-xs text-success">+6.7% from last month</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Total Deductions</p>
                  <h2 className="text-2xl font-bold text-destructive mt-1">${totals.deductions.toLocaleString()}</h2>
                  <div className="flex items-center gap-1 mt-1">
                    <PiggyBank className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">PF + Tax + Others</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Salary Breakdown */}
        <Tabs defaultValue="breakdown">
          <TabsList>
            <TabsTrigger value="breakdown" className="gap-2">
              <Calculator className="w-4 h-4" />
              Salary Breakdown
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <FileText className="w-4 h-4" />
              Salary History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="breakdown">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Earnings */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-success">
                    <TrendingUp className="w-5 h-5" />
                    Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {earningsBreakdown.map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.label}</span>
                        <span className="font-medium">${item.amount.toLocaleString()}</span>
                      </div>
                      <Progress value={item.percentage} className="h-2 bg-success/20 [&>div]:bg-success" />
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Total Earnings</span>
                      <span className="text-xl font-bold text-success">${totals.gross.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Deductions */}
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                    <TrendingDown className="w-5 h-5" />
                    Deductions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {deductionsBreakdown.map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{item.label}</span>
                        <span className="font-medium">${item.amount.toLocaleString()}</span>
                      </div>
                      <Progress value={item.percentage} className="h-2 bg-destructive/20 [&>div]:bg-destructive" />
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Total Deductions</span>
                      <span className="text-xl font-bold text-destructive">${totals.deductions.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Net Salary Visual */}
            <Card className="glass-card mt-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl gradient-bg flex items-center justify-center">
                      <DollarSign className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Take Home Salary</p>
                      <p className="text-3xl font-bold">${totals.net.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 max-w-md">
                    <div className="flex h-4 rounded-full overflow-hidden">
                      <div 
                        className="bg-success transition-all"
                        style={{ width: `${(totals.net / totals.gross) * 100}%` }}
                      />
                      <div 
                        className="bg-destructive transition-all"
                        style={{ width: `${(totals.deductions / totals.gross) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>Net: {((totals.net / totals.gross) * 100).toFixed(1)}%</span>
                      <span>Deductions: {((totals.deductions / totals.gross) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="glass-card">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Gross Salary</TableHead>
                      <TableHead>Deductions</TableHead>
                      <TableHead>Net Salary</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payslip</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payrollHistory.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {getMonthName(record.month)} {record.year}
                        </TableCell>
                        <TableCell className="text-success">
                          ${record.gross_salary.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-destructive">
                          -${record.total_deductions.toLocaleString()}
                        </TableCell>
                        <TableCell className="font-semibold">
                          ${record.net_salary.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge className={cn(
                            record.payment_status === 'paid' 
                              ? 'status-approved' 
                              : 'status-pending'
                          )}>
                            {record.payment_status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Payroll;
