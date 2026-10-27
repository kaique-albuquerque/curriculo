import type { Content } from "./types";

export const pt: Content = {
  locale: "pt",
  meta: {
    title: "Kaique Albuquerque — Currículo",
    description:
      "Currículo online de Kaique Albuquerque: desenvolvedor full-stack com 4 anos em TI, React, TypeScript, Node.js e dados.",
  },
  profile: {
    name: "Kaique Albuquerque",
    title: "Desenvolvedor Full-stack (React · TypeScript · Node.js)",
    location: "Birigui - SP",
    email: "kaique.g.dias14@gmail.com",
    phone: "+55 (18) 98810-3982",
    linkedin: "https://www.linkedin.com/in/kaique-dias/",
    github: "https://github.com/kaique-albuquerque",
    whatsapp:
      "https://wa.me/5518988103982?text=Ola%2C+Kaique%2C+vi+o+seu+curriculo+online+e+gostaria+de+conversar.",
    resumePdf: "/kaique-albuquerque-curriculo-pt.pdf",
    summary:
      "Desenvolvedor full-stack com 4 anos em TI. Na Pluma Genetics evoluí de assistente administrativo a supervisor técnico, entregando site institucional, aplicativo interno e dashboards executivos.",
    focus: ["React + TypeScript", "APIs REST", "Power BI", "React Native"],
    printContact:
      "linkedin.com/in/kaique-dias · github.com/kaique-albuquerque · +55 18 98810-3982 · kaique.g.dias14@gmail.com",
  },
  labels: {
    nav: {
      experience: "Experiência",
      projects: "Projetos",
      stack: "Stack",
      education: "Formação",
      contact: "Contato",
    },
    downloadPdf: "Baixar PDF",
    viewProjects: "Ver projetos",
    contact: "Entrar em contato",
    summary: "Resumo",
    experience: "Experiência",
    experienceHeading: "Trajetória em produto e dados",
    projects: "Projetos",
    projectsHeading: "Projetos aplicados",
    stack: "Stack",
    stackHeading: "Competências por área",
    education: "Formação",
    educationHeading: "Base acadêmica e evolução contínua",
    certificates: "Certificados",
    certificatesHeading: "Cursos com certificado",
    languages: "Idiomas",
    languageProof: "comprovante",
    contactHeading: "Contato",
    available:
      "Disponível para oportunidades em produto, dados e engenharia de software.",
  },
  navItems: [
    { label: "Experiência", href: "#experiencia" },
    { label: "Projetos", href: "#projetos" },
    { label: "Stack", href: "#stack" },
    { label: "Formação", href: "#formacao" },
    { label: "Contato", href: "#contato" },
  ],
  experiences: [
    {
      role: "Supervisor Técnico",
      company: "Pluma Genetics",
      location: "Birigui - SP",
      period: "abr/2024 – atual",
      summary:
        "Respondo pela frente digital da empresa: site institucional, aplicativo interno, dashboards executivos e suporte técnico.",
      highlights: [
        "Desenvolvo e mantenho o site institucional em React com TypeScript e consumo de APIs.",
        "Criei e mantive um aplicativo corporativo em React Native com Expo para rotinas internas da empresa.",
        "Estruturei dashboards em Power BI com rentabilidade, custos, metas e participação de mercado para a diretoria.",
        "Coordenei o suporte técnico e a evolução dos produtos internos.",
      ],
    },
    {
      role: "Analista de Dados Gerenciais",
      company: "Pluma Genetics",
      location: "Birigui - SP",
      period: "set/2023 – abr/2024",
      summary:
        "Transformei dados operacionais em painéis e ferramentas usadas por gestores e representantes comerciais.",
      highlights: [
        "Construí dashboards interativos e visões executivas em Power BI.",
        "Automatizei rotinas internas para reduzir trabalho manual em relatórios.",
        "Desenvolvi e mantive o website da empresa.",
        "Criei ferramentas de apoio para representantes comerciais.",
      ],
    },
    {
      role: "Assistente Administrativo",
      company: "Pluma Genetics",
      location: "Birigui - SP",
      period: "jan/2023 – set/2023",
      summary:
        "Atuei na logística com relatórios, automação em Excel/VBA e melhoria de processos.",
      highlights: [
        "Criei relatórios em Power BI para acompanhamento da operação.",
        "Desenvolvi e otimizei planilhas em VBA.",
        "Apoiei a eficiência da logística de entregas.",
      ],
    },
    {
      role: "Suporte de Infraestrutura em TI",
      company: "Solinftec",
      location: "Birigui - SP",
      period: "mar/2022 – dez/2022",
      summary:
        "Suporte a redes, equipamentos e usuários em ambiente corporativo de tecnologia agrícola.",
      highlights: [
        "Auxiliei na manutenção da infraestrutura de redes.",
        "Gerenciei e organizei equipamentos de TI.",
        "Diagnostiquei e resolvi incidentes em notebooks corporativos.",
      ],
    },
  ],
  projects: [
    {
      title: "Dashboard corporativo em React e Node.js",
      context: "Pluma Genetics · uso interno",
      description:
        "Aplicação própria com interface React, API em Node.js e consulta mais rápida que as visões de indicadores anteriores.",
      impact:
        "Reuniu rentabilidade, custos, metas e participação de mercado em um único painel.",
      stack: ["React", "TypeScript", "Node.js", "APIs"],
      note: "Sistema interno com dados financeiros; acesso sob confidencialidade, demonstração na entrevista.",
      links: [],
    },
    {
      title: "Pluma Genetics App — iOS e Android",
      context: "Pluma Genetics · app publicado",
      description:
        "App em React Native com Expo para avicultores simularem lotes por linhagem, projetarem produção e consultarem os manuais técnicos.",
      impact:
        "Publicado na App Store e no Google Play, com simulações exportáveis em CSV.",
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
      title: "Site institucional em React",
      context: "Pluma Genetics · produto web",
      description:
        "Manutenção e evolução do site institucional em React com TypeScript, integrações e foco em clareza de conteúdo.",
      impact:
        "Centralizou a presença digital da empresa e simplificou a atualização de conteúdo.",
      stack: ["React", "TypeScript", "CSS", "APIs"],
      links: [{ label: "plumagenetics.com", url: "https://plumagenetics.com" }],
    },
    {
      title: "Projetos públicos no GitHub",
      context: "Open source · estudo aplicado",
      description:
        "Repositórios de estudo em React, TypeScript e IA aplicada: RAG com Neo4j, playground de tensores e ferramenta de download de HLS.",
      impact: "Código aberto para avaliação técnica direta.",
      stack: ["React", "TypeScript", "Python", "Node.js"],
      links: [
        {
          label: "Ver GitHub",
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
        "HTML semântico",
        "CSS responsivo",
        "Consumo de APIs",
      ],
    },
    {
      title: "Back-end / APIs",
      items: ["Node.js", "Integrações REST", "Modelagem para dashboards"],
    },
    { title: "Mobile", items: ["React Native", "Expo"] },
    {
      title: "Dados / BI",
      items: [
        "Power BI",
        "Indicadores executivos",
        "Análise gerencial",
        "Excel/VBA",
      ],
    },
    { title: "IA / Automação", items: ["RAG", "Embeddings", "LangChain"] },
    { title: "Ferramentas", items: ["Git", "GitHub", "Playwright"] },
  ],
  education: [
    {
      title: "Pós-graduação em Engenharia de IA Aplicada",
      institution: "",
      period: "abr/2026 – abr/2027",
      details:
        "Formação prática em IA aplicada: RAGs, embeddings, personalização de assistentes, memória de contexto, MCP, LangChain e Neo4j.",
      status: "Em andamento",
    },
    {
      title: "Tecnólogo em Análise e Desenvolvimento de Sistemas",
      institution: "Universidade Norte do Paraná",
      period: "fev/2022 – dez/2023",
      details: "Formação concluída.",
      status: "Concluído",
    },
    {
      title: "Especialização em Power BI",
      institution: "Ninja do Excel",
      period: "jan/2023",
      details: "Formação em dashboards e análise de dados.",
      status: "",
    },
    {
      title: "Curso Básico de Python",
      institution: "SENAI",
      period: "fev/2023 – mai/2023",
      details: "Fundamentos de programação em Python.",
    },
    {
      title: "Azure Data Fundamentals (DP-900)",
      institution: "SENAI",
      period: "mai/2023 – jun/2023",
      details: "Conceitos de dados e computação em nuvem.",
    },
    {
      title: "Programação Oracle - Java Foundations",
      institution: "SENAI",
      period: "mai/2023 – jul/2023",
      details: "Base de programação com Java.",
    },
  ],
  certificates: [
    {
      title: "Implantação e Análise de Dados em Nuvem - Microsoft DP-900",
      url: "https://drive.google.com/file/d/10H0DDm1vUWi_R2J9LStAciwKONGj5PMF/view?usp=sharing",
    },
    {
      title: "Programação em Python",
      url: "https://drive.google.com/file/d/1QePkL-dAHb60qApALlmOQrzBVBXiy-Up/view?usp=share_link",
    },
    {
      title: "Programação Oracle - Java Foundations",
      url: "https://drive.google.com/file/d/14lL070kjjR6gX3IBCRkYZ0AyRfvQxVeZ/view?usp=sharing",
    },
    {
      title: "Estrutura de Redes",
      url: "https://drive.google.com/file/d/1CQBKwm8F4r90Z-eG71lyuXf9YxzKYHCR/view?usp=sharing",
    },
    {
      title: "Aprendendo Estruturas de Dados e Algoritmos",
      url: "https://drive.google.com/file/d/1sqhWvPEjZ4ekUDdSig7JKZjV7zVVuTip/view?usp=sharing",
    },
    {
      title: "Lógica de Programação Essencial",
      url: "https://drive.google.com/file/d/1OZIG3wBHfCWytLsKIbAmubNRqafVi-5E/view?usp=sharing",
    },
  ],
  languages: [
    { name: "Português", level: "Nativo" },
    { name: "Inglês", level: "A2 — em evolução para B1" },
    {
      name: "Espanhol",
      level: "B1",
      issuer: "SIELE",
      url: "https://drive.google.com/file/d/19CObvEgNUtG2Nzq72OdcDkqfSzZxu8Og/view?usp=sharing",
    },
  ],
};
