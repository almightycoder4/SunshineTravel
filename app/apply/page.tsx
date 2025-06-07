"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { trades, countries } from "@/lib/jobs";
import { Briefcase, MapPin, Phone, Mail, User, FileText, Send } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  jobRole: z.string().min(1, { message: "Please select a job role." }),
  country: z.string().min(1, { message: "Please select a country." }),
  experience: z.string().min(1, { message: "Please provide your experience." }),
  message: z.string().optional(),
  resume: z.any().refine((file) => file?.name, { message: "Please upload your resume." }),
});

export default function ApplyPage() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const jobParam = searchParams.get("job");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      jobRole: jobParam || "",
      country: "",
      experience: "",
      message: "",
      resume: undefined,
    },
  });

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  useEffect(() => {
    if (jobParam) {
      form.setValue("jobRole", jobParam);
    }
  }, [jobParam, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    // Simulate API call/form submission
    try {
      // In a real app, this would be an API call to submit the form data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Application Submitted!",
        description: "We'll review your application and get back to you soon.",
        variant: "default",
      });
      
      form.reset();
      setResumeFile(null);
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Your application could not be submitted. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      form.setValue("resume", file);
    }
  };

  return (
    <div className="py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-aos="fade-up">
            Apply for <span className="text-blue-600">Gulf Jobs</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Complete the form below to submit your application. Our team will review your details and contact you soon.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2" data-aos="fade-up" data-aos-delay="200">
            <Card>
              <CardHeader>
                <CardTitle>Job Application Form</CardTitle>
                <CardDescription>
                  Please fill in all required fields to submit your application.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input placeholder="John Doe" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input placeholder="+91 1234567890" className="pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input placeholder="you@example.com" className="pl-10" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="jobRole"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Desired Job Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <div className="relative">
                                  <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                                  <SelectTrigger className="pl-10">
                                    <SelectValue placeholder="Select job role" />
                                  </SelectTrigger>
                                </div>
                              </FormControl>
                              <SelectContent>
                                {[
                                  "Mason", 
                                  "Shuttering Carpenter", 
                                  "Steel Fixer", 
                                  "Plumber", 
                                  "Pipe Fitter", 
                                  "A/C Technician", 
                                  "Electrician", 
                                  "Furniture Carpenter", 
                                  "Spray Painter", 
                                  "Computer Operator",
                                  "Civil Engineer",
                                  "Mechanical Engineer",
                                  "Electrical Engineer",
                                  "Other"
                                ].map((role) => (
                                  <SelectItem key={role} value={role}>
                                    {role}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Country</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <div className="relative">
                                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                                  <SelectTrigger className="pl-10">
                                    <SelectValue placeholder="Select country" />
                                  </SelectTrigger>
                                </div>
                              </FormControl>
                              <SelectContent>
                                {countries.filter(c => c !== "All Countries").map((country) => (
                                  <SelectItem key={country} value={country}>
                                    {country}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        
                        <FormItem>
                          <FormLabel>Years of Experience</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your experience" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {["Less than 1 year", "1-2 years", "2-3 years", "3-5 years", "5+ years"].map((exp) => (
                                <SelectItem key={exp} value={exp}>
                                  {exp}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Message (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your skills and experience..."
                              className="min-h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="resume"
                      render={({ field: { value, onChange, ...field } }) => (
                        <FormItem>
                          <FormLabel>Upload Resume/CV</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                {...field}
                                className="cursor-pointer"
                              />
                              {resumeFile && (
                                <div className="mt-2 flex items-center">
                                  <FileText className="h-4 w-4 mr-2 text-green-600" />
                                  <span className="text-sm text-green-600">
                                    {resumeFile.name}
                                  </span>
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormDescription>
                            Upload your resume in PDF, DOC, or DOCX format (max 5MB).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? (
                        <>Processing...</>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Submit Application
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card data-aos="fade-up" data-aos-delay="300">
                <CardHeader>
                  <CardTitle>Application Guide</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center justify-center bg-blue-100 dark:bg-blue-900 h-8 w-8 rounded-full mr-3">
                        <span className="text-blue-600 dark:text-blue-300 font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Complete the Form</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Fill in all required fields with accurate information.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center justify-center bg-blue-100 dark:bg-blue-900 h-8 w-8 rounded-full mr-3">
                        <span className="text-blue-600 dark:text-blue-300 font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Upload Resume</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Attach your updated CV in PDF or DOC format.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center justify-center bg-blue-100 dark:bg-blue-900 h-8 w-8 rounded-full mr-3">
                        <span className="text-blue-600 dark:text-blue-300 font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Submit Application</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Review and submit your application.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center justify-center bg-blue-100 dark:bg-blue-900 h-8 w-8 rounded-full mr-3">
                        <span className="text-blue-600 dark:text-blue-300 font-bold">4</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Get Response</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">We'll review and contact you for next steps.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card data-aos="fade-up" data-aos-delay="400">
                <CardHeader>
                  <CardTitle>Contact Us</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    For any questions about your application, reach out to us:
                  </p>
                  <div className="space-y-4">
                    <a 
                      href="https://wa.me/917007153130" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-green-600 hover:text-green-700 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                      Riyaz Khan: +91 7007153130
                    </a>
                    <a 
                      href="https://wa.me/918112384070" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center text-green-600 hover:text-green-700 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                      Prince Vishwakarma: +91 8112384070
                    </a>
                    <a 
                      href="mailto:sunshine.travel40@gmail.com"
                      className="flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                      </svg>
                      sunshine.travel40@gmail.com
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}