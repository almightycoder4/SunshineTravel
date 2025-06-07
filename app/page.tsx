import Hero from '@/components/home/hero';
import JobTicker from '@/components/home/job-ticker';
import WhyChooseUs from '@/components/home/why-choose-us';
import LatestJobs from '@/components/home/latest-jobs';
import Testimonials from '@/components/home/testimonials';
import CTASection from '@/components/home/cta-section';

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <JobTicker />
      <WhyChooseUs />
      <LatestJobs />
      <Testimonials />
      <CTASection />
    </div>
  );
}