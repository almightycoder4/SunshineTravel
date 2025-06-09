"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import AOS from "aos";
import "aos/dist/aos.css";

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

export default function Testimonials() {
  const [activePage, setActivePage] = useState(0);
  const [testimonials, setTestimonials] = useState<SuccessStory[]>([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 2;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const nextPage = () => {
    setActivePage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setActivePage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const fetchSuccessStories = async () => {
    try {
      const response = await fetch('/api/success-stories');
      if (response.ok) {
        const result = await response.json();
        setTestimonials(result.data || []);
      } else {
        console.error('Failed to fetch success stories');
      }
    } catch (error) {
      console.error('Error fetching success stories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-in-out",
    });
    
    fetchSuccessStories();
  }, []);

  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(() => {
        setActivePage((prev) => (prev + 1) % Math.ceil(testimonials.length / itemsPerPage));
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [testimonials.length, itemsPerPage]);

  const visibleTestimonials = testimonials.slice(
    activePage * itemsPerPage,
    (activePage + 1) * itemsPerPage
  );

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-aos="fade-up">
            Success <span className="text-blue-600">Stories</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Hear from professionals who found their dream jobs through Sunshine Travel Consultancy.
          </p>
        </div>

        <div className="relative">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Loading success stories...</p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">No success stories available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {visibleTestimonials.map((testimonial, index) => (
                <Card 
                  key={testimonial._id} 
                  className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <CardContent className="p-8">
                    <Quote className="h-10 w-10 text-blue-300 mb-6" />
                    <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                      "{testimonial.testimonial}"
                    </p>
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12 mr-4">
                        <AvatarImage src={testimonial.customerImage} alt={testimonial.customerName} />
                        <AvatarFallback>{testimonial.customerName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-bold">{testimonial.customerName}</h4>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {testimonial.jobTitle} | {testimonial.location}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Navigation */}
          {!loading && testimonials.length > 0 && totalPages > 1 && (
            <div className="flex justify-center mt-10 space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevPage}
                className="h-10 w-10 rounded-full"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePage(i)}
                    className={`h-3 w-3 rounded-full ${
                      activePage === i
                        ? "bg-blue-600"
                        : "bg-gray-300 dark:bg-gray-700"
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={nextPage}
                className="h-10 w-10 rounded-full"
              >
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}