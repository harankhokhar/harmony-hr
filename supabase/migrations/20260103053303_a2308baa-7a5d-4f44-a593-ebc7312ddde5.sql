-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('employee', 'hr', 'admin');

-- Create enum for leave types
CREATE TYPE public.leave_type AS ENUM ('paid', 'sick', 'casual', 'unpaid');

-- Create enum for leave status
CREATE TYPE public.leave_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');

-- Create enum for attendance status
CREATE TYPE public.attendance_status AS ENUM ('present', 'absent', 'half_day', 'leave', 'holiday');

-- Create enum for employment type
CREATE TYPE public.employment_type AS ENUM ('full_time', 'part_time', 'contract', 'intern');

-- Create departments table
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  employee_id TEXT UNIQUE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  postal_code TEXT,
  avatar_url TEXT,
  department_id UUID REFERENCES public.departments(id),
  designation TEXT,
  employment_type public.employment_type DEFAULT 'full_time',
  join_date DATE,
  reporting_manager_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table (secure role management)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL DEFAULT 'employee',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  check_in TIMESTAMPTZ,
  check_out TIMESTAMPTZ,
  status public.attendance_status NOT NULL DEFAULT 'present',
  location TEXT,
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, date)
);

-- Create leave_balances table
CREATE TABLE public.leave_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  leave_type public.leave_type NOT NULL,
  total_days INTEGER NOT NULL DEFAULT 0,
  used_days NUMERIC(4,1) NOT NULL DEFAULT 0,
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, leave_type, year)
);

-- Create leaves table
CREATE TABLE public.leaves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  leave_type public.leave_type NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_half_day BOOLEAN DEFAULT false,
  reason TEXT,
  attachment_url TEXT,
  status public.leave_status NOT NULL DEFAULT 'pending',
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create salary_structures table
CREATE TABLE public.salary_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  basic_salary NUMERIC(12,2) NOT NULL DEFAULT 0,
  hra NUMERIC(12,2) NOT NULL DEFAULT 0,
  da NUMERIC(12,2) NOT NULL DEFAULT 0,
  transport_allowance NUMERIC(12,2) NOT NULL DEFAULT 0,
  medical_allowance NUMERIC(12,2) NOT NULL DEFAULT 0,
  special_allowance NUMERIC(12,2) NOT NULL DEFAULT 0,
  pf_deduction NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_deduction NUMERIC(12,2) NOT NULL DEFAULT 0,
  other_deductions NUMERIC(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create payroll table
CREATE TABLE public.payroll (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL,
  basic_salary NUMERIC(12,2) NOT NULL DEFAULT 0,
  gross_salary NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_deductions NUMERIC(12,2) NOT NULL DEFAULT 0,
  net_salary NUMERIC(12,2) NOT NULL DEFAULT 0,
  payment_date DATE,
  payment_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, month, year)
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create holidays table
CREATE TABLE public.holidays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  date DATE NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salary_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to check if user is admin or hr
CREATE OR REPLACE FUNCTION public.is_admin_or_hr(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'hr')
  )
$$;

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_employee_id TEXT;
BEGIN
  -- Generate employee ID
  new_employee_id := 'EMP' || LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0');
  
  -- Insert profile
  INSERT INTO public.profiles (id, email, employee_id, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    new_employee_id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  
  -- Insert default role (employee)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, COALESCE((NEW.raw_user_meta_data ->> 'role')::public.app_role, 'employee'));
  
  -- Insert default leave balances for current year
  INSERT INTO public.leave_balances (user_id, leave_type, total_days)
  VALUES 
    (NEW.id, 'paid', 20),
    (NEW.id, 'sick', 10),
    (NEW.id, 'casual', 5),
    (NEW.id, 'unpaid', 0);
  
  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create update triggers for all tables
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON public.departments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON public.attendance FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_leave_balances_updated_at BEFORE UPDATE ON public.leave_balances FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_leaves_updated_at BEFORE UPDATE ON public.leaves FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_salary_structures_updated_at BEFORE UPDATE ON public.salary_structures FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_payroll_updated_at BEFORE UPDATE ON public.payroll FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies

-- Departments: Everyone can read, only admin can modify
CREATE POLICY "Departments are viewable by everyone" ON public.departments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only admins can insert departments" ON public.departments FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can update departments" ON public.departments FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can delete departments" ON public.departments FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Profiles: Users can read all, update own, admins can update all
CREATE POLICY "Profiles are viewable by authenticated users" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id OR public.is_admin_or_hr(auth.uid()));
CREATE POLICY "Only admins can delete profiles" ON public.profiles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- User Roles: Only viewable by self or admin/hr
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_admin_or_hr(auth.uid()));
CREATE POLICY "Only admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can update roles" ON public.user_roles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Attendance: Users can see own, admin/hr can see all
CREATE POLICY "Users can view own attendance" ON public.attendance FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_admin_or_hr(auth.uid()));
CREATE POLICY "Users can insert own attendance" ON public.attendance FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own attendance" ON public.attendance FOR UPDATE TO authenticated USING (auth.uid() = user_id OR public.is_admin_or_hr(auth.uid()));
CREATE POLICY "Only admins can delete attendance" ON public.attendance FOR DELETE TO authenticated USING (public.is_admin_or_hr(auth.uid()));

-- Leave Balances: Users can see own, admin/hr can see all
CREATE POLICY "Users can view own leave balances" ON public.leave_balances FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_admin_or_hr(auth.uid()));
CREATE POLICY "Only admins can manage leave balances" ON public.leave_balances FOR INSERT TO authenticated WITH CHECK (public.is_admin_or_hr(auth.uid()));
CREATE POLICY "Only admins can update leave balances" ON public.leave_balances FOR UPDATE TO authenticated USING (public.is_admin_or_hr(auth.uid()));

-- Leaves: Users can see own, admin/hr can see all
CREATE POLICY "Users can view own leaves" ON public.leaves FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_admin_or_hr(auth.uid()));
CREATE POLICY "Users can apply for leave" ON public.leaves FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pending leaves or admins can update any" ON public.leaves FOR UPDATE TO authenticated USING ((auth.uid() = user_id AND status = 'pending') OR public.is_admin_or_hr(auth.uid()));
CREATE POLICY "Users can delete own pending leaves" ON public.leaves FOR DELETE TO authenticated USING (auth.uid() = user_id AND status = 'pending');

-- Salary Structures: Users can see own, admin/hr can see all
CREATE POLICY "Users can view own salary" ON public.salary_structures FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_admin_or_hr(auth.uid()));
CREATE POLICY "Only admins can manage salaries" ON public.salary_structures FOR INSERT TO authenticated WITH CHECK (public.is_admin_or_hr(auth.uid()));
CREATE POLICY "Only admins can update salaries" ON public.salary_structures FOR UPDATE TO authenticated USING (public.is_admin_or_hr(auth.uid()));
CREATE POLICY "Only admins can delete salaries" ON public.salary_structures FOR DELETE TO authenticated USING (public.is_admin_or_hr(auth.uid()));

-- Payroll: Users can see own, admin/hr can see all
CREATE POLICY "Users can view own payroll" ON public.payroll FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_admin_or_hr(auth.uid()));
CREATE POLICY "Only admins can manage payroll" ON public.payroll FOR INSERT TO authenticated WITH CHECK (public.is_admin_or_hr(auth.uid()));
CREATE POLICY "Only admins can update payroll" ON public.payroll FOR UPDATE TO authenticated USING (public.is_admin_or_hr(auth.uid()));
CREATE POLICY "Only admins can delete payroll" ON public.payroll FOR DELETE TO authenticated USING (public.is_admin_or_hr(auth.uid()));

-- Notifications: Users can only see own
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notifications" ON public.notifications FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Holidays: Everyone can read
CREATE POLICY "Holidays are viewable by everyone" ON public.holidays FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only admins can manage holidays" ON public.holidays FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can update holidays" ON public.holidays FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can delete holidays" ON public.holidays FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Insert default departments
INSERT INTO public.departments (name, description) VALUES
  ('Engineering', 'Software Development and Engineering'),
  ('Human Resources', 'HR and People Operations'),
  ('Finance', 'Finance and Accounting'),
  ('Marketing', 'Marketing and Communications'),
  ('Sales', 'Sales and Business Development'),
  ('Operations', 'Operations and Administration'),
  ('Design', 'UI/UX and Product Design'),
  ('Customer Support', 'Customer Service and Support');

-- Insert some holidays for 2025-2026
INSERT INTO public.holidays (name, date, description) VALUES
  ('New Year', '2026-01-01', 'New Year Day'),
  ('Republic Day', '2026-01-26', 'Republic Day'),
  ('Holi', '2026-03-17', 'Festival of Colors'),
  ('Good Friday', '2026-04-03', 'Good Friday'),
  ('Independence Day', '2026-08-15', 'Independence Day'),
  ('Diwali', '2026-10-20', 'Festival of Lights'),
  ('Christmas', '2026-12-25', 'Christmas Day');