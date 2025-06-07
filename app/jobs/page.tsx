"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Briefcase, MapPin, DollarSign, Search, Filter } from "lucide-react";
import Link from "next/link";
import { jobs, trades, countries, filterJobs, Job } from "@/lib/jobs";
import AOS from "aos";
import "aos/dist/aos.css";

export default function JobsPage() {
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(jobs);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrade, setSelectedTrade] = useState("All Trades");
  const [selectedCountry, setSelectedCountry] = useState("All Countries");
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  useEffect(() => {
    const results = filterJobs({
      search: searchTerm,
      trade: selectedTrade,
      country: selectedCountry,
    });
    setFilteredJobs(results);
  }, [searchTerm, selectedTrade, selectedCountry]);

  return (
    <div className="py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-aos="fade-up">
            Current <span className="text-blue-600">Job Openings</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="100">
            Explore available positions across the Gulf region and find the perfect opportunity for your skills.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-10" data-aos="fade-up" data-aos-delay="200">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for jobs..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              className="md:w-auto"
              onClick={() => setIsFiltersVisible(!isFiltersVisible)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          {isFiltersVisible && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Trade</label>
                <Select 
                  value={selectedTrade} 
                  onValueChange={setSelectedTrade}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select trade" />
                  </SelectTrigger>
                  <SelectContent>
                    {trades.map((trade) => (
                      <SelectItem key={trade} value={trade}>
                        {trade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <Select 
                  value={selectedCountry} 
                  onValueChange={setSelectedCountry}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Job Listings */}
        <div className="grid grid-cols-1 gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <Card 
                key={job.id} 
                className={`border hover:shadow-md transition-all duration-300 ${job.featured ? 'border-l-4 border-l-blue-500' : ''}`}
                data-aos="fade-up"
                data-aos-delay={index * 50}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center mb-2">
                        <h2 className="text-2xl font-bold">{job.title}</h2>
                        {job.featured && (
                          <Badge className="ml-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">{job.company}</p>
                      
                      <div className="flex flex-wrap gap-y-2 gap-x-4 mt-4">
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{job.location}, {job.country}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <DollarSign className="h-4 w-4 mr-1" />
                          <span>{job.salary}</span>
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Briefcase className="h-4 w-4 mr-1" />
                          <span>{job.type}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col md:items-end justify-between">
                      <Badge variant="outline" className="mb-4 md:mb-0">
                        {job.trade}
                      </Badge>
                      
                      <div className="flex gap-3 mt-4 md:mt-0">
                        <Link href={`/jobs/${job.id}`}>
                          <Button variant="outline">View Details</Button>
                        </Link>
                        <Link href={`/apply?job=${job.title}`}>
                          <Button>Apply Now</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-xl font-medium mb-2">No jobs found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}