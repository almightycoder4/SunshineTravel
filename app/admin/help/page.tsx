"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  HelpCircle, 
  Search, 
  MessageCircle, 
  Book, 
  Video, 
  Mail, 
  Phone, 
  Clock,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react";
import { useRouter } from "next/navigation";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface SupportTicket {
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
}

export default function HelpPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showContactForm, setShowContactForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [supportTicket, setSupportTicket] = useState<SupportTicket>({
    subject: "",
    message: "",
    priority: "medium"
  });

  const faqs: FAQ[] = [
    {
      id: "1",
      question: "How do I create a new job posting?",
      answer: "To create a new job posting, navigate to the Admin Dashboard and click on 'Add New Job'. Fill in all required fields including job title, description, requirements, and location. Make sure to set the appropriate trade category and salary range.",
      category: "jobs"
    },
    {
      id: "2",
      question: "How can I edit my profile information?",
      answer: "Click on 'My Account' in the navigation bar and select 'My Profile'. You can update your personal information, contact details, and bio. Don't forget to save your changes.",
      category: "profile"
    },
    {
      id: "3",
      question: "How do I change my password?",
      answer: "Go to 'My Account' > 'Change Password'. Enter your current password and your new password twice. Make sure your new password is at least 6 characters long and includes a mix of letters, numbers, and special characters.",
      category: "security"
    },
    {
      id: "4",
      question: "How can I view job applications?",
      answer: "In the Admin Dashboard, click on 'Applications' to view all job applications. You can filter by job title, application date, or status. Click on any application to view detailed information about the candidate.",
      category: "applications"
    },
    {
      id: "5",
      question: "What should I do if I forgot my password?",
      answer: "On the login page, click 'Forgot Password' and enter your email address. You'll receive a password reset link via email. Follow the instructions in the email to create a new password.",
      category: "security"
    },
    {
      id: "6",
      question: "How do I delete a job posting?",
      answer: "In the Admin Dashboard, find the job posting you want to delete and click on the 'Delete' button. Confirm the deletion when prompted. Note that this action cannot be undone.",
      category: "jobs"
    },
    {
      id: "7",
      question: "Can I export job applications data?",
      answer: "Yes, you can export job applications data in CSV or Excel format. Go to the Applications section and click on the 'Export' button. Select your preferred format and date range.",
      category: "applications"
    },
    {
      id: "8",
      question: "How do I monitor my account activity?",
      answer: "Go to 'My Account' > 'Web Activity' to view your recent login history, actions performed, and security events. This helps you monitor your account for any unauthorized access.",
      category: "security"
    }
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "jobs", label: "Job Management" },
    { value: "applications", label: "Applications" },
    { value: "profile", label: "Profile & Settings" },
    { value: "security", label: "Security" }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/admin/help', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: supportTicket.subject,
          message: supportTicket.message,
          priority: supportTicket.priority
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Support ticket submitted successfully! We'll get back to you within 24 hours.");
        setSupportTicket({ subject: "", message: "", priority: "medium" });
        setShowContactForm(false);
      } else {
        toast.error('Failed to submit support ticket: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error submitting support ticket:', error);
      toast.error("Failed to submit support ticket. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/admin');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 mt-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center h-11">
            <HelpCircle className="w-8 h-8 mr-3" />
            Help & Support
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Find answers to common questions or contact our support team
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowContactForm(true)}>
                <CardContent className="p-6 text-center">
                  <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900 dark:text-white">Contact Support</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Get help from our team</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Book className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900 dark:text-white">Documentation</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Browse user guides</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Video className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-medium text-gray-900 dark:text-white">Video Tutorials</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Watch how-to videos</p>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filter */}
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Search through our knowledge base to find quick answers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search FAQs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {categories.map((category) => (
                      <Button
                        key={category.value}
                        variant={selectedCategory === category.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category.value)}
                      >
                        {category.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* FAQ Accordion */}
                <Accordion type="single" collapsible className="w-full">
                  {filteredFAQs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center justify-between w-full mr-4">
                          <span>{faq.question}</span>
                          <Badge variant="secondary" className="ml-2">
                            {categories.find(c => c.value === faq.category)?.label}
                          </Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {faq.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                {filteredFAQs.length === 0 && (
                  <div className="text-center py-8">
                    <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No FAQs Found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Try adjusting your search terms or category filter.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Email Support</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">support@sunshinetravel.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Phone Support</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Business Hours</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Mon-Fri: 9AM-6PM EST</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">API Services</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">File Uploads</span>
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm text-yellow-600">Maintenance</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Info className="w-5 h-5 mr-2" />
                  Quick Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Use specific keywords when searching FAQs</li>
                  <li>• Check your email for password reset links</li>
                  <li>• Clear your browser cache if experiencing issues</li>
                  <li>• Include screenshots when reporting bugs</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Form Modal */}
        {showContactForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>
                  Describe your issue and we'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={supportTicket.subject}
                      onChange={(e) => setSupportTicket(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Brief description of your issue"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <select
                      id="priority"
                      value={supportTicket.priority}
                      onChange={(e) => setSupportTicket(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
                      className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-800"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={supportTicket.message}
                      onChange={(e) => setSupportTicket(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Please provide detailed information about your issue..."
                      rows={6}
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowContactForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? "Submitting..." : "Submit Ticket"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}