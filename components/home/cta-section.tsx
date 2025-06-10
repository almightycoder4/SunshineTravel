"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PhoneCall, Mail } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function CTASection() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background with pattern overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/3183186/pexels-photo-3183186.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
        }}
      />
      <div className="absolute inset-0 bg-blue-900 bg-opacity-85" />

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            data-aos="fade-up"
          >
            Ready to Start Your Gulf Career Journey?
          </h2>
          
          <p 
            className="text-xl text-blue-100 mb-10"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            Take the first step towards your dream job in the Gulf. Our team is ready to guide you through the entire process.
          </p>
          
          <div 
            className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <Link href="/jobs">
              <Button size="lg" className="bg-white text-blue-800 hover:bg-blue-50 px-6 py-6 text-lg">
                Browse Job Opportunities
              </Button>
            </Link>
            <Link href="/apply">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 px-6 py-6 text-lg">
                Apply Now
              </Button>
            </Link>
          </div>
          
          <div 
            className="flex flex-col md:flex-row justify-center gap-8"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <a 
              href="tel:+917007153130"
              className="flex items-center justify-center text-white hover:text-yellow-300 transition-colors"
            >
              <PhoneCall className="mr-2 h-5 w-5" />
              <span>+91 7007153130</span>
            </a>
            <a 
              href="tel:+918112384070"
              className="flex items-center justify-center text-white hover:text-yellow-300 transition-colors"
            >
              <PhoneCall className="mr-2 h-5 w-5" />
              <span>+91 8112384070</span>
            </a>
            <a 
              href="mailto:sunshine.travel40@gmail.com"
              className="flex items-center justify-center text-white hover:text-yellow-300 transition-colors"
            >
              <Mail className="mr-2 h-5 w-5" />
              <span>sunshinetravel40@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}