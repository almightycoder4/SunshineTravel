"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin, IndianRupee } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AOS from "aos";
import "aos/dist/aos.css";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  country: string;
  salary: string;
  type: string;
  trade: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  featured: boolean;
  experience: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function LatestJobs() {
  const [latestJobs, setLatestJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  useEffect(() => {
    const fetchLatestJobs = async () => {
      try {
        // First try to get featured jobs
        let response = await fetch('/api/jobs?featured=true');
        let data = await response.json();
        
        if (data.success && data.jobs.length > 0) {
          // Get the latest 4 featured jobs
          setLatestJobs(data.jobs.slice(0, 4));
        } else {
          // If no featured jobs, get the latest 4 jobs
          response = await fetch('/api/jobs');
          data = await response.json();
          
          if (data.success) {
            setLatestJobs(data.jobs.slice(0, 4));
          }
        }
      } catch (error) {
        console.error('Error fetching latest jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestJobs();
  }, []);

  if (loading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loading...</h2>
          </div>
        </div>
      </section>
    );
  }

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
              key={job._id} 
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
                    <span>{job.location}, {job.country}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <IndianRupee className="h-4 w-4 mr-2" />
                    <span>{job.salary}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  {user?.role !== 'admin' && (
                    <Link href={`/apply?job=${job.title}`}>
                      <Button>Apply Now</Button>
                    </Link>
                  )}
                  <Link href={`/jobs/${job._id}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
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