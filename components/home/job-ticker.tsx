"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const jobTitles = [
  "Mason", "Shuttering Carpenter", "Steel Fixer", "Plumber", 
  "Pipe Fitter", "A/C Technician", "Electrician", "Furniture Carpenter", 
  "Spray Painter", "Computer Operator", "Civil Engineer", "Mechanical Engineer",
  "Electrical Engineer", "Project Manager", "Site Supervisor", "Safety Officer"
];

export default function JobTicker() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollerRef.current) return;
    
    const scrollerContent = scrollerRef.current;
    const scrollerInner = scrollerContent.querySelector("div");
    
    if (!scrollerInner) return;
    
    scrollerContent.setAttribute("data-animated", "true");
    
    // Make a copy of the content for seamless scrolling
    const scrollerInnerContent = Array.from(scrollerInner.children);
    scrollerInnerContent.forEach(item => {
      const duplicatedItem = item.cloneNode(true);
      scrollerInner.appendChild(duplicatedItem);
    });
  }, []);

  return (
    <div className="relative bg-blue-600 text-white py-3 overflow-hidden">
      <div 
        ref={scrollerRef}
        className="scroller relative max-w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent,_black_20%,_black_80%,_transparent)]"
      >
        <div className="scroller__inner flex min-w-full shrink-0 gap-4 py-1 animate-scroll">
          {jobTitles.map((job, index) => (
            <div 
              key={index}
              className="flex items-center shrink-0 rounded-lg border border-blue-400 bg-blue-500 px-4 py-2"
            >
              <span className="text-sm font-medium">{job}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-50%));
          }
        }

        .animate-scroll {
          animation: scroll 25s linear infinite;
        }
      `}</style>
    </div>
  );
}