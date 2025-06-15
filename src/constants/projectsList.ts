export type ProjectType = "Full Stack" | "Frontend" | "Backend";

export interface ProjectItem {
  title: string;
  summary: string;
  type: ProjectType;
  tech: string[];
  image: string; // path to thumbnail or logo
  github?: string;
  liveDemo?: string;
  description: string; // for modal
}

export const projectsList: ProjectItem[] = [
  {
    title: "Bargain Buddy",
    summary: "Compare grocery prices across T&T using public data.",
    type: "Full Stack",
    tech: ["React", "Django", "PostgreSQL", "Docker"],
    image: "/projects/bargain-buddy-thumb.png",
    github: "https://github.com/chaisu1978/bargainbuddy",
    liveDemo: "https://bbuddy.webworkstt.com/",
    description: `A full-stack web app where users can search grocery items by name and location, view price trends, and compare stores. Data is parsed from the Ministry of Trade’s XLS sheets. Includes JWT auth & REST API.`,
  },
  {
    title: "HOS Trip Planner",
    summary: "Plan driver routes with FMCSA-compliant logs and maps.",
    type: "Full Stack",
    tech: ["React", "Django", "Leaflet", "PostgreSQL"],
    image: "/projects/hos-trip-thumb.png",
    github: "https://github.com/chaisu1978/hos-trip-planner",
    liveDemo: "https://hos-trip-planner.vercel.app/",
    description: `React + Django platform that plans driving routes with FMCSA Hours of Service compliance. Includes daily logbook previews, animated maps, and PDF export. Uses OpenRouteService and JWT-based user accounts.`,
  },
  {
    title: "Webworkstt.com",
    summary: "A Django-powered web development and cloud services site.",
    type: "Full Stack",
    tech: ["HTML", "JQuery", "Django", "ERP Integration"],
    image: "/projects/webworks-thumb.png",
    github: "",
    liveDemo: "https://webworkstt.com/",
    description: `Providing web development, cloud services, and design solutions. Offers instant quotations through integration wtih their ERP. Built with Django for the backend and HTML/CSS for the frontend.`,
  },
  {
    title: "Portfolio Website",
    summary: "A React + Vite single-page animated resume site.",
    type: "Frontend",
    tech: ["React", "Vite", "Framer Motion", "MUI"],
    image: "/projects/portfolio-thumb.png",
    github: "https://github.com/chaisu1978/chaisu1978.github.io",
    liveDemo: "https://chaisu1978.github.io/",
    description: `Personal portfolio and resume site with smooth animations, side drawer nav, scroll-spy highlighting, responsive layout, and parallax video header. Built using Vite, React, Framer Motion, and Material-UI.`,
  },
];
