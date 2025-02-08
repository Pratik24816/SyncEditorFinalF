import { BotMessageSquare } from "lucide-react";
import { BatteryCharging } from "lucide-react";
import { Fingerprint } from "lucide-react";
import { ShieldHalf } from "lucide-react";
import { PlugZap } from "lucide-react";
import { GlobeLock } from "lucide-react";

import user1 from "../assets/profile-pictures/user1.jpg";
import user2 from "../assets/profile-pictures/user2.jpg";
import user3 from "../assets/profile-pictures/user3.jpg";
import user4 from "../assets/profile-pictures/user4.jpg";
import user5 from "../assets/profile-pictures/user5.jpg";
import user6 from "../assets/profile-pictures/user6.jpg";

export const navItems = [
  { label: "Features", href: "#" },
  { label: "Workflow", href: "#" },
  { label: "Pricing", href: "#" },
  { label: "Testimonials", href: "#" },
];
export const testimonials = [
  {
    user: "John Doe",
    company: "Content Creators Hub",
    image: user1,
    text: "The text editor's intuitive design and powerful tools have revolutionized my workflow. Writing and editing have never been this seamless.",
  },
  {
    user: "Jane Smith",
    company: "Blue Ink Publishing",
    image: user2,
    text: "This text editor has been a game-changer for my publishing tasks. The built-in grammar suggestions and formatting tools save me hours of work.",
  },
  {
    user: "David Johnson",
    company: "Innovative Writers Guild",
    image: user3,
    text: "From real-time collaboration to customizable themes, this text editor is packed with features that make writing enjoyable and efficient.",
  },
  {
    user: "Ronee Brown",
    company: "Fusion Dynamics Copywriters",
    image: user4,
    text: "The editor's ability to handle large documents effortlessly and provide instant feedback on grammar has significantly improved our team's productivity.",
  },
  {
    user: "Michael Wilson",
    company: "Visionary Creatives",
    image: user5,
    text: "I love how versatile this text editor is. Whether I'm drafting a blog or preparing a formal document, it has all the tools I need in one place.",
  },
  {
    user: "Emily Davis",
    company: "Synergy Writers Studio",
    image: user6,
    text: "The collaborative features are top-notch. My team can edit and comment in real-time, making it easier than ever to finalize our projects quickly.",
  },
];
;
export const checklistItems = [
  {
    title: "Effortless Formatting",
    description:
      "Easily format your text with built-in tools for alignment, spacing, and font styling.",
  },
  {
    title: "Streamlined Document Reviews",
    description:
      "Collaborate effectively by reviewing and commenting on documents with track changes functionality.",
  },
  {
    title: "AI-Powered Suggestions",
    description:
      "Enhance your writing with AI-driven grammar corrections, style suggestions, and vocabulary improvements.",
  },
  {
    title: "Instant Document Sharing",
    description:
      "Share your documents instantly via cloud services or direct links for real-time collaboration.",
  },
  {
    title: "Customizable Themes",
    description:
      "Personalize your text editor with themes to reduce eye strain and improve your focus.",
  },
  {
    title: "Integrated Spell and Grammar Check",
    description:
      "Identify and correct spelling and grammar issues in real-time as you type.",
  },
  {
    title: "Real-Time Collaboration",
    description:
      "Work with your team in real-time, allowing simultaneous editing and commenting on the same document.",
  },
  {
    title: "Extensive File Format Support",
    description:
      "Open and edit a variety of file formats including DOCX, PDF, TXT, and more.",
  },
];

export const features = [
  {
    icon: <BatteryCharging/>, // Represents code and syntax highlighting
    text: "Syntax Highlighting",
    description:
      "Enhance code readability with syntax highlighting for a wide range of programming languages.",
  },
  {
    icon: <BotMessageSquare />, // Represents cross-platform or multi-device support
    text: "Multi-Platform Support",
    description:
      "Access your editor on desktop, web, or mobile devices for seamless code editing anywhere.",
  },
  {
    icon: <Fingerprint />, // Represents snippets or reusable elements
    text: "Code Snippets",
    description:
      "Speed up development with reusable code snippets and templates for commonly used patterns.",
  },
  {
    icon: <ShieldHalf />, // Represents teamwork or collaboration
    text: "Real-Time Collaboration",
    description:
      "Collaborate with team members in real-time with features like live edits and comments.",
  },
  {
    icon: <PlugZap />, // Represents version control, specifically Git
    text: "Version Control Integration",
    description:
      "Easily manage your code versions with built-in Git integration and seamless workflows.",
  },
  {
    icon: <GlobeLock />, // Represents customization and plugins
    text: "Extensive Plugin Support",
    description:
      "Customize your editor with a vast library of plugins and extensions to suit your workflow.",
  },
];
export const pricingOptions = [
  {
    title: "Free",
    price: "$0",
    features: [
      "Private board sharing",
      "5 Gb Storage",
      "Web Analytics",
      "Private Mode",
    ],
  },
  {
    title: "Pro",
    price: "$10",
    features: [
      "Private board sharing",
      "10 Gb Storage",
      "Web Analytics (Advance)",
      "Private Mode",
    ],
  },
  {
    title: "Enterprise",
    price: "$200",
    features: [
      "Private board sharing",
      "Unlimited Storage",
      "High Performance Network",
      "Private Mode",
    ],
  },
];

export const resourcesLinks = [
  { href: "#", text: "Getting Started" },
  { href: "#", text: "Documentation" },
  { href: "#", text: "Tutorials" },
  { href: "#", text: "API Reference" },
  { href: "#", text: "Community Forums" },
];

export const platformLinks = [
  { href: "#", text: "Features" },
  { href: "#", text: "Supported Devices" },
  { href: "#", text: "System Requirements" },
  { href: "#", text: "Downloads" },
  { href: "#", text: "Release Notes" },
];

export const communityLinks = [
  { href: "#", text: "Events" },
  { href: "#", text: "Meetups" },
  { href: "#", text: "Conferences" },
  { href: "#", text: "Hackathons" },
  { href: "#", text: "Jobs" },
];
