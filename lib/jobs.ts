// Sample job data - in a real app, this would come from a database
export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  country: string;
  salary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  type: string;
  experience: string;
  featured: boolean;
  date: string;
  trade: string;
}

export const jobs: Job[] = [
  {
    id: 1,
    title: "Shuttering Carpenter",
    company: "Al Futtaim Group",
    location: "Dubai",
    country: "UAE",
    salary: "₹1,20,000 - ₹1,50,000 per month",
    description: "We are looking for experienced Shuttering Carpenters to join our construction team in Dubai. The ideal candidate will have at least 3 years of experience in formwork and shuttering operations.",
    responsibilities: [
      "Prepare and install wooden molds for concrete structures",
      "Read and interpret blueprints and construction plans",
      "Measure, cut, and shape wood, plastic, and other materials",
      "Assemble and secure molds with braces",
      "Dismantle shuttering after concrete has set",
      "Maintain and repair shuttering equipment"
    ],
    requirements: [
      "3+ years of experience as a Shuttering Carpenter",
      "Knowledge of various shuttering systems",
      "Ability to read technical drawings",
      "Good physical fitness and ability to work at heights",
      "Experience in Gulf countries preferred",
      "Valid passport with at least 2 years validity"
    ],
    benefits: [
      "Free accommodation",
      "Transportation to and from work site",
      "Medical insurance",
      "30 days annual leave",
      "Flight tickets provided",
      "Visa sponsorship"
    ],
    type: "Full-time",
    experience: "3+ years",
    featured: true,
    date: "2023-06-15",
    trade: "Carpentry"
  },
  {
    id: 2,
    title: "Pipe Fitter",
    company: "Saudi Aramco",
    location: "Dammam",
    country: "Saudi Arabia",
    salary: "₹1,10,000 - ₹1,40,000 per month",
    description: "Join Saudi Aramco as a Pipe Fitter and work on one of the largest oil production facilities in the world. The successful candidate will be responsible for installing, maintaining, and repairing piping systems.",
    responsibilities: [
      "Install, repair, and maintain high and low pressure piping systems",
      "Read and interpret piping blueprints and isometric drawings",
      "Measure, cut, thread, and bend pipes to required specifications",
      "Align and connect pipes using various joining methods",
      "Test piping systems for leaks and pressure tolerance",
      "Collaborate with other trades to ensure proper installation"
    ],
    requirements: [
      "Minimum 2 years experience as a Pipe Fitter",
      "Ability to read and interpret isometric drawings",
      "Knowledge of different piping materials and joining techniques",
      "Familiarity with hand and power tools related to pipe fitting",
      "Basic math skills for measurement calculations",
      "Valid passport with at least 2 years validity"
    ],
    benefits: [
      "Shared accommodation provided",
      "Transportation to and from work site",
      "Medical insurance",
      "30 days annual leave with return ticket",
      "Overtime opportunities",
      "Contract renewal bonus"
    ],
    type: "Contract",
    experience: "2+ years",
    featured: false,
    date: "2023-07-10",
    trade: "Mechanical"
  },
  {
    id: 3,
    title: "Electrician",
    company: "Qatar Petroleum",
    location: "Doha",
    country: "Qatar",
    salary: "₹1,30,000 - ₹1,60,000 per month",
    description: "Qatar Petroleum is seeking skilled Electricians to join their maintenance team. The role involves installation and maintenance of electrical systems in industrial settings.",
    responsibilities: [
      "Install, maintain, and repair electrical wiring and equipment",
      "Read and interpret electrical schematics and blueprints",
      "Inspect electrical components for hazards and defects",
      "Test electrical systems to ensure proper functioning",
      "Troubleshoot electrical issues and implement solutions",
      "Follow safety regulations and procedures"
    ],
    requirements: [
      "ITI or Diploma in Electrical",
      "Minimum 3 years experience as an industrial electrician",
      "Knowledge of electrical codes and safety regulations",
      "Experience with industrial electrical systems",
      "Ability to use electrical testing equipment",
      "Valid passport with at least 2 years validity"
    ],
    benefits: [
      "Free accommodation",
      "Transportation to and from worksite",
      "Comprehensive medical insurance",
      "30 days annual leave with return ticket",
      "Overtime payment",
      "End of service benefits"
    ],
    type: "Full-time",
    experience: "3+ years",
    featured: true,
    date: "2023-06-25",
    trade: "Electrical"
  },
  {
    id: 4,
    title: "Mason",
    company: "Emaar Properties",
    location: "Dubai",
    country: "UAE",
    salary: "₹1,00,000 - ₹1,30,000 per month",
    description: "Emaar Properties is looking for experienced Masons for their upcoming residential projects in Dubai. The ideal candidate will have experience in bricklaying, block work, and concrete work.",
    responsibilities: [
      "Lay bricks, blocks, and other construction materials",
      "Mix mortar and concrete to required consistency",
      "Read and interpret construction plans",
      "Build walls, partitions, and other structures",
      "Ensure proper alignment using levels and measuring tools",
      "Apply and smooth mortar or other bonding materials"
    ],
    requirements: [
      "Minimum 2 years experience as a Mason",
      "Knowledge of various masonry techniques",
      "Ability to use masonry tools and equipment",
      "Physical strength and stamina",
      "Basic understanding of construction plans",
      "Valid passport with at least 2 years validity"
    ],
    benefits: [
      "Shared accommodation",
      "Transportation to and from worksite",
      "Medical insurance",
      "30 days annual leave",
      "Visa sponsorship",
      "Overtime opportunities"
    ],
    type: "Full-time",
    experience: "2+ years",
    featured: false,
    date: "2023-07-05",
    trade: "Civil"
  },
  {
    id: 5,
    title: "A/C Technician",
    company: "Aldar Properties",
    location: "Abu Dhabi",
    country: "UAE",
    salary: "₹1,20,000 - ₹1,50,000 per month",
    description: "Aldar Properties is seeking experienced A/C Technicians for their maintenance division. The successful candidate will be responsible for the installation, maintenance, and repair of HVAC systems.",
    responsibilities: [
      "Install, maintain, and repair HVAC systems",
      "Diagnose electrical and mechanical issues in A/C units",
      "Perform routine maintenance and cleaning of A/C systems",
      "Replace or repair defective parts",
      "Test HVAC systems for proper operation",
      "Keep records of maintenance and repairs"
    ],
    requirements: [
      "ITI or Diploma in HVAC or related field",
      "Minimum 3 years experience as an A/C Technician",
      "Knowledge of different HVAC systems",
      "Ability to read schematics and blueprints",
      "Experience with refrigerant handling and recovery",
      "Valid passport with at least 2 years validity"
    ],
    benefits: [
      "Shared accommodation",
      "Transportation to and from worksite",
      "Medical insurance",
      "30 days annual leave with return ticket",
      "Visa sponsorship",
      "Performance bonus"
    ],
    type: "Full-time",
    experience: "3+ years",
    featured: true,
    date: "2023-06-20",
    trade: "HVAC"
  },
  {
    id: 6,
    title: "Steel Fixer",
    company: "ALEC Engineering",
    location: "Dubai",
    country: "UAE",
    salary: "₹1,10,000 - ₹1,40,000 per month",
    description: "ALEC Engineering is looking for experienced Steel Fixers to join their construction team. The ideal candidate will have experience in reinforcement steel installation for concrete structures.",
    responsibilities: [
      "Read and interpret construction drawings",
      "Cut, bend, and fix reinforcement steel bars",
      "Assemble and secure steel reinforcement in concrete forms",
      "Ensure proper spacing and alignment of rebar",
      "Tie rebar securely using wire or other fasteners",
      "Verify that completed reinforcement meets specifications"
    ],
    requirements: [
      "Minimum 2 years experience as a Steel Fixer",
      "Ability to read technical drawings",
      "Knowledge of different types of reinforcement steel",
      "Experience with various tying techniques",
      "Physical strength and stamina",
      "Valid passport with at least 2 years validity"
    ],
    benefits: [
      "Shared accommodation",
      "Transportation to and from worksite",
      "Medical insurance",
      "30 days annual leave",
      "Visa sponsorship",
      "Overtime opportunities"
    ],
    type: "Full-time",
    experience: "2+ years",
    featured: false,
    date: "2023-07-15",
    trade: "Civil"
  },
];

export const trades = [
  "All Trades",
  "Civil",
  "Mechanical",
  "Electrical",
  "HVAC",
  "Carpentry",
  "Plumbing",
  "Painting",
  "IT",
  "Administration"
];

export const countries = [
  "All Countries",
  "UAE",
  "Saudi Arabia",
  "Qatar",
  "Kuwait",
  "Bahrain",
  "Oman"
];

export function getJobById(id: number): Job | undefined {
  return jobs.find(job => job.id === id);
}

export function getLatestJobs(limit: number = 4): Job[] {
  return [...jobs]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

export function getFeaturedJobs(limit: number = 4): Job[] {
  return jobs
    .filter(job => job.featured)
    .slice(0, limit);
}

export function filterJobs(filters: {
  search?: string;
  trade?: string;
  country?: string;
}): Job[] {
  return jobs.filter(job => {
    // Search filter
    if (filters.search && !job.title.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Trade filter
    if (filters.trade && filters.trade !== "All Trades" && job.trade !== filters.trade) {
      return false;
    }
    
    // Country filter
    if (filters.country && filters.country !== "All Countries" && job.country !== filters.country) {
      return false;
    }
    
    return true;
  });
}