"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Briefcase, MapPin, IndianRupee, Search, Filter, Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import AOS from "aos";
import "aos/dist/aos.css";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  country: string;
  salary: string;
  type: string;
  trade: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  featured: boolean;
  experience: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function JobsPage() {
  const { user } = useAuth();
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrade, setSelectedTrade] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [loading, setLoading] = useState(true);
  const [trades, setTrades] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [isAddJobModalOpen, setIsAddJobModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    country: '',
    salary: '',
    type: '',
    trade: '',
    description: '',
    responsibilities: '',
    requirements: '',
    benefits: '',
    experience: '',
    featured: false
  });

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs');
        const data = await response.json();
        
        if (data.success) {
          setAllJobs(data.jobs);
          setFilteredJobs(data.jobs);
          
          // Extract unique trades and countries
          const uniqueTrades = Array.from(new Set(data.jobs.map((job: Job) => job.trade).filter(Boolean))) as string[];
          const uniqueCountries = Array.from(new Set(data.jobs.map((job: Job) => job.country).filter(Boolean))) as string[];
          
          setTrades(uniqueTrades);
          setCountries(uniqueCountries);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const filterJobs = () => {
      let filtered = allJobs;

      if (searchTerm) {
        filtered = filtered.filter(job =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (selectedTrade) {
        filtered = filtered.filter(job => job.trade === selectedTrade);
      }

      if (selectedCountry) {
        filtered = filtered.filter(job => job.country === selectedCountry);
      }

      setFilteredJobs(filtered);
    };

    filterJobs();
  }, [allJobs, searchTerm, selectedTrade, selectedCountry]);

  const handleAddJob = async () => {
    if (!newJob.title || !newJob.company || !newJob.location || !newJob.country) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const jobData = {
        ...newJob,
        responsibilities: newJob.responsibilities.split('\n').filter(item => item.trim()),
        requirements: newJob.requirements.split('\n').filter(item => item.trim()),
        benefits: newJob.benefits.split('\n').filter(item => item.trim())
      };

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Job created successfully!');
        setIsAddJobModalOpen(false);
        setNewJob({
          title: '',
          company: '',
          location: '',
          country: '',
          salary: '',
          type: '',
          trade: '',
          description: '',
          responsibilities: '',
          requirements: '',
          benefits: '',
          experience: '',
          featured: false
        });
        // Refresh jobs list
        const jobsResponse = await fetch('/api/jobs');
        const jobsData = await jobsResponse.json();
        if (jobsData.success) {
          setAllJobs(jobsData.jobs);
          setFilteredJobs(jobsData.jobs);
        }
      } else {
        toast.error(data.error || 'Failed to create job');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('An error occurred while creating the job');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Job deleted successfully!');
        // Refresh jobs list
        const jobsResponse = await fetch('/api/jobs');
        const jobsData = await jobsResponse.json();
        if (jobsData.success) {
          setAllJobs(jobsData.jobs);
          setFilteredJobs(jobsData.jobs);
        }
      } else {
        toast.error(data.error || 'Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('An error occurred while deleting the job');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Loading Jobs...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-aos="fade-up">
            Current <span className="text-blue-600">Job Openings</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Explore available positions across the Gulf region and find the perfect opportunity for your skills.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-10" data-aos="fade-up" data-aos-delay="200">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for jobs..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="md:w-auto"
                onClick={() => setIsFiltersVisible(!isFiltersVisible)}
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              {isAdmin && (
                <Dialog open={isAddJobModalOpen} onOpenChange={setIsAddJobModalOpen}>
                  <DialogTrigger asChild>
                    <Button className="md:w-auto">
                      <Plus className="mr-2 h-4 w-4" />
                      Add New Job
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Job</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label htmlFor="title">Job Title *</Label>
                        <Input
                          id="title"
                          value={newJob.title}
                          onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                          placeholder="e.g. Senior Software Engineer"
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">Company *</Label>
                        <Input
                          id="company"
                          value={newJob.company}
                          onChange={(e) => setNewJob({...newJob, company: e.target.value})}
                          placeholder="e.g. Tech Corp"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location *</Label>
                        <Input
                          id="location"
                          value={newJob.location}
                          onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                          placeholder="e.g. Dubai"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country">Country *</Label>
                        <Input
                          id="country"
                          value={newJob.country}
                          onChange={(e) => setNewJob({...newJob, country: e.target.value})}
                          placeholder="e.g. UAE"
                        />
                      </div>
                      <div>
                        <Label htmlFor="salary">Salary</Label>
                        <Input
                          id="salary"
                          value={newJob.salary}
                          onChange={(e) => setNewJob({...newJob, salary: e.target.value})}
                          placeholder="e.g. ₹50,000 - ₹80,000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="type">Job Type</Label>
                        <Select value={newJob.type} onValueChange={(value) => setNewJob({...newJob, type: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select job type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Full-time">Full-time</SelectItem>
                            <SelectItem value="Part-time">Part-time</SelectItem>
                            <SelectItem value="Contract">Contract</SelectItem>
                            <SelectItem value="Temporary">Temporary</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="trade">Trade</Label>
                        <Input
                          id="trade"
                          value={newJob.trade}
                          onChange={(e) => setNewJob({...newJob, trade: e.target.value})}
                          placeholder="e.g. Construction, IT, Healthcare"
                        />
                      </div>
                      <div>
                        <Label htmlFor="experience">Experience Required</Label>
                        <Input
                          id="experience"
                          value={newJob.experience}
                          onChange={(e) => setNewJob({...newJob, experience: e.target.value})}
                          placeholder="e.g. 2-5 years"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="description">Job Description</Label>
                        <Textarea
                          id="description"
                          value={newJob.description}
                          onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                          placeholder="Describe the job role and what the candidate will be doing..."
                          rows={4}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="responsibilities">Responsibilities (one per line)</Label>
                        <Textarea
                          id="responsibilities"
                          value={newJob.responsibilities}
                          onChange={(e) => setNewJob({...newJob, responsibilities: e.target.value})}
                          placeholder="Manage team projects\nDevelop software solutions\nConduct code reviews"
                          rows={4}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="requirements">Requirements (one per line)</Label>
                        <Textarea
                          id="requirements"
                          value={newJob.requirements}
                          onChange={(e) => setNewJob({...newJob, requirements: e.target.value})}
                          placeholder="Bachelor's degree in Computer Science\n3+ years experience\nProficiency in React"
                          rows={4}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="benefits">Benefits (one per line)</Label>
                        <Textarea
                          id="benefits"
                          value={newJob.benefits}
                          onChange={(e) => setNewJob({...newJob, benefits: e.target.value})}
                          placeholder="Health insurance\nPaid vacation\nRemote work options"
                          rows={4}
                        />
                      </div>
                      <div className="md:col-span-2 flex items-center space-x-2">
                        <Switch
                          id="featured"
                          checked={newJob.featured}
                          onCheckedChange={(checked) => setNewJob({...newJob, featured: checked})}
                        />
                        <Label htmlFor="featured">Featured Job</Label>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                      <Button variant="outline" onClick={() => setIsAddJobModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddJob} disabled={isSubmitting}>
                        {isSubmitting ? 'Creating...' : 'Create Job'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          {isFiltersVisible && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Trade</label>
                <Select 
                  value={selectedTrade} 
                  onValueChange={setSelectedTrade}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select trade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Trades</SelectItem>
                    {trades.map((trade) => (
                      <SelectItem key={trade} value={trade}>
                        {trade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <Select 
                  value={selectedCountry} 
                  onValueChange={setSelectedCountry}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Countries</SelectItem>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Job Listings */}
        <div className="grid grid-cols-1 gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <Card 
                key={job._id} 
                className={`border hover:shadow-md transition-all duration-300 ${job.featured ? 'border-l-4 border-l-blue-500' : ''}`}
                data-aos="fade-up"
                data-aos-delay={index * 50}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center mb-2">
                        <h2 className="text-2xl font-bold">{job.title}</h2>
                        {job.featured && (
                          <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">{job.company}</p>
                      
                      <div className="flex flex-wrap gap-y-2 gap-x-4 mt-4">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{job.location}, {job.country}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <IndianRupee className="h-4 w-4 mr-1" />
                          <span>{job.salary}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Briefcase className="h-4 w-4 mr-1" />
                          <span>{job.type}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:items-end justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="mb-4 md:mb-0">
                          {job.trade}
                        </Badge>
                        {isAdmin && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteJob(job._id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 mb-4 md:mb-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="flex gap-3 mt-4 md:mt-0">
                        <Link href={`/jobs/${job._id}`}>
                          <Button variant="outline">View Details</Button>
                        </Link>
                        {user?.role !== 'admin' && (
                          <Link href={`/apply?job=${job.title}`}>
                            <Button>Apply Now</Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-xl font-medium mb-2">No jobs found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}