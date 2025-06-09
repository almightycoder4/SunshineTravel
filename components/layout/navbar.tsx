"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Sun, Moon, User, ChevronDown, UserCircle, Lock, Activity, HelpCircle, LogOut, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "Current Openings" },
  { href: "/apply", label: "Apply Now" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileAccountOpen, setIsMobileAccountOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const handleMenuItemClick = (path: string) => {
    router.push(path);
    setIsDropdownOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white dark:bg-gray-900 shadow-md" : "bg-transparent"}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              Sunshine Travel
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 items-center">
            {navLinks
              .filter(link => !(user && user.role === 'admin' && link.href === '/apply'))
              .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}
            
            {user && user.role === 'admin' ? (
              <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors flex items-center"
                  >
                    <User className="mr-1 h-4 w-4" />
                    My Account
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleMenuItemClick('/admin/profile')}>
                    <UserCircle className="mr-2 h-4 w-4" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleMenuItemClick('/admin/change-password')}>
                    <Lock className="mr-2 h-4 w-4" />
                    Change Password
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleMenuItemClick('/admin/activity')}>
                    <Activity className="mr-2 h-4 w-4" />
                    Web Activity
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleMenuItemClick('/admin/help')}>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleMenuItemClick('/admin/success-stories')}>
                  <Star className="mr-2 h-4 w-4" />
                  Success Stories
                </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/admin"
                className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors flex items-center"
              >
                <User className="mr-1 h-4 w-4" />
                Admin
              </Link>
            )}
          </nav>

          {/* Theme Toggle and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMenu}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {navLinks
                .filter(link => !(user && user.role === 'admin' && link.href === '/apply'))
                .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              {user && user.role === 'admin' ? (
                <div className="px-3 py-2">
                  <button
                    onClick={() => setIsMobileAccountOpen(!isMobileAccountOpen)}
                    className="w-full text-left text-gray-700 dark:text-gray-300 font-medium mb-2 flex items-center justify-between hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <div className="flex items-center">
                      <User className="mr-1 h-4 w-4" />
                      My Account
                    </div>
                    <ChevronDown className={`h-4 w-4 transition-transform ${isMobileAccountOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isMobileAccountOpen && (
                    <div className="ml-4 space-y-1">
                      <button
                        onClick={() => {
                          handleMenuItemClick('/admin/profile');
                          setIsOpen(false);
                          setIsMobileAccountOpen(false);
                        }}
                        className="block w-full text-left px-2 py-1 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors flex items-center"
                      >
                        <UserCircle className="mr-2 h-4 w-4" />
                        My Profile
                      </button>
                      <button
                        onClick={() => {
                          handleMenuItemClick('/admin/change-password');
                          setIsOpen(false);
                          setIsMobileAccountOpen(false);
                        }}
                        className="block w-full text-left px-2 py-1 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors flex items-center"
                      >
                        <Lock className="mr-2 h-4 w-4" />
                        Change Password
                      </button>
                      <button
                        onClick={() => {
                          handleMenuItemClick('/admin/activity');
                          setIsOpen(false);
                          setIsMobileAccountOpen(false);
                        }}
                        className="block w-full text-left px-2 py-1 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors flex items-center"
                      >
                        <Activity className="mr-2 h-4 w-4" />
                        Web Activity
                      </button>
                      <button
                        onClick={() => {
                          handleMenuItemClick('/admin/help');
                          setIsOpen(false);
                          setIsMobileAccountOpen(false);
                        }}
                        className="block w-full text-left px-2 py-1 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors flex items-center"
                      >
                        <HelpCircle className="mr-2 h-4 w-4" />
                        Help
                      </button>
                      <button
                        onClick={() => {
                          handleMenuItemClick('/admin/success-stories');
                          setIsOpen(false);
                          setIsMobileAccountOpen(false);
                        }}
                        className="block w-full text-left px-2 py-1 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors flex items-center"
                      >
                        <Star className="mr-2 h-4 w-4" />
                        Success Stories
                      </button>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                          setIsMobileAccountOpen(false);
                        }}
                        className="block w-full text-left px-2 py-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors flex items-center"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/admin"
                  className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors py-2 flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="mr-1 h-4 w-4" />
                  Admin
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}