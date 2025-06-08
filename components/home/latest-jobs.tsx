"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, DollarSign } from "lucide-react";
import AOS from "aos";
import "aos/dist/aos.css";

// Sample job data
const latestJobs = [
  {
    id: 1,
    title: "Shuttering Carpenter",
    company: "Al Futtaim Group",
    location: "Dubai, UAE",
    salary: "$1200 - $1500 per month",
    type: "Full-time",
    featured: true,
  },
  {
    id: 2,
    title: "Pipe Fitter",
    company: "Saudi Aramco",
    location: "Dammam, Saudi Arabia",
    salary: "$1100 - $1400 per month",
    type: "Contract",
    featured: false,
  },
  {
    id: 3,
    title: "Electrician",
    company: "Qatar Petroleum",
    location: "Doha, Qatar",
    salary: "$1300 - $1600 per month",
    type: "Full-time",
    featured: true,
  },
  {
    id: 4,
    title: "Mason",
    company: "Emaar Properties",
    location: "Dubai, UAE",
    salary: "$1000 - $1300 per month",
    type: "Full-time",
    featured: false,
  },
];

export default function LatestJobs() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-aos="fade-up">
            Latest <span className="text-blue-600">Job Openings</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Explore our most recent opportunities for skilled professionals in the Gulf region.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {latestJobs.map((job, index) => (
            <Card 
              key={job.id} 
              className={`border hover:border-blue-300 transition-all duration-300 ${job.featured ? 'border-blue-500 dark:border-blue-400' : ''}`}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-bold">{job.title}</h3>
                      {job.featured && (
                        <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{job.company}</p>
                  </div>
                  <Badge variant="outline" className="text-gray-700 dark:text-gray-300">
                    {job.type}
                  </Badge>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <span>{job.salary}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Link href={`/apply?job=${job.title}`}>
                    <Button>Apply Now</Button>
                  </Link>
                  <Link href={`/jobs/${job.id}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                    View Details →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/jobs">
            <Button variant="outline" size="lg" className="inline-flex items-center">
              <Briefcase className="mr-2 h-5 w-5" />
              View All Job Openings
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}