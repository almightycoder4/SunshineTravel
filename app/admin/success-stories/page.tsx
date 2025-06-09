"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Upload, Star, User, MapPin, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface SuccessStory {
  _id: string;
  customerName: string;
  customerImage: string;
  jobTitle: string;
  company: string;
  location: string;
  testimonial: string;
  rating: number;
  createdAt: string;
}

export default function SuccessStoriesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [formData, setFormData] = useState({
    customerName: "",
    customerImage: "",
    jobTitle: "",
    company: "",
    location: "",
    testimonial: "",
    rating: 5
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (!user) {
      router.push('/admin');
      return;
    }
    if (user.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchSuccessStories();
  }, [user, router]);

  const fetchSuccessStories = async () => {
    try {
      const response = await fetch('/api/admin/success-stories');
      const data = await response.json();
      
      if (data.success) {
        setStories(data.stories);
      } else {
        toast.error("Failed to load success stories");
      }
    } catch (error) {
      console.error('Error fetching success stories:', error);
      toast.error("Error loading success stories");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('customerName', formData.customerName);
      formDataToSend.append('jobTitle', formData.jobTitle);
      formDataToSend.append('company', formData.company);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('testimonial', formData.testimonial);
      formDataToSend.append('rating', formData.rating.toString());
      
      if (imageFile) {
        formDataToSend.append('customerImage', imageFile);
      }

      const response = await fetch('/api/admin/success-stories', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Success story added successfully");
        setFormData({
          customerName: "",
          customerImage: "",
          jobTitle: "",
          company: "",
          location: "",
          testimonial: "",
          rating: 5
        });
        setImageFile(null);
        setImagePreview("");
        fetchSuccessStories();
      } else {
        toast.error(data.error || "Failed to add success story");
      }
    } catch (error) {
      console.error('Error adding success story:', error);
      toast.error("Error adding success story");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading success stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 mt-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Success Stories</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Add and manage customer success stories and testimonials.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add New Success Story Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Add New Success Story</CardTitle>
                <CardDescription>
                  Share a customer's success story with their testimonial
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="customerName">Customer Name</Label>
                    <Input
                      id="customerName"
                      name="customerName"
                      type="text"
                      value={formData.customerName}
                      onChange={handleInputChange}
                      placeholder="Enter customer's full name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customerImage">Customer Image</Label>
                    <Input
                      id="customerImage"
                      name="customerImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      required
                    />
                    {imagePreview && (
                      <div className="mt-2">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          width={100}
                          height={100}
                          className="rounded-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input
                        id="jobTitle"
                        name="jobTitle"
                        type="text"
                        value={formData.jobTitle}
                        onChange={handleInputChange}
                        placeholder="e.g. Electrician"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="e.g. Saudi Aramco"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        type="text"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g. Dubai, UAE"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rating">Rating</Label>
                      <Input
                        id="rating"
                        name="rating"
                        type="number"
                        min="1"
                        max="5"
                        value={formData.rating}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="testimonial">Testimonial</Label>
                    <Textarea
                      id="testimonial"
                      name="testimonial"
                      value={formData.testimonial}
                      onChange={handleInputChange}
                      placeholder="Enter the customer's testimonial..."
                      rows={4}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full"
                  >
                    {submitting ? "Adding..." : "Add Success Story"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Existing Success Stories */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Existing Success Stories ({stories.length})</CardTitle>
                <CardDescription>
                  Manage your published success stories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {stories.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      No success stories added yet.
                    </p>
                  ) : (
                    stories.map((story) => (
                      <div key={story._id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-start space-x-3">
                          <Image
                            src={story.customerImage}
                            alt={story.customerName}
                            width={50}
                            height={50}
                            className="rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {story.customerName}
                            </h4>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                              <Briefcase className="h-4 w-4" />
                              <span>{story.jobTitle} at {story.company}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                              <MapPin className="h-4 w-4" />
                              <span>{story.location}</span>
                            </div>
                            <div className="flex items-center space-x-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < story.rating
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                          "{story.testimonial}"
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Added on {new Date(story.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}