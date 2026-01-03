import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  User, 
  Briefcase, 
  DollarSign, 
  FileText, 
  Activity,
  Edit2,
  Save,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building
} from 'lucide-react';

interface ProfileData {
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  date_of_birth: string | null;
  gender: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  postal_code: string | null;
  designation: string | null;
  employee_id: string | null;
}

const Profile: React.FC = () => {
  const { user, profile, role, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    designation: '',
    employee_id: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        date_of_birth: '',
        gender: '',
        address: '',
        city: '',
        state: '',
        country: '',
        postal_code: '',
        designation: profile.designation || '',
        employee_id: profile.employee_id || '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postal_code: formData.postal_code,
        })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const InfoField = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string | null }) => (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
      <Icon className="w-5 h-5 text-muted-foreground mt-0.5" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value || 'Not set'}</p>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      {/* Profile Header */}
      <Card className="mb-6 overflow-hidden">
        {/* Cover Image */}
        <div className="h-32 md:h-48 gradient-bg-secondary" />
        
        <CardContent className="relative pb-6">
          {/* Avatar */}
          <div className="absolute -top-12 md:-top-16 left-6">
            <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background shadow-lg">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="text-2xl md:text-3xl gradient-bg text-white font-bold">
                {profile?.first_name?.[0]}{profile?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>
          
          {/* Info */}
          <div className="pt-14 md:pt-20 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {profile?.first_name} {profile?.last_name}
              </h1>
              <p className="text-muted-foreground">{profile?.designation || 'No designation'}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary" className="capitalize">{role}</Badge>
                <Badge variant="outline">{profile?.employee_id}</Badge>
              </div>
            </div>
            
            <Button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              disabled={loading}
              className={isEditing ? 'gradient-bg' : ''}
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="glass-card p-1">
          <TabsTrigger value="personal" className="gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Personal</span>
          </TabsTrigger>
          <TabsTrigger value="job" className="gap-2">
            <Briefcase className="w-4 h-4" />
            <span className="hidden sm:inline">Job Details</span>
          </TabsTrigger>
          <TabsTrigger value="salary" className="gap-2">
            <DollarSign className="w-4 h-4" />
            <span className="hidden sm:inline">Salary</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Documents</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2">
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Activity</span>
          </TabsTrigger>
        </TabsList>

        {/* Personal Info Tab */}
        <TabsContent value="personal">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Personal Information</CardTitle>
              {isEditing && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name || ''}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name || ''}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address || ''}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city || ''}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state || ''}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={formData.country || ''}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Postal Code</Label>
                    <Input
                      id="postal_code"
                      value={formData.postal_code || ''}
                      onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoField 
                    icon={User} 
                    label="Full Name" 
                    value={`${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || null} 
                  />
                  <InfoField icon={Mail} label="Email" value={profile?.email || null} />
                  <InfoField icon={Phone} label="Phone" value={profile?.phone || null} />
                  <InfoField icon={MapPin} label="Address" value={formData.address} />
                  <InfoField icon={MapPin} label="City" value={formData.city} />
                  <InfoField icon={MapPin} label="Country" value={formData.country} />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Job Details Tab */}
        <TabsContent value="job">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <InfoField icon={Briefcase} label="Designation" value={profile?.designation} />
                <InfoField icon={Building} label="Department" value="Engineering" />
                <InfoField icon={User} label="Employee ID" value={profile?.employee_id} />
                <InfoField icon={Calendar} label="Join Date" value="January 15, 2024" />
                <InfoField icon={Briefcase} label="Employment Type" value="Full Time" />
                <InfoField icon={User} label="Reporting Manager" value="John Smith" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Salary Tab */}
        <TabsContent value="salary">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Salary Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-success/10">
                    <p className="text-sm text-muted-foreground">Earnings</p>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Basic Salary</span>
                        <span className="font-medium">$5,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">HRA</span>
                        <span className="font-medium">$1,500</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Allowances</span>
                        <span className="font-medium">$800</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-destructive/10">
                    <p className="text-sm text-muted-foreground">Deductions</p>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">PF</span>
                        <span className="font-medium">$600</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Tax</span>
                        <span className="font-medium">$700</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-lg gradient-bg text-white">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Net Salary</span>
                    <span className="text-2xl font-bold">$6,000</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No documents uploaded yet</p>
                <Button className="mt-4" variant="outline">
                  Upload Document
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'Profile updated', time: '2 hours ago' },
                  { action: 'Logged in', time: '5 hours ago' },
                  { action: 'Leave request submitted', time: '1 day ago' },
                  { action: 'Checked in', time: '1 day ago' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Profile;
