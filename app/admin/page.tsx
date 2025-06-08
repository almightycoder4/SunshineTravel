"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { trades, countries } from "@/lib/jobs";
import { Plus, Pencil, Trash2, Search, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { IJob } from "@/models/Job";

// Form schema for job validation
const jobFormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  company: z.string().min(2, { message: "Company name is required." }),
  location: z.string().min(2, { message: "Location is required." }),
  country: z.string().min(2, { message: "Country is required." }),
  salary: z.string().min(2, { message: "Salary information is required." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  responsibilities: z.array(z.string()).min(1, { message: "At least one responsibility is required." }),
  requirements: z.array(z.string()).min(1, { message: "At least one requirement is required." }),
  benefits: z.array(z.string()).min(1, { message: "At least one benefit is required." }),
  type: z.string().min(2, { message: "Job type is required." }),
  experience: z.string().min(2, { message: "Experience level is required." }),
  featured: z.boolean().default(false),
  date: z.string(),
  trade: z.string().min(2, { message: "Trade category is required." }),
});

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  
  const [jobList, setJobList] = useState<IJob[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<IJob | null>(null);
  const [responsibilityInput, setResponsibilityInput] = useState("");
  const [requirementInput, setRequirementInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm<z.infer<typeof jobFormSchema>>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      country: "",
      salary: "",
      description: "",
      responsibilities: [],
      requirements: [],
      benefits: [],
      type: "",
      experience: "",
      featured: false,
      date: new Date().toISOString().split("T")[0],
      trade: "",
    },
  });

  // Check if user is authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/admin/login");
    }
  }, [user, authLoading, router]);

  // Fetch jobs from API
  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/jobs');
      const data = await res.json();
      
      if (data.success) {
        setJobList(data.jobs);
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch jobs",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      toast({
        title: "Error",
        description: "Failed to fetch jobs",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch jobs on component mount
  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]);

  // Filter jobs based on search term
  useEffect(() => {
    if (searchTerm && !isLoading) {
      const filtered = jobList.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setJobList(filtered);
    } else if (!searchTerm && !isLoading) {
      fetchJobs();
    }
  }, [searchTerm]);

  // Handle form submission for adding/updating a job
  const onSubmit = async (values: z.infer<typeof jobFormSchema>) => {
    try {
      setIsSubmitting(true);
      
      if (selectedJob) {
        // Update existing job
        const res = await fetch(`/api/jobs/${selectedJob._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        
        const data = await res.json();
        
        if (data.success) {
          toast({
            title: "Success",
            description: `${values.title} has been updated successfully.`,
          });
          fetchJobs();
        } else {
          toast({
            title: "Error",
            description: data.error || "Failed to update job",
            variant: "destructive",
          });
        }
      } else {
        // Add new job
        const res = await fetch('/api/jobs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        
        const data = await res.json();
        
        if (data.success) {
          toast({
            title: "Success",
            description: `${values.title} has been added successfully.`,
          });
          fetchJobs();
        } else {
          toast({
            title: "Error",
            description: data.error || "Failed to add job",
            variant: "destructive",
          });
        }
      }

      // Reset form and close dialog
      form.reset();
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      setSelectedJob(null);
    } catch (error) {
      console.error("Error submitting job:", error);
      toast({
        title: "Error",
        description: "An error occurred while saving the job",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle job deletion
  const handleDeleteJob = async () => {
    if (selectedJob) {
      try {
        setIsSubmitting(true);
        const res = await fetch(`/api/jobs/${selectedJob._id}`, {
          method: 'DELETE',
        });
        
        const data = await res.json();
        
        if (data.success) {
          toast({
            title: "Success",
            description: `${selectedJob.title} has been deleted successfully.`,
          });
          fetchJobs();
        } else {
          toast({
            title: "Error",
            description: data.error || "Failed to delete job",
            variant: "destructive",
          });
        }
        
        setIsDeleteDialogOpen(false);
        setSelectedJob(null);
      } catch (error) {
        console.error("Error deleting job:", error);
        toast({
          title: "Error",
          description: "An error occurred while deleting the job",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Handle edit job button click
  const handleEditJob = (job: IJob) => {
    setSelectedJob(job);
    form.reset({
      title: job.title,
      company: job.company,
      location: job.location,
      country: job.country,
      salary: job.salary,
      description: job.description,
      responsibilities: job.responsibilities,
      requirements: job.requirements,
      benefits: job.benefits,
      type: job.type,
      experience: job.experience,
      featured: job.featured,
      date: job.date,
      trade: job.trade,
    });
    setIsEditDialogOpen(true);
  };

  // Handle delete job button click
  const handleDeleteJobClick = (job: IJob) => {
    setSelectedJob(job);
    setIsDeleteDialogOpen(true);
  };

  // Add a new responsibility
  const addResponsibility = () => {
    if (responsibilityInput.trim()) {
      const currentResponsibilities = form.getValues("responsibilities") || [];
      form.setValue("responsibilities", [...currentResponsibilities, responsibilityInput.trim()]);
      setResponsibilityInput("");
    }
  };

  // Remove a responsibility
  const removeResponsibility = (index: number) => {
    const currentResponsibilities = form.getValues("responsibilities") || [];
    form.setValue(
      "responsibilities",
      currentResponsibilities.filter((_, i) => i !== index)
    );
  };

  // Add a new requirement
  const addRequirement = () => {
    if (requirementInput.trim()) {
      const currentRequirements = form.getValues("requirements") || [];
      form.setValue("requirements", [...currentRequirements, requirementInput.trim()]);
      setRequirementInput("");
    }
  };

  // Remove a requirement
  const removeRequirement = (index: number) => {
    const currentRequirements = form.getValues("requirements") || [];
    form.setValue(
      "requirements",
      currentRequirements.filter((_, i) => i !== index)
    );
  };

  // Add a new benefit
  const addBenefit = () => {
    if (benefitInput.trim()) {
      const currentBenefits = form.getValues("benefits") || [];
      form.setValue("benefits", [...currentBenefits, benefitInput.trim()]);
      setBenefitInput("");
    }
  };

  // Remove a benefit
  const removeBenefit = (index: number) => {
    const currentBenefits = form.getValues("benefits") || [];
    form.setValue(
      "benefits",
      currentBenefits.filter((_, i) => i !== index)
    );
  };

  // If still checking authentication or user is not authenticated, show loading
  if (authLoading) {
    return (
      <div className="py-32 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  // If user is not admin, show access denied
  if (user && user.role !== 'admin') {
    return (
      <div className="py-32 container mx-auto px-4 text-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="mb-6">You do not have permission to access this page.</p>
        <Button onClick={() => router.push('/')}>Return to Home</Button>
      </div>
    );
  }

  return (
    <div className="py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Job Listings Management</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Job
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Job Listing</DialogTitle>
                <DialogDescription>
                  Fill in the details for the new job listing. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <JobForm 
                form={form} 
                onSubmit={onSubmit} 
                responsibilityInput={responsibilityInput}
                setResponsibilityInput={setResponsibilityInput}
                addResponsibility={addResponsibility}
                removeResponsibility={removeResponsibility}
                requirementInput={requirementInput}
                setRequirementInput={setRequirementInput}
                addRequirement={addRequirement}
                removeRequirement={removeRequirement}
                benefitInput={benefitInput}
                setBenefitInput={setBenefitInput}
                addBenefit={addBenefit}
                removeBenefit={removeBenefit}
                isSubmitting={isSubmitting}
              />
            </DialogContent>
          </Dialog>
        </div> */}

        <div className="mb-6 flex items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading jobs...</span>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableCaption>A list of all job listings</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Trade</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      No jobs found. Add your first job listing!
                    </TableCell>
                  </TableRow>
                ) : (
                  jobList.map((job) => (
                    <TableRow key={job._id}>
                      <TableCell className="font-medium">{job.title}</TableCell>
                      <TableCell>{job.company}</TableCell>
                      <TableCell>{job.location}, {job.country}</TableCell>
                      <TableCell>{job.trade}</TableCell>
                      <TableCell>{new Date(job.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {job.featured ? (
                          <Badge variant="default">Featured</Badge>
                        ) : (
                          <Badge variant="outline">No</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditJob(job)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteJobClick(job)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Edit Job Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Job Listing</DialogTitle>
              <DialogDescription>
                Update the details for this job listing. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <JobForm 
              form={form} 
              onSubmit={onSubmit} 
              responsibilityInput={responsibilityInput}
              setResponsibilityInput={setResponsibilityInput}
              addResponsibility={addResponsibility}
              removeResponsibility={removeResponsibility}
              requirementInput={requirementInput}
              setRequirementInput={setRequirementInput}
              addRequirement={addRequirement}
              removeRequirement={removeRequirement}
              benefitInput={benefitInput}
              setBenefitInput={setBenefitInput}
              addBenefit={addBenefit}
              removeBenefit={removeBenefit}
              isEditing
              isSubmitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete the job listing "{selectedJob?.title}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteJob} 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// Job Form Component
interface JobFormProps {
  form: any;
  onSubmit: (values: z.infer<typeof jobFormSchema>) => void;
  responsibilityInput: string;
  setResponsibilityInput: (value: string) => void;
  addResponsibility: () => void;
  removeResponsibility: (index: number) => void;
  requirementInput: string;
  setRequirementInput: (value: string) => void;
  addRequirement: () => void;
  removeRequirement: (index: number) => void;
  benefitInput: string;
  setBenefitInput: (value: string) => void;
  addBenefit: () => void;
  removeBenefit: (index: number) => void;
  isEditing?: boolean;
  isSubmitting?: boolean;
}

function JobForm({
  form,
  onSubmit,
  responsibilityInput,
  setResponsibilityInput,
  addResponsibility,
  removeResponsibility,
  requirementInput,
  setRequirementInput,
  addRequirement,
  removeRequirement,
  benefitInput,
  setBenefitInput,
  addBenefit,
  removeBenefit,
  isEditing = false,
  isSubmitting = false,
}: JobFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Title</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Shuttering Carpenter" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Al Futtaim Group" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Dubai" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.filter(c => c !== "All Countries").map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salary</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. $1200 - $1500 per month" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="trade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trade</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a trade" />
                    </SelectTrigger>
                    <SelectContent>
                      {trades.filter(t => t !== "All Trades").map((trade) => (
                        <SelectItem key={trade} value={trade}>
                          {trade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Experience Required</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 3+ years" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Featured Job</FormLabel>
                  <FormDescription>
                    Featured jobs appear at the top of listings and on the homepage.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Posting Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter a detailed job description"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Responsibilities */}
        <FormField
          control={form.control}
          name="responsibilities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsibilities</FormLabel>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a responsibility"
                    value={responsibilityInput}
                    onChange={(e) => setResponsibilityInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addResponsibility();
                      }
                    }}
                  />
                  <Button type="button" onClick={addResponsibility}>
                    Add
                  </Button>
                </div>
                <ul className="space-y-1">
                  {field.value?.map((item: string, index: number) => (
                    <li key={index} className="flex items-center justify-between rounded-md border p-2">
                      <span>{item}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeResponsibility(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Requirements */}
        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requirements</FormLabel>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a requirement"
                    value={requirementInput}
                    onChange={(e) => setRequirementInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addRequirement();
                      }
                    }}
                  />
                  <Button type="button" onClick={addRequirement}>
                    Add
                  </Button>
                </div>
                <ul className="space-y-1">
                  {field.value?.map((item: string, index: number) => (
                    <li key={index} className="flex items-center justify-between rounded-md border p-2">
                      <span>{item}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRequirement(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Benefits */}
        <FormField
          control={form.control}
          name="benefits"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Benefits</FormLabel>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add a benefit"
                    value={benefitInput}
                    onChange={(e) => setBenefitInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addBenefit();
                      }
                    }}
                  />
                  <Button type="button" onClick={addBenefit}>
                    Add
                  </Button>
                </div>
                <ul className="space-y-1">
                  {field.value?.map((item: string, index: number) => (
                    <li key={index} className="flex items-center justify-between rounded-md border p-2">
                      <span>{item}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBenefit(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Updating..." : "Adding..."}
              </>
            ) : (
              isEditing ? "Update Job" : "Add Job"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}