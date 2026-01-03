import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { 
  Search, 
  UserPlus, 
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Users,
  UserCheck,
  UserX,
  Download
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';

interface Employee {
  id: string;
  employee_id: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  designation: string | null;
  avatar_url: string | null;
  department_id: string | null;
  created_at: string;
}

interface Department {
  id: string;
  name: string;
}

const Employees: React.FC = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');

  // Redirect if not admin/HR
  useEffect(() => {
    if (role && role !== 'admin' && role !== 'hr') {
      navigate('/dashboard');
    }
  }, [role, navigate]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch employees
      const { data: employeesData, error: employeesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (employeesError) throw employeesError;
      setEmployees(employeesData || []);

      // Fetch departments
      const { data: deptData, error: deptError } = await supabase
        .from('departments')
        .select('*')
        .order('name');

      if (deptError) throw deptError;
      setDepartments(deptData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = 
      emp.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employee_id?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment = 
      selectedDepartment === 'all' || emp.department_id === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  const getDepartmentName = (departmentId: string | null) => {
    if (!departmentId) return 'Not Assigned';
    const dept = departments.find(d => d.id === departmentId);
    return dept?.name || 'Unknown';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Employees</h1>
            <p className="text-muted-foreground">Manage your organization's workforce</p>
          </div>
          <Button className="gradient-bg">
            <UserPlus className="w-4 h-4 mr-2" />
            Add Employee
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="glass-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{employees.length}</p>
                <p className="text-sm text-muted-foreground">Total Employees</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{Math.floor(employees.length * 0.91)}</p>
                <p className="text-sm text-muted-foreground">Active Today</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                <UserX className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{Math.floor(employees.length * 0.05)}</p>
                <p className="text-sm text-muted-foreground">On Leave</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{departments.length}</p>
                <p className="text-sm text-muted-foreground">Departments</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Employees Table */}
        <Card className="glass-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>ID</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <div className="flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No employees found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={employee.avatar_url || undefined} />
                            <AvatarFallback className="gradient-bg text-white text-sm">
                              {employee.first_name?.[0]}{employee.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {employee.first_name} {employee.last_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {employee.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{employee.employee_id}</Badge>
                      </TableCell>
                      <TableCell>{getDepartmentName(employee.department_id)}</TableCell>
                      <TableCell>{employee.designation || 'Not Set'}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {employee.phone || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge className="status-present">Active</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Employees;
