"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone, Mail, Users, Award, Clock, Globe } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const teamMembers = [
  {
    name: "Riyaz Khan",
    role: "Director",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    contact: "+91 7007153130",
    whatsapp: "https://wa.me/917007153130",
  },
  {
    name: "Prince Vishwakarma",
    role: "Manager",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
    contact: "+91 8112384070",
    whatsapp: "https://wa.me/918112384070",
  },
];

const officeLocations = [
  {
    city: "Delhi",
    address: "Office - 27-B No-5 1st Floor Khizrabad, Near Lions Hospital, New Friends Colony, New Delhi - 110025 India",
    phone: "+91-9628454070",
    email: "sunshinetravel40@gmail.com",
    latitude: 28.5355,
    longitude: 77.2910,
  },
  {
    city: "Mau",
    address: "Sunshine Travel Consultancy, Salahababad Railway Crossing, Belchaura Road City Mau - 275101 (U.P) Mob - 7007153130 (Riyaz Khan)",
    phone: "+91-7007153130",
    email: "sunshinetravel40@gmail.com",
    latitude: 26.7751,
    longitude: 82.1490,
  },
  {
    city: "Ghazipur",
    address: "Sunshine Educational Training Institute, Bhitari Pahas, Jabalabad Mahd, Ghazipur - 275102 (U.P) Mob - 8112384070 (Prince Vishwakarma)",
    phone: "+91-8112384070",
    email: "sunshinetravel40@gmail.com",
    latitude: 25.5788,
    longitude: 83.5615,
  },
];

export default function AboutPage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <div className="py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-aos="fade-up">
            About <span className="text-blue-600">Sunshine Travel</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            We're dedicated to connecting Indian professionals with rewarding career opportunities in Gulf countries.
          </p>
        </div>

        {/* Company Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div data-aos="fade-right">
            <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
              <Image
                src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Team meeting"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
          
          <div className="flex flex-col justify-center" data-aos="fade-left">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Established in 2015, Sunshine Travel Consultancy has been a trusted name in international manpower recruitment, specializing in connecting skilled Indian professionals with opportunities in Gulf countries.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Our extensive network of employers across UAE, Saudi Arabia, Qatar, Kuwait, Bahrain, and Oman allows us to offer a wide range of positions in civil, mechanical, electrical, and administrative sectors.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start">
                <Users className="h-5 w-5 text-blue-600 mr-2 mt-1" />
                <div>
                  <h3 className="font-medium">2,500+</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Placements</p>
                </div>
              </div>
              <div className="flex items-start">
                <Award className="h-5 w-5 text-blue-600 mr-2 mt-1" />
                <div>
                  <h3 className="font-medium">8+</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Years Experience</p>
                </div>
              </div>
              <div className="flex items-start">
                <Globe className="h-5 w-5 text-blue-600 mr-2 mt-1" />
                <div>
                  <h3 className="font-medium">6</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Gulf Countries</p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-blue-600 mr-2 mt-1" />
                <div>
                  <h3 className="font-medium">15-30</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Days Processing</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Mission */}
        <div className="mb-20" data-aos="fade-up">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
              "To empower Indian professionals by connecting them with quality employment opportunities in Gulf countries, ensuring a seamless transition and supporting their career growth abroad."
            </p>
            <div className="flex justify-center">
              <Link href="/jobs">
                <Button size="lg">
                  Explore Opportunities
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Team Members */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12" data-aos="fade-up">
            Meet Our Team
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <Card 
                key={index} 
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden mb-4 md:mb-0 md:mr-6 flex-shrink-0">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={128}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">{member.role}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-blue-600 mr-2" />
                          <span>{member.contact}</span>
                        </div>
                        <div>
                          <a 
                            href={member.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                            </svg>
                            Contact on WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Office Locations */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12" data-aos="fade-up">
            Our Offices
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {officeLocations.map((office, index) => (
              <Card 
                key={index} 
                className="border hover:border-blue-300 transition-all duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">{office.city} Office</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <p className="text-gray-700 dark:text-gray-300">{office.address}</p>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-blue-600 mr-2" />
                      <p className="text-gray-700 dark:text-gray-300">{office.phone}</p>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-blue-600 mr-2" />
                      <p className="text-gray-700 dark:text-gray-300">sunshine.travel40@gmail.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 text-white rounded-lg p-8 text-center" data-aos="fade-up">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Whether you're looking for new opportunities or have questions about our services, we're here to help.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/jobs">
              <Button variant="secondary" size="lg">
                Browse Jobs
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}