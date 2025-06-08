"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import AOS from "aos";
import "aos/dist/aos.css";

const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    role: "Electrician",
    location: "Dubai, UAE",
    image: "https://randomuser.me/api/portraits/men/41.jpg",
    quote: "Sunshine helped me secure a well-paying job in Dubai as an electrician. The process was smooth, and their team guided me through every step of the visa and documentation process.",
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Computer Operator",
    location: "Doha, Qatar",
    image: "https://randomuser.me/api/portraits/women/67.jpg",
    quote: "I'm grateful to Sunshine Travel Consultancy for helping me find a great opportunity in Qatar. Their team was professional and kept me updated throughout the process.",
  },
  {
    id: 3,
    name: "Mohammed Ali",
    role: "Civil Engineer",
    location: "Riyadh, Saudi Arabia",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    quote: "As a civil engineer, I was looking for opportunities abroad. Sunshine not only found me a great position in Saudi Arabia but also ensured all my paperwork was handled professionally.",
  },
  {
    id: 4,
    name: "Ankit Patel",
    role: "Pipe Fitter",
    location: "Abu Dhabi, UAE",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    quote: "The team at Sunshine Travel Consultancy is extremely professional. They helped me get a job in Abu Dhabi with a good salary package. I highly recommend their services.",
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activePage, setActivePage] = useState(0);
  const itemsPerPage = 2;
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);

  const nextPage = () => {
    setActivePage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setActivePage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-in-out",
    });
    
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      nextPage();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {visibleTestimonials.map((testimonial, index) => (
              <Card 
                key={testimonial.id} 
                className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-gray-800"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <CardContent className="p-8">
                  <Quote className="h-10 w-10 text-blue-300 mb-6" />
                  <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={testimonial.image} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-bold">{testimonial.name}</h4>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {testimonial.role} | {testimonial.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Navigation */}
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
        </div>
      </div>
    </section>
  );
}