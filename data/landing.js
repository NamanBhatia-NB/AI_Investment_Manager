import {
  BarChart3,
  Receipt,
  PieChart,
  CreditCard,
  Globe,
  Zap,
} from "lucide-react";

import avatar1 from "../public/avatar1.png"
import avatar2 from "../public/avatar2.png"
import avatar3 from "../public/avatar3.png"

// Stats Data
export const statsData = [
  {
    value: "50K+",
    label: "Active Users",
  },
  {
    value: "₹ 2B+",
    label: "Investment Decisions made",
  },
  {
    value: "99.9%",
    label: "Uptime",
  },
  {
    value: "4.9/5",
    label: "User Rating",
  },
];

// Features Data
export const featuresData = [
  {
    icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
    title: "Advanced Analytics",
    description:
      "Get detailed insights into your investments with AI-powered analytics",
  },
  {
    icon: <Receipt className="h-8 w-8 text-blue-600" />,
    title: "Smart Portfolio Scanner",
    description:
      "Extract data automatically from portfolio using advanced AI technology",
  },
  {
    icon: <PieChart className="h-8 w-8 text-blue-600" />,
    title: "Investment Planning",
    description: "Create and manage investments with intelligent recommendations",
  },
  {
    icon: <CreditCard className="h-8 w-8 text-blue-600" />,
    title: "Multi-Investment Support",
    description: "Manage multiple investments in one place",
  },
  {
    icon: <Globe className="h-8 w-8 text-blue-600" />,
    title: "Multiple Markets",
    description: "Support for multiple markets across the world with real-time prediction.",
  },
  {
    icon: <Zap className="h-8 w-8 text-blue-600" />,
    title: "Automated Insights",
    description: "Get automated investment insights and recommendations",
  },
];

// How It Works Data
export const howItWorksData = [
  {
    icon: <CreditCard className="h-8 w-8 text-blue-600" />,
    title: "1. Create Your Account",
    description:
      "Get started in minutes with our simple and secure sign-up process",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
    title: "2. Track Your Investments",
    description:
      "Automatically categorize and track your investments in real-time",
  },
  {
    icon: <PieChart className="h-8 w-8 text-blue-600" />,
    title: "3. Get Insights",
    description:
      "Receive AI-powered insights and recommendations to optimize your investments",
  },
];

// Testimonials Data
// Testimonials Data for AI Investment App
export const testimonialsData = [
  {
    name: "Sarah Johnson",
    role: "Small Business Owner",
    image: '/avatar2.png',
    quote:
      "This AI investment app has transformed how I manage my portfolio. The AI-driven insights have helped me uncover opportunities I never thought possible.",
  },
  {
    name: "Michael Chen",
    role: "Freelancer",
    image: '/avatar1.png',
    quote:
      "The automated tracking and analysis features save me so much time. I can now focus on growing my investments without worrying about the details.",
  },
  {
    name: "Emily Rodriguez",
    role: "Financial Advisor",
    image: '/avatar3.png',
    quote:
      "I recommend this app to all my clients. Its AI-powered recommendations and multi-market support make it an essential tool for modern investors.",
  },
];