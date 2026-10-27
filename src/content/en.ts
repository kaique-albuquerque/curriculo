import type { Content } from "./types";

export const en: Content = {
  locale: "en",
  meta: {
    title: "Kaique Albuquerque — Resume",
    description:
      "Resume of Kaique Albuquerque: full-stack developer with 4 years in IT, working with React, TypeScript, Node.js and data.",
  },
  profile: {
    name: "Kaique Albuquerque",
    title: "Full-stack Developer (React · TypeScript · Node.js)",
    location: "Birigui, São Paulo, Brazil",
    email: "kaique.g.dias14@gmail.com",
    phone: "+55 (18) 98810-3982",
    linkedin: "https://www.linkedin.com/in/kaique-albq/",
    github: "https://github.com/kaique-albuquerque",
    whatsapp:
      "https://wa.me/5518988103982?text=Hi%2C+Kaique%2C+I+saw+your+online+resume+and+would+like+to+talk.",
    resumePdf: "/kaique-albuquerque-curriculo-en.pdf",
    summary:
      "Full-stack developer with 4 years in IT. At Pluma Genetics I moved from administrative assistant to technical supervisor, shipping the company website, an internal mobile app and executive dashboards.",
    focus: ["React + TypeScript", "REST APIs", "Power BI", "React Native"],
    printContact:
      "linkedin.com/in/kaique-albq · github.com/kaique-albuquerque · +55 18 98810-3982 · kaique.g.dias14@gmail.com",
  },
  labels: {
    nav: {
      experience: "Experience",
      projects: "Projects",
      stack: "Stack",
      education: "Education",
      contact: "Contact",
    },
    downloadPdf: "Download PDF",
    viewProjects: "View projects",
    contact: "Get in touch",
    summary: "Summary",
    experience: "Experience",
    experienceHeading: "Product and data track record",
    projects: "Projects",
    projectsHeading: "Selected projects",
    stack: "Stack",
    stackHeading: "Skills by area",
    education: "Education",
    educationHeading: "Academic background and continuous learning",
    certificates: "Certificates",
    certificatesHeading: "Certified courses",
    languages: "Languages",
    languageProof: "certificate",
    contactHeading: "Contact",
    available:
      "Open to opportunities in product, data and software engineering.",
  },
  navItems: [
    { label: "Experience", href: "#experiencia" },
    { label: "Projects", href: "#projetos" },
    { label: "Stack", href: "#stack" },
    { label: "Education", href: "#formacao" },
    { label: "Contact", href: "#contato" },
  ],
  experiences: [
    {
      role: "Technical Supervisor",
      company: "Pluma Genetics",
      location: "Birigui, Brazil",
      period: "Apr 2024 – Present",
      summary:
        "I own the company's digital front: website, internal app, executive dashboards and technical support.",
      highlights: [
        "Maintain the institutional website in React with TypeScript and API integration.",
        "Built and maintained an internal corporate app in React Native with Expo.",
        "Built Power BI dashboards covering profitability, costs, targets and market share for the board.",
        "Coordinated technical support and the roadmap of internal products.",
      ],
    },
    {
      role: "Management Data Analyst",
      company: "Pluma Genetics",
      location: "Birigui, Brazil",
      period: "Sep 2023 – Apr 2024",
      summary:
        "Turned operational data into dashboards and tools used by managers and sales representatives.",
      highlights: [
        "Built interactive dashboards and executive views in Power BI.",
        "Automated internal routines to cut manual work on reports.",
        "Developed and maintained the company website.",
        "Built support tools for sales representatives.",
      ],
    },
    {
      role: "Administrative Assistant",
      company: "Pluma Genetics",
      location: "Birigui, Brazil",
      period: "Jan 2023 – Sep 2023",
      summary:
        "Worked on logistics with reporting, Excel/VBA automation and process improvement.",
      highlights: [
        "Built Power BI reports to track operations.",
        "Developed and optimised spreadsheet automation with VBA.",
        "Supported delivery logistics efficiency.",
      ],
    },
    {
      role: "IT Infrastructure Support",
      company: "Solinftec",
      location: "Birigui, Brazil",
      period: "Mar 2022 – Dec 2022",
      summary:
        "Network, hardware and end-user support in a corporate agtech environment.",
      highlights: [
        "Assisted with network infrastructure maintenance.",
        "Managed and organised IT equipment.",
        "Diagnosed and resolved incidents on corporate laptops.",
      ],
    },
  ],
  projects: [
    {
      title: "Corporate dashboard in React and Node.js",
      context: "Pluma Genetics · internal tool",
      description:
        "Custom application with a React interface, Node.js API and faster queries than the previous indicator views.",
      impact:
        "Consolidated profitability, cost, target and market-share metrics in a single panel.",
      note: "Financial data under confidentiality; access restricted to company credentials, with a walkthrough in interviews.",
      stack: ["React", "TypeScript", "Node.js", "APIs"],
      links: [
        {
          label: "dashboard.plumagenetics.com",
          url: "https://dashboard.plumagenetics.com/",
        },
      ],
    },
    {
      title: "Pluma Genetics App — iOS and Android",
      context: "Pluma Genetics · published app",
      description:
        "React Native app with Expo for poultry producers to simulate batches by lineage, project output and check the technical manuals.",
      impact:
        "Published on the App Store and Google Play, with simulations exportable as CSV.",
      stack: ["React Native", "Expo", "APIs"],
      links: [
        {
          label: "App Store",
          url: "https://apps.apple.com/br/app/pluma-genetics/id6736628753",
        },
        {
          label: "Google Play",
          url: "https://play.google.com/store/apps/details?id=com.pluma.pg",
        },
      ],
    },
    {
      title: "Institutional website in React",
      context: "Pluma Genetics · web product",
      description:
        "Maintenance and evolution of the company website in React with TypeScript, integrations and a focus on content clarity.",
      impact:
        "Centralised the company's digital presence and simplified content updates.",
      stack: ["React", "TypeScript", "CSS", "APIs"],
      links: [{ label: "plumagenetics.com", url: "https://plumagenetics.com" }],
    },
    {
      title: "Public GitHub projects",
      context: "Open source · applied study",
      description:
        "Study repositories in React, TypeScript and applied AI: RAG with Neo4j, a tensor playground and an HLS downloader.",
      impact: "Open code available for direct technical review.",
      stack: ["React", "TypeScript", "Python", "Node.js"],
      links: [
        {
          label: "View GitHub",
          url: "https://github.com/kaique-albuquerque",
        },
      ],
    },
  ],
  skillGroups: [
    {
      title: "Front-end",
      items: [
        "React",
        "TypeScript",
        "Semantic HTML",
        "Responsive CSS",
        "API consumption",
      ],
    },
    {
      title: "Back-end / APIs",
      items: ["Node.js", "REST integrations", "Dashboard data modelling"],
    },
    { title: "Mobile", items: ["React Native", "Expo"] },
    {
      title: "Data / BI",
      items: [
        "Power BI",
        "Executive metrics",
        "Management analysis",
        "Excel/VBA",
      ],
    },
    { title: "AI / Automation", items: ["RAG", "Embeddings", "LangChain"] },
    { title: "Tooling", items: ["Git", "GitHub", "Playwright"] },
  ],
  education: [
    {
      title: "Postgraduate in Applied AI Engineering",
      institution: "",
      period: "Apr 2026 – Apr 2027",
      details:
        "Hands-on applied AI: RAGs, embeddings, assistant customisation, context memory, MCP, LangChain and Neo4j.",
      status: "In progress",
    },
    {
      title: "Associate Degree in Systems Analysis and Development",
      institution: "Universidade Norte do Paraná",
      period: "Feb 2022 – Dec 2023",
      details: "Completed.",
      status: "Completed",
    },
    {
      title: "Power BI Specialisation",
      institution: "Ninja do Excel",
      period: "Jan 2023",
      details: "Dashboards and data analysis.",
      status: "",
    },
    {
      title: "Python Fundamentals",
      institution: "SENAI",
      period: "Feb 2023 – May 2023",
      details: "Programming fundamentals in Python.",
    },
    {
      title: "Azure Data Fundamentals (DP-900)",
      institution: "SENAI",
      period: "May 2023 – Jun 2023",
      details: "Data and cloud computing concepts.",
    },
    {
      title: "Oracle Programming - Java Foundations",
      institution: "SENAI",
      period: "May 2023 – Jul 2023",
      details: "Programming basics with Java.",
    },
  ],
  certificates: [
    {
      title: "Cloud Data Deployment and Analysis - Microsoft DP-900",
      url: "https://drive.google.com/file/d/10H0DDm1vUWi_R2J9LStAciwKONGj5PMF/view?usp=sharing",
    },
    {
      title: "Python Programming",
      url: "https://drive.google.com/file/d/1QePkL-dAHb60qApALlmOQrzBVBXiy-Up/view?usp=share_link",
    },
    {
      title: "Oracle Programming - Java Foundations",
      url: "https://drive.google.com/file/d/14lL070kjjR6gX3IBCRkYZ0AyRfvQxVeZ/view?usp=sharing",
    },
    {
      title: "Network Fundamentals",
      url: "https://drive.google.com/file/d/1CQBKwm8F4r90Z-eG71lyuXf9YxzKYHCR/view?usp=sharing",
    },
    {
      title: "Data Structures and Algorithms",
      url: "https://drive.google.com/file/d/1sqhWvPEjZ4ekUDdSig7JKZjV7zVVuTip/view?usp=sharing",
    },
    {
      title: "Essential Programming Logic",
      url: "https://drive.google.com/file/d/1OZIG3wBHfCWytLsKIbAmubNRqafVi-5E/view?usp=sharing",
    },
  ],
  languages: [
    { name: "Portuguese", level: "Native" },
    { name: "English", level: "A2 — working towards B1" },
    {
      name: "Spanish",
      level: "B1",
      issuer: "SIELE",
      url: "https://drive.google.com/file/d/19CObvEgNUtG2Nzq72OdcDkqfSzZxu8Og/view?usp=sharing",
    },
  ],
};
