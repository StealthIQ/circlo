import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Users, QrCode, ClipboardList, ChevronLeft, Search, Download, Filter,
  Eye, Trash, Edit, Plus, Check, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { getAllUsers } from '@/services/adminService';
import { generateQrCode } from '@/services/qrCodeService';
import { generateQRCode } from '@/utils/qrCodeGenerator';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [isLoading, setIsLoading] = useState(false);
  
  const [qrType, setQrType] = useState('recycling_bin');
  const [location, setLocation] = useState('');
  const [pointValue, setPointValue] = useState(50);
  const [useWatermark, setUseWatermark] = useState(true);
  const [generatedQRCode, setGeneratedQRCode] = useState<string | null>(null);
  const [qrDataCode, setQrDataCode] = useState<string | null>(null);
  
  const [users, setUsers] = useState<any[]>([]);
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    loadUsers();
  }, []);
  
  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const { users, error } = await getAllUsers();
      if (error) throw error;
      setUsers(users);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQR = async () => {
    if (!user) {
      toast.error('You must be logged in to generate QR codes');
      return;
    }
    
    if (!location.trim()) {
      toast.error('Please enter a location');
      return;
    }
    
    if (pointValue <= 0) {
      toast.error('Points must be greater than zero');
      return;
    }
    
    setIsLoading(true);
    try {
      const { qrCode, error } = await generateQrCode(
        null as any,
        pointValue,
        user.id
      );
      
      if (error) throw error;
      
      if (qrCode) {
        const qrDataUrl = await generateQRCode(qrCode.code, {
          size: 300,
          errorCorrectionLevel: 'medium',
          watermark: useWatermark
        });
        
        setGeneratedQRCode(qrDataUrl);
        setQrDataCode(qrCode.code);
        
        toast.success('QR Code generated successfully!');
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR Code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadQR = () => {
    if (!generatedQRCode) return;
    
    const link = document.createElement('a');
    link.href = generatedQRCode;
    link.download = `circlo-qr-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('QR Code downloaded!');
  };

  const handleExport = () => {
    const csvData = [
      ['Name', 'Email', 'Joined Date', 'Scans', 'Points', 'Redemptions', 'Last Active', 'Streak'],
      ...filteredUsers.map(user => [
        user.name, 
        user.email, 
        new Date(user.created_at).toLocaleDateString(), 
        user.scans || 0,
        user.points || 0,
        user.redemptions || 0,
        user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A',
        user.streak || 0
      ])
    ];
    
    const csvContent = "data:text/csv;charset=utf-8," + 
      csvData.map(row => row.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "circlo-users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('User data exported!');
  };
  
  const isAdmin = profile?.isAdmin || false;
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 rounded-xl shadow-md max-w-md w-full">
          <div className="flex flex-col items-center text-center">
            <AlertCircle className="text-red-500 h-16 w-16 mb-4" />
            <h2 className="text-xl font-bold mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              You don't have permission to access the admin dashboard.
            </p>
            <Button onClick={() => navigate('/home')} className="w-full">
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-primary text-white p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={() => navigate('/home')} className="mr-3">
                <ChevronLeft size={24} />
              </button>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
            </div>
            <div>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => navigate('/profile-settings')}
              >
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="users" className="flex items-center justify-center py-3">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="qr-codes" className="flex items-center justify-center py-3">
              <QrCode className="h-4 w-4 mr-2" />
              QR Codes
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center justify-center py-3">
              <ClipboardList className="h-4 w-4 mr-2" />
              Audit Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">User Management</h2>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download size={16} className="mr-2" />
                  Export CSV
                </Button>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    placeholder="Search users..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="ghost" size="sm" className="ml-2">
                  <Filter size={18} />
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-right">Scans</th>
                      <th className="px-4 py-3 text-right">Points</th>
                      <th className="px-4 py-3 text-center">Streak</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3">{user.name}</td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3 text-right">{user.scans || 0}</td>
                        <td className="px-4 py-3 text-right">{user.points || 0}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-block rounded-full px-2 py-1 text-xs ${user.streak > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {user.streak > 0 ? `${user.streak} days` : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="p-1 text-blue-600 hover:text-blue-800">
                              <Eye size={16} />
                            </button>
                            <button className="p-1 text-green-600 hover:text-green-800">
                              <Edit size={16} />
                            </button>
                            <button className="p-1 text-red-600 hover:text-red-800">
                              <Trash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    {isLoading ? 'Loading users...' : 'No users found matching your search criteria'}
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-4 items-center">
                <div className="text-sm text-gray-500">
                  Showing {filteredUsers.length} of {users.length} users
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled>Previous</Button>
                  <Button variant="outline" size="sm" disabled>Next</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="qr-codes">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-bold mb-4">QR Code Generator</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold text-lg">Generate New QR Code</h3>
                  
                  <div>
                    <label className="text-sm font-medium block mb-1">QR Type</label>
                    <select 
                      className="w-full rounded-md border-gray-300 shadow-sm p-2 border"
                      value={qrType}
                      onChange={(e) => setQrType(e.target.value)}
                    >
                      <option value="recycling_bin">Recycling Bin</option>
                      <option value="event">Event</option>
                      <option value="promotion">Promotion</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-1">Location</label>
                    <Input 
                      placeholder="E.g., Central Park, Mumbai" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-1">Points Value</label>
                    <Input 
                      type="number" 
                      min="1"
                      value={pointValue}
                      onChange={(e) => setPointValue(parseInt(e.target.value, 10))}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-1">Options</label>
                    <div className="flex items-center space-x-2 mt-2">
                      <input 
                        type="checkbox" 
                        id="watermark" 
                        className="rounded" 
                        checked={useWatermark}
                        onChange={(e) => setUseWatermark(e.target.checked)}
                      />
                      <label htmlFor="watermark" className="text-sm">Add Circlo Watermark</label>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      className="w-full" 
                      onClick={handleGenerateQR}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Generating...' : 'Generate QR Code'}
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 flex flex-col items-center justify-center">
                  <div className="bg-gray-100 w-56 h-56 rounded-lg flex items-center justify-center mb-4">
                    {generatedQRCode ? (
                      <img 
                        src={generatedQRCode} 
                        alt="QR Code" 
                        className="w-48 h-48 object-contain"
                      />
                    ) : (
                      <QrCode size={120} className="text-gray-400" />
                    )}
                  </div>
                  
                  {qrDataCode && (
                    <div className="text-center mb-4 text-sm">
                      <p className="font-medium">Code: {qrDataCode}</p>
                      <p className="text-secondary">Points: {pointValue}</p>
                    </div>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-56" 
                    onClick={handleDownloadQR}
                    disabled={!generatedQRCode}
                  >
                    <Download size={16} className="mr-2" />
                    Download PNG
                  </Button>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-semibold text-lg mb-4">Recent QR Codes</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left">ID</th>
                        <th className="px-4 py-3 text-left">Code</th>
                        <th className="px-4 py-3 text-left">Location</th>
                        <th className="px-4 py-3 text-right">Points</th>
                        <th className="px-4 py-3 text-center">Status</th>
                        <th className="px-4 py-3 text-center">Created</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {qrDataCode && (
                        <tr className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3">{qrDataCode.split(':')[2] || 'N/A'}</td>
                          <td className="px-4 py-3">{qrDataCode}</td>
                          <td className="px-4 py-3">{location}</td>
                          <td className="px-4 py-3 text-right">{pointValue}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-block rounded-full px-2 py-1 text-xs bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">Just now</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-2">
                              <button className="p-1 text-blue-600 hover:text-blue-800">
                                <Eye size={16} />
                              </button>
                              <button className="p-1 text-green-600 hover:text-green-800">
                                <Download size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                      <tr className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3">Sample</td>
                        <td className="px-4 py-3">recyclebin:123456:abcdef</td>
                        <td className="px-4 py-3">Juhu Beach, Mumbai</td>
                        <td className="px-4 py-3 text-right">50</td>
                        <td className="px-4 py-3 text-center">
                          <span className="inline-block rounded-full px-2 py-1 text-xs bg-green-100 text-green-800">
                            Active
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">1 hour ago</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="p-1 text-blue-600 hover:text-blue-800">
                              <Eye size={16} />
                            </button>
                            <button className="p-1 text-green-600 hover:text-green-800">
                              <Download size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="logs">
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-bold mb-4">Audit & Activity Logs</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left">Timestamp</th>
                      <th className="px-4 py-3 text-left">Admin</th>
                      <th className="px-4 py-3 text-left">Action</th>
                      <th className="px-4 py-3 text-left">Details</th>
                      <th className="px-4 py-3 text-left">IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {qrDataCode && (
                      <tr className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3">Just now</td>
                        <td className="px-4 py-3">{profile?.email || user?.email || 'admin@circlo.com'}</td>
                        <td className="px-4 py-3">Generated QR Code</td>
                        <td className="px-4 py-3">{qrType} QR for {location}</td>
                        <td className="px-4 py-3">192.168.1.1</td>
                      </tr>
                    )}
                    <tr className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">Today, 14:32</td>
                      <td className="px-4 py-3">admin@circlo.com</td>
                      <td className="px-4 py-3">Generated QR Code</td>
                      <td className="px-4 py-3">Recycling Bin QR for Juhu Beach</td>
                      <td className="px-4 py-3">192.168.1.1</td>
                    </tr>
                    <tr className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">Today, 12:05</td>
                      <td className="px-4 py-3">admin@circlo.com</td>
                      <td className="px-4 py-3">Modified User</td>
                      <td className="px-4 py-3">Updated user profile</td>
                      <td className="px-4 py-3">192.168.1.1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
