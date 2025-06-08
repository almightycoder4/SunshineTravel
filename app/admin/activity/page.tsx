"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calendar, Clock, Filter, Search, User, Globe, Smartphone, Monitor } from "lucide-react";
import { useRouter } from "next/navigation";

interface ActivityLog {
  _id: string;
  userId: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  status: 'success' | 'failed' | 'warning';
}

export default function WebActivityPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!user) {
      router.push('/admin');
      return;
    }
    fetchActivities();
  }, [user, router, currentPage, statusFilter, actionFilter, searchTerm]);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(actionFilter !== 'all' && { action: actionFilter }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`/api/admin/activity?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setActivities(data.activities);
        setTotalPages(Math.ceil(data.total / itemsPerPage));
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action.toLowerCase()) {
      case 'login':
        return <User className="w-4 h-4" />;
      case 'logout':
        return <User className="w-4 h-4" />;
      case 'create':
        return <Activity className="w-4 h-4" />;
      case 'update':
        return <Activity className="w-4 h-4" />;
      case 'delete':
        return <Activity className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getDeviceIcon = (userAgent: string) => {
    if (userAgent.includes('Mobile')) {
      return <Smartphone className="w-4 h-4" />;
    } else if (userAgent.includes('Tablet')) {
      return <Monitor className="w-4 h-4" />;
    }
    return <Monitor className="w-4 h-4" />;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString()
    };
  };

  // Mock data for demonstration (replace with actual API call)
  const mockActivities: ActivityLog[] = [
    {
      _id: '1',
      userId: user?._id || '',
      action: 'Login',
      resource: 'Admin Panel',
      details: 'Successful admin login',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      timestamp: new Date().toISOString(),
      status: 'success'
    },
    {
      _id: '2',
      userId: user?._id || '',
      action: 'Update',
      resource: 'Job Listing',
      details: 'Updated job posting "Senior Developer"',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'success'
    },
    {
      _id: '3',
      userId: user?._id || '',
      action: 'Create',
      resource: 'Job Listing',
      details: 'Created new job posting "Marketing Manager"',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      status: 'success'
    },
    {
      _id: '4',
      userId: user?._id || '',
      action: 'Delete',
      resource: 'Job Application',
      details: 'Deleted job application #12345',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      status: 'warning'
    },
    {
      _id: '5',
      userId: user?._id || '',
      action: 'Login',
      resource: 'Admin Panel',
      details: 'Failed login attempt',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      status: 'failed'
    }
  ];

  // Use mock data if no real activities
  const displayActivities = activities.length > 0 ? activities : mockActivities;

  if (loading && activities.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading activity logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 mt-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Activity className="w-8 h-8 mr-3" />
            Web Activity
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Monitor your account activity and security events
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                </SelectContent>
              </Select>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="logout">Logout</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={fetchActivities} disabled={loading}>
                {loading ? "Loading..." : "Apply Filters"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Activity List */}
        <div className="space-y-4">
          {displayActivities.map((activity) => {
            const { date, time } = formatTimestamp(activity.timestamp);
            return (
              <Card key={activity._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          {getActionIcon(activity.action)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {activity.action}
                          </h3>
                          <Badge className={getStatusColor(activity.status)}>
                            {activity.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {activity.details}
                        </p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {date}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {time}
                          </div>
                          <div className="flex items-center">
                            <Globe className="w-3 h-3 mr-1" />
                            {activity.ipAddress}
                          </div>
                          <div className="flex items-center">
                            {getDeviceIcon(activity.userAgent)}
                            <span className="ml-1">
                              {activity.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.resource}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {displayActivities.length === 0 && !loading && (
          <Card>
            <CardContent className="text-center py-12">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Activity Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No activity logs match your current filters.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}