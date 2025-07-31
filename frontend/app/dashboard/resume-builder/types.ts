export interface Education {
    startDate: string
    endDate: string
    degree: string
    institution: string
    location: string
    description: string
    gpa?: string
  }
  
  export interface Experience {
    startDate: string
    endDate: string
    position: string
    company: string
    location: string
    description: string
  }
  
  export interface Certification {
    date: string
    title: string
    issuer: string
    score?: string
    description: string
  }
  
  export interface Project {
    title: string
    url?: string
    description: string
  }
  
  export interface Language {
    name: string
    proficiency: number
  }
  
  export interface ResumeData {
    personal: {
      name: string
      title: string
      photo: string
      email: string
      phone: string
      location: string
      linkedin: string
      github: string
    }
    objective: string
    education: Education[]
    experience: Experience[]
    skills: string[]
    tools: string[]
    certifications: Certification[]
    projects: Project[]
    languages: Language[]
  }
  
  export const defaultResumeData: ResumeData = {
    personal: {
      name: "Your Name",
      title: "Professional Title",
      photo: "",
      email: "email@example.com",
      phone: "+1 234 567 890",
      location: "City, Country",
      linkedin: "linkedin.com/in/yourprofile",
      github: "github.com/yourusername",
    },
    objective:
      "Accomplished professional seeking new opportunities to apply my skills and experience in a challenging environment.",
    education: [
      {
        startDate: "2017",
        endDate: "2021",
        degree: "Bachelor of Science in Computer Science",
        institution: "University Name",
        location: "City, Country",
        description: "Relevant coursework and achievements",
        gpa: "3.8",
      },
    ],
    experience: [
      {
        startDate: "2021",
        endDate: "Present",
        position: "Software Developer",
        company: "Company Name",
        location: "City, Country",
        description: "Responsible for developing and maintaining web applications using React and Node.js.",
      },
    ],
    skills: ["JavaScript", "React", "Node.js", "HTML5", "CSS3"],
    tools: ["VS Code", "Git", "Docker", "Figma"],
    certifications: [
      {
        date: "2020",
        title: "Web Development Certification",
        issuer: "Certification Provider",
        score: "90%",
        description: "Comprehensive web development training program",
      },
    ],
    projects: [
      {
        title: "Project Name",
        url: "https://project-url.com",
        description: "A brief description of the project and your role in it.",
      },
    ],
    languages: [
      {
        name: "English",
        proficiency: 5,
      },
      {
        name: "Spanish",
        proficiency: 3,
      },
    ],
  }
  
  