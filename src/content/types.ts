export type Locale = "pt" | "en";

export type Experience = {
  role: string;
  company: string;
  location?: string;
  period: string;
  summary: string;
  highlights: string[];
};

export type Education = {
  title: string;
  institution?: string;
  period: string;
  details: string;
  status?: string;
};

export type Certificate = {
  title: string;
  url: string;
};

export type Project = {
  title: string;
  context: string;
  description: string;
  stack: string[];
  impact: string;
  note?: string;
  links: Array<{ label: string; url: string }>;
};

export type SkillGroup = {
  title: string;
  items: string[];
};

export type NavItem = {
  label: string;
  href: string;
};

export type Language = {
  name: string;
  level: string;
};

export type Profile = {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  whatsapp: string;
  resumePdf: string;
  summary: string;
  focus: string[];
  printContact: string;
};

export type Labels = {
  nav: {
    experience: string;
    projects: string;
    stack: string;
    education: string;
    contact: string;
  };
  downloadPdf: string;
  viewProjects: string;
  contact: string;
  summary: string;
  experience: string;
  experienceHeading: string;
  projects: string;
  projectsHeading: string;
  stack: string;
  stackHeading: string;
  education: string;
  educationHeading: string;
  certificates: string;
  certificatesHeading: string;
  languages: string;
  contactHeading: string;
  available: string;
};

export type Content = {
  locale: Locale;
  meta: { title: string; description: string };
  profile: Profile;
  labels: Labels;
  navItems: NavItem[];
  experiences: Experience[];
  projects: Project[];
  skillGroups: SkillGroup[];
  education: Education[];
  certificates: Certificate[];
  languages: Language[];
};
