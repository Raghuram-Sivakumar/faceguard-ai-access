import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Shield, 
  Users, 
  AlertTriangle, 
  Activity, 
  CheckCircle, 
  XCircle,
  Clock,
  Settings,
  LogOut,
  Calendar
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// Mock data
const mockAccessLogs = [
  { id: 1, user: "John Doe", timestamp: "2024-01-15 09:30:15", status: "granted", method: "Face Recognition" },
  { id: 2, user: "Jane Smith", timestamp: "2024-01-15 09:28:42", status: "denied", method: "Face Recognition" },
  { id: 3, user: "Mike Johnson", timestamp: "2024-01-15 09:25:18", status: "granted", method: "Face Recognition" },
  { id: 4, user: "Sarah Wilson", timestamp: "2024-01-15 09:22:55", status: "granted", method: "Face Recognition" },
  { id: 5, user: "Unknown User", timestamp: "2024-01-15 09:20:12", status: "denied", method: "Face Recognition" },
];

const mockAlerts = [
  { id: 1, type: "security", message: "Multiple failed access attempts detected", timestamp: "2024-01-15 09:28:42", severity: "high" },
  { id: 2, type: "system", message: "Camera maintenance required", timestamp: "2024-01-15 08:15:30", severity: "medium" },
  { id: 3, type: "access", message: "New user registration pending approval", timestamp: "2024-01-15 07:45:18", severity: "low" },
  { id: 4, type: "security", message: "Unauthorized access attempt blocked", timestamp: "2024-01-14 18:22:45", severity: "high" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const handleLogout = () => {
    navigate('/');
  };

  const handleProfileSettings = () => {
    navigate('/admin-profile');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    return status === 'granted' ? (
      <CheckCircle className="w-4 h-4 text-success" />
    ) : (
      <XCircle className="w-4 h-4 text-destructive" />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleProfileSettings}
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Profile
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="access-logs">Access Logs</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Access Attempts</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Successful Access</CardTitle>
                  <CheckCircle className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,089</div>
                  <p className="text-xs text-muted-foreground">88.2% success rate</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">45</div>
                  <p className="text-xs text-muted-foreground">+3 new this week</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-warning" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7</div>
                  <p className="text-xs text-muted-foreground">2 high priority</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Access Attempts</CardTitle>
                  <CardDescription>Last 5 access attempts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAccessLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(log.status)}
                          <div>
                            <p className="font-medium">{log.user}</p>
                            <p className="text-sm text-muted-foreground">{log.timestamp}</p>
                          </div>
                        </div>
                        <Badge variant={log.status === 'granted' ? 'default' : 'destructive'}>
                          {log.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Alerts</CardTitle>
                  <CardDescription>Latest system alerts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAlerts.slice(0, 4).map((alert) => (
                      <div key={alert.id} className="flex items-start gap-3">
                        <AlertTriangle className="w-4 h-4 text-warning mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{alert.message}</p>
                            <Badge variant={getSeverityColor(alert.severity) as any}>
                              {alert.severity}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{alert.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="access-logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Access Logs
                </CardTitle>
                <CardDescription>Complete history of access attempts</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockAccessLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.user}</TableCell>
                        <TableCell className="text-muted-foreground">{log.timestamp}</TableCell>
                        <TableCell>{log.method}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(log.status)}
                            <Badge variant={log.status === 'granted' ? 'default' : 'destructive'}>
                              {log.status}
                            </Badge>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  System Alerts
                </CardTitle>
                <CardDescription>All system alerts and notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-warning mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium">{alert.message}</p>
                          <Badge variant={getSeverityColor(alert.severity) as any}>
                            {alert.severity}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {alert.timestamp}
                          </span>
                          <span className="capitalize">{alert.type} Alert</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;