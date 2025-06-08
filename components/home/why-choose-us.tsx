"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Award, 
  Clock, 
  Globe2, 
  Headphones, 
  Shield, 
  UserCheck 
} from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

const features = [
  {
    icon: <Globe2 className="h-12 w-12 text-blue-600" />,
    title: "Global Connections",
    description: "Direct partnerships with top employers across all Gulf countries.",
  },
  {
    icon: <UserCheck className="h-12 w-12 text-blue-600" />,
    title: "Verified Opportunities",
    description: "Every job opening is verified and legitimate with proper documentation.",
  },
  {
    icon: <Shield className="h-12 w-12 text-blue-600" />,
    title: "Legal Assistance",
    description: "Complete visa and documentation support for a smooth transition.",
  },
  {
    icon: <Clock className="h-12 w-12 text-blue-600" />,
    title: "Fast Processing",
    description: "Expedited application processing to get you to your new role quickly.",
  },
  {
    icon: <Headphones className="h-12 w-12 text-blue-600" />,
    title: "24/7 Support",
    description: "Continuous assistance before, during, and after your placement.",
  },
  {
    icon: <Award className="h-12 w-12 text-blue-600" />,
    title: "Proven Success",
    description: "Thousands of successful placements with satisfied professionals.",
  },
];

export default function WhyChooseUs() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-aos="fade-up">
            Why Choose <span className="text-blue-600">Sunshine</span>?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            We're committed to finding the perfect match between your skills and the right opportunity in the Gulf.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}