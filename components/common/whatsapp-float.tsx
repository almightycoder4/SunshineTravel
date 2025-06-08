"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ContactInfo = {
  name: string;
  number: string;
  link: string;
};

const contacts: ContactInfo[] = [
  {
    name: "Riyaz Khan",
    number: "+91 7007153130",
    link: "https://wa.me/917007153130",
  },
  {
    name: "Prince Vishwakarma",
    number: "+91 8112384070",
    link: "https://wa.me/918112384070",
  },
];

export default function WhatsAppFloat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 w-64 transform transition-all duration-300 ease-in-out">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-gray-800 dark:text-gray-200">Contact Us on WhatsApp</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {contacts.map((contact) => (
              <a
                key={contact.number}
                href={contact.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              >
                <div className="bg-green-500 rounded-full p-1.5 mr-3">
                  <MessageCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">
                    {contact.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {contact.number}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "rounded-full h-16 w-16 shadow-lg",
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
        )}
      >
        {isOpen ? (
          <X className="h-7 w-7 text-white" />
        ) : (
          <MessageCircle className="h-7 w-7 text-white" />
        )}
      </Button>
    </div>
  );
}