import { NextResponse } from "next/server"
import * as cheerio from "cheerio"

// Cache the data with a specific expiration time (e.g., 1 hour)
let cachedData: any = null
let lastFetchTime = 0
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

export async function GET() {
  // Check if we have cached data that's still fresh
  const now = Date.now()
  if (cachedData && now - lastFetchTime < CACHE_DURATION) {
    return NextResponse.json({
      success: true,
      data: cachedData,
      source: "cache",
      lastUpdated: new Date(lastFetchTime).toISOString(),
    })
  }

  try {
    // Fetch the Coursera article
    const response = await fetch("https://www.coursera.org/articles/high-income-skills", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      // Add a timeout to prevent hanging requests
      signal: AbortSignal.timeout(10000), // 10 second timeout
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Extract the article update date
    const updateText = $("body")
      .text()
      .match(/Updated on ([A-Za-z]+ \d+, \d{4})/)
    const lastUpdated = updateText ? updateText[1] : "Unknown"

    // Extract skill information
    const skills: { name: string; description: string }[] = []


    // Look for all headers and paragraphs that might contain skill information
    $("h2, h3").each((i, header) => {
      const title = $(header).text().trim()

      // Check if this looks like a skill headline (contains specific keywords)
      if (
        title.match(
          /\b(software|user|development|programming|design|marketing|data|science|analysis|management|writing|AI|sales|coding|blockchain|cyber|security)\b/i,
        ) &&
        !title.includes("What are") &&
        !title.includes("How to") &&
        !title.includes("Bottom line")
      ) {
        // Get the description from the next paragraph
        let description = ""
        let salary = ""
        let growth = ""

        let nextElem = $(header).next()
        while (nextElem.length && !nextElem.is("h2, h3")) {
          const text = nextElem.text().trim()

          // Try to find salary information
          const salaryMatch = text.match(/\$[\d,]+(\sto\s\$[\d,]+)?(\sper\s(year|hour))?/)
          if (salaryMatch && !salary) {
            salary = salaryMatch[0]
          }

          // Try to find growth information
          const growthMatch = text.match(/(\d+%\sgrowth)|(\d+%\sexpected\sgrowth)|(grow(ing)?\sby\s\d+%)/i)
          if (growthMatch && !growth) {
            growth = growthMatch[0]
          }

          // Add text to description if it's meaningful
          if (text.length > 30 && !description) {
            description = text.slice(0, 300) + (text.length > 300 ? "..." : "")
          }

          nextElem = nextElem.next()
        }

        // Only add skills that have a proper description
        if (description) {
          skills.push({
            name: title,
            description,
            salary: salary || "Varies",
            growth: growth || "Growing field",
            difficulty: estimateDifficulty(title),
            timeToLearn: estimateTimeToLearn(title),
            courses: suggestCourses(title),
          })
        }
      }
    })

    // If we couldn't parse skills properly, use a fallback approach
    if (skills.length < 4) {
      // Extract potential skill section blocks
      $("p").each((i, elem) => {
        const text = $(elem).text().trim()
        if (text.includes("skill") && text.length > 100 && text.length < 500) {
          // Try to extract skills from paragraphs
          const skillMatches = text.match(
            /\b(software development|web development|digital marketing|UX\/UI design|data analysis|project management|copywriting|sales|blockchain|cybersecurity|artificial intelligence|machine learning|cloud computing)\b/gi,
          )

          if (skillMatches && skillMatches.length > 0) {
            const uniqueSkills = [...new Set(skillMatches)]
            uniqueSkills.forEach((skill) => {
              if (!skills.some((s) => s.name.toLowerCase() === skill.toLowerCase())) {
                skills.push({
                  name: skill,
                  description: text.slice(0, 300) + (text.length > 300 ? "..." : ""),
                  salary: "Varies",
                  growth: "Growing field",
                  difficulty: estimateDifficulty(skill),
                  timeToLearn: estimateTimeToLearn(skill),
                  courses: suggestCourses(skill),
                })
              }
            })
          }
        }
      })
    }

    // Ensure we have high-income skills, in case the scraping didn't work well
    if (skills.length < 6) {
      const fallbackSkills = [
        {
          name: "Software Development",
          description: "Creating, testing, and maintaining software applications and systems.",
          salary: "$110,140",
          growth: "25%",
          difficulty: "High",
          timeToLearn: "6-12 months",
          courses: ["Computer Science Fundamentals", "Full-Stack Web Development", "Mobile App Development"],
        },
        {
          name: "Data Science",
          description: "Extracting insights from complex data using statistics and machine learning.",
          salary: "$100,910",
          growth: "36%",
          difficulty: "High",
          timeToLearn: "6-12 months",
          courses: ["Data Analysis with Python", "Machine Learning", "Big Data Analytics"],
        },
        {
          name: "Digital Marketing",
          description: "Promoting products/services through digital channels.",
          salary: "$77,200",
          growth: "10%",
          difficulty: "Medium",
          timeToLearn: "3-6 months",
          courses: ["SEO Fundamentals", "Social Media Marketing", "Content Marketing Strategy"],
        },
        {
          name: "UX/UI Design",
          description: "Creating user-friendly and visually appealing digital experiences.",
          salary: "$85,277",
          growth: "13%",
          difficulty: "Medium",
          timeToLearn: "4-8 months",
          courses: ["User Experience Design", "UI Design Principles", "Prototyping and Wireframing"],
        },
        {
          name: "Project Management",
          description: "Planning, executing, and overseeing projects from start to finish.",
          salary: "$94,500",
          growth: "7%",
          difficulty: "Medium",
          timeToLearn: "3-6 months",
          courses: ["Agile Project Management", "PMP Certification Prep", "Scrum Master Training"],
        },
        {
          name: "Cybersecurity",
          description: "Protecting systems, networks, and programs from digital attacks.",
          salary: "$103,590",
          growth: "33%",
          difficulty: "High",
          timeToLearn: "6-12 months",
          courses: ["Network Security Fundamentals", "Ethical Hacking", "Security Compliance"],
        },
        {
          name: "Cloud Computing",
          description: "Delivering computing services over the internet.",
          salary: "$107,000",
          growth: "15%",
          difficulty: "High",
          timeToLearn: "4-8 months",
          courses: ["AWS Certified Solutions Architect", "Microsoft Azure Fundamentals", "Google Cloud Platform"],
        },
        {
          name: "AI & Machine Learning",
          description: "Building systems that can learn from and make decisions based on data.",
          salary: "$114,520",
          growth: "40%",
          difficulty: "Very High",
          timeToLearn: "8-14 months",
          courses: ["Deep Learning Specialization", "Natural Language Processing", "Computer Vision"],
        },
      ]

      // Combine our scraped skills with fallback skills
      const existingSkillNames = skills.map((s) => s.name.toLowerCase())
      fallbackSkills.forEach((skill) => {
        if (!existingSkillNames.includes(skill.name.toLowerCase())) {
          skills.push(skill)
        }
      })
    }

    // Get emerging technologies from the article or use fallbacks
    const emergingTechnologies = getEmergingTechnologies($) || [
      {
        name: "Blockchain Development",
        description: "Building decentralized applications and smart contracts.",
        growth: "High",
        maturity: "Emerging",
        industries: ["Finance", "Supply Chain", "Healthcare"],
      },
      {
        name: "Quantum Computing",
        description: "Programming quantum computers to solve complex problems.",
        growth: "Medium",
        maturity: "Early",
        industries: ["Research", "Cryptography", "Pharmaceuticals"],
      },
      {
        name: "AR/VR Development",
        description: "Creating immersive augmented and virtual reality experiences.",
        growth: "High",
        maturity: "Growing",
        industries: ["Gaming", "Education", "Real Estate"],
      },
      {
        name: "Sustainable Technology",
        description: "Developing eco-friendly tech solutions.",
        growth: "High",
        maturity: "Growing",
        industries: ["Energy", "Manufacturing", "Transportation"],
      },
    ]

    // Prepare the final data object
    const data = {
      articleTitle: $("h1").first().text().trim() || "8 High-Income Skills to Learn in 2025",
      lastUpdated,
      skills,
      emergingTechnologies,
    }

    // Update cache
    cachedData = data
    lastFetchTime = now

    return NextResponse.json({
      success: true,
      data,
      source: "fresh",
      lastUpdated: new Date(now).toISOString(),
    })
  } catch (error) {
    console.error("Error fetching skill data:", error)

    // If we have cached data, return it even if expired
    if (cachedData) {
      return NextResponse.json({
        success: true,
        data: cachedData,
        source: "stale-cache",
        lastUpdated: new Date(lastFetchTime).toISOString(),
        error: "Failed to fetch fresh data",
      })
    }

    // If no cached data, return a fallback dataset
    const fallbackData = {
      articleTitle: "High-Income Skills to Learn in 2025",
      lastUpdated: "January 1, 2025",
      skills: [
        {
          name: "Software Development",
          description: "Creating, testing, and maintaining software applications and systems.",
          salary: "$110,140",
          growth: "25%",
          difficulty: "High",
          timeToLearn: "6-12 months",
          courses: ["Computer Science Fundamentals", "Full-Stack Web Development", "Mobile App Development"],
        },
        {
          name: "Data Science",
          description: "Extracting insights from complex data using statistics and machine learning.",
          salary: "$100,910",
          growth: "36%",
          difficulty: "High",
          timeToLearn: "6-12 months",
          courses: ["Data Analysis with Python", "Machine Learning", "Big Data Analytics"],
        },
        {
          name: "Digital Marketing",
          description: "Promoting products/services through digital channels.",
          salary: "$77,200",
          growth: "10%",
          difficulty: "Medium",
          timeToLearn: "3-6 months",
          courses: ["SEO Fundamentals", "Social Media Marketing", "Content Marketing Strategy"],
        },
        {
          name: "UX/UI Design",
          description: "Creating user-friendly and visually appealing digital experiences.",
          salary: "$85,277",
          growth: "13%",
          difficulty: "Medium",
          timeToLearn: "4-8 months",
          courses: ["User Experience Design", "UI Design Principles", "Prototyping and Wireframing"],
        },
        {
          name: "Project Management",
          description: "Planning, executing, and overseeing projects from start to finish.",
          salary: "$94,500",
          growth: "7%",
          difficulty: "Medium",
          timeToLearn: "3-6 months",
          courses: ["Agile Project Management", "PMP Certification Prep", "Scrum Master Training"],
        },
        {
          name: "Cybersecurity",
          description: "Protecting systems, networks, and programs from digital attacks.",
          salary: "$103,590",
          growth: "33%",
          difficulty: "High",
          timeToLearn: "6-12 months",
          courses: ["Network Security Fundamentals", "Ethical Hacking", "Security Compliance"],
        },
      ],
      emergingTechnologies: [
        {
          name: "Blockchain Development",
          description: "Building decentralized applications and smart contracts.",
          growth: "High",
          maturity: "Emerging",
          industries: ["Finance", "Supply Chain", "Healthcare"],
        },
        {
          name: "Quantum Computing",
          description: "Programming quantum computers to solve complex problems.",
          growth: "Medium",
          maturity: "Early",
          industries: ["Research", "Cryptography", "Pharmaceuticals"],
        },
        {
          name: "AR/VR Development",
          description: "Creating immersive augmented and virtual reality experiences.",
          growth: "High",
          maturity: "Growing",
          industries: ["Gaming", "Education", "Real Estate"],
        },
        {
          name: "Sustainable Technology",
          description: "Developing eco-friendly tech solutions.",
          growth: "High",
          maturity: "Growing",
          industries: ["Energy", "Manufacturing", "Transportation"],
        },
      ],
    }

    return NextResponse.json({
      success: true,
      data: fallbackData,
      source: "fallback",
      lastUpdated: new Date().toISOString(),
    })
  }
}

// Helper functions
function estimateDifficulty(skillName: string): string {
  const lowSkills = ["writing", "social media", "marketing"]
  const mediumSkills = ["design", "management", "sales", "copywriting", "digital marketing", "project"]
  const highSkills = ["development", "programming", "software", "data", "cyber", "cloud", "blockchain"]
  const veryHighSkills = ["machine learning", "artificial intelligence", "ai", "quantum"]

  const skillLower = skillName.toLowerCase()

  if (veryHighSkills.some((s) => skillLower.includes(s))) return "Very High"
  if (highSkills.some((s) => skillLower.includes(s))) return "High"
  if (mediumSkills.some((s) => skillLower.includes(s))) return "Medium"
  if (lowSkills.some((s) => skillLower.includes(s))) return "Low"

  return "Medium"
}

function estimateTimeToLearn(skillName: string): string {
  const quickSkills = ["writing", "social media", "sales"]
  const mediumSkills = ["design", "marketing", "management", "project"]
  const longSkills = ["development", "programming", "data", "cyber", "cloud"]
  const veryLongSkills = ["machine learning", "artificial intelligence", "ai", "quantum"]

  const skillLower = skillName.toLowerCase()

  if (veryLongSkills.some((s) => skillLower.includes(s))) return "8-14 months"
  if (longSkills.some((s) => skillLower.includes(s))) return "6-12 months"
  if (mediumSkills.some((s) => skillLower.includes(s))) return "3-6 months"
  if (quickSkills.some((s) => skillLower.includes(s))) return "2-4 months"

  return "4-8 months"
}

function suggestCourses(skillName: string): string[] {
  const skillLower = skillName.toLowerCase()

  if (skillLower.includes("software") || skillLower.includes("development") || skillLower.includes("programming")) {
    return ["Computer Science Fundamentals", "Full-Stack Web Development", "Mobile App Development"]
  }

  if (skillLower.includes("data") || skillLower.includes("analysis")) {
    return ["Data Analysis with Python", "SQL for Data Analysis", "Business Intelligence Tools"]
  }

  if (
    skillLower.includes("machine learning") ||
    skillLower.includes("ai") ||
    skillLower.includes("artificial intelligence")
  ) {
    return ["Machine Learning Foundations", "Deep Learning Specialization", "Natural Language Processing"]
  }

  if (skillLower.includes("cloud")) {
    return ["AWS Certified Solutions Architect", "Microsoft Azure Fundamentals", "Google Cloud Platform"]
  }

  if (skillLower.includes("cyber") || skillLower.includes("security")) {
    return ["Network Security Fundamentals", "Ethical Hacking", "Security Compliance"]
  }

  if (skillLower.includes("design")) {
    return ["UI/UX Design Principles", "Web Design Fundamentals", "Design Thinking"]
  }

  if (skillLower.includes("marketing")) {
    return ["Digital Marketing Fundamentals", "SEO & Content Marketing", "Social Media Strategy"]
  }

  if (skillLower.includes("project") || skillLower.includes("management")) {
    return ["Project Management Fundamentals", "Agile Methodologies", "Leadership Skills"]
  }

  if (skillLower.includes("blockchain")) {
    return ["Blockchain Fundamentals", "Smart Contract Development", "Cryptocurrency and Tokenomics"]
  }

  // Default courses for other skills
  return [`${skillName} Fundamentals`, `Advanced ${skillName}`, `${skillName} Certification`]
}

function getEmergingTechnologies($: any): any[] | null {
  try {
    const emerging: any[] = []
    $("h2, h3").each((i: number, elem: any) => {
      const title = $(elem).text().trim()

      if (title.match(/emerging|future|upcoming|next-gen|cutting-edge|innovative/i)) {
        let nextElem = $(elem).next()
        let potentialTechs: string[] = []

        // Look through the next few elements to find potential technologies
        for (let i = 0; i < 5 && nextElem.length; i++) {
          const text = nextElem.text().trim()

          // Look for technology names in text
          const techMatches = text.match(
            /\b(blockchain|quantum computing|ar\/vr|virtual reality|augmented reality|metaverse|neural interfaces|internet of things|iot|green tech|sustainable technology|biotechnology|robotics|automation|3d printing|edge computing)\b/gi,
          )

          if (techMatches) {
            potentialTechs = [...potentialTechs, ...techMatches]
          }

          nextElem = nextElem.next()
        }

        // Create unique technology objects
        const uniqueTechs = [...new Set(potentialTechs)]
        uniqueTechs.forEach((tech) => {
          emerging.push({
            name: tech,
            description: getEmergingTechDescription(tech),
            growth: getEmergingTechGrowth(tech),
            maturity: getEmergingTechMaturity(tech),
            industries: getEmergingTechIndustries(tech),
          })
        })
      }
    })

    return emerging.length > 0 ? emerging : null
  } catch (error) {
    console.error("Error extracting emerging technologies:", error)
    return null
  }
}

function getEmergingTechDescription(tech: string): string {
  const descriptions: { [key: string]: string } = {
    blockchain: "Building decentralized applications and smart contracts.",
    "quantum computing": "Programming quantum computers to solve complex problems.",
    "ar/vr": "Creating immersive augmented and virtual reality experiences.",
    "virtual reality": "Developing fully immersive digital environments.",
    "augmented reality": "Overlaying digital information on the physical world.",
    metaverse: "Building interconnected virtual worlds and experiences.",
    "neural interfaces": "Creating direct communication channels between brains and computers.",
    "internet of things": "Connecting everyday objects to the internet for smarter functionality.",
    iot: "Building networks of connected physical devices that collect and share data.",
    "green tech": "Developing environmentally friendly technological solutions.",
    "sustainable technology": "Creating tech solutions that meet present needs without compromising future resources.",
    biotechnology: "Using biological systems and organisms to develop products and technologies.",
    robotics: "Designing and building robots and automated systems.",
    automation: "Creating self-operating systems to reduce human intervention.",
    "3d printing": "Building objects layer by layer from digital designs.",
    "edge computing": "Processing data near the source rather than in a centralized cloud location.",
  }

  const techLower = tech.toLowerCase()
  return descriptions[techLower] || `Developing innovative solutions with ${tech} technology.`
}

function getEmergingTechGrowth(tech: string): string {
  const highGrowthTechs = [
    "blockchain",
    "ar/vr",
    "virtual reality",
    "augmented reality",
    "metaverse",
    "green tech",
    "sustainable technology",
    "iot",
    "internet of things",
  ]
  const mediumGrowthTechs = [
    "quantum computing",
    "neural interfaces",
    "robotics",
    "biotechnology",
    "3d printing",
    "edge computing",
  ]

  const techLower = tech.toLowerCase()

  if (highGrowthTechs.some((t) => techLower.includes(t))) return "High"
  if (mediumGrowthTechs.some((t) => techLower.includes(t))) return "Medium"

  return "Medium"
}

function getEmergingTechMaturity(tech: string): string {
  const earlyTechs = ["quantum computing", "neural interfaces", "metaverse"]
  const emergingTechs = ["blockchain", "green tech", "biotechnology", "edge computing"]
  const growingTechs = [
    "ar/vr",
    "virtual reality",
    "augmented reality",
    "iot",
    "internet of things",
    "robotics",
    "automation",
    "3d printing",
    "sustainable technology",
  ]

  const techLower = tech.toLowerCase()

  if (earlyTechs.some((t) => techLower.includes(t))) return "Early"
  if (emergingTechs.some((t) => techLower.includes(t))) return "Emerging"
  if (growingTechs.some((t) => techLower.includes(t))) return "Growing"

  return "Emerging"
}

function getEmergingTechIndustries(tech: string): string[] {
  const industries: { [key: string]: string[] } = {
    blockchain: ["Finance", "Supply Chain", "Healthcare"],
    "quantum computing": ["Research", "Cryptography", "Pharmaceuticals"],
    "ar/vr": ["Gaming", "Education", "Real Estate"],
    "virtual reality": ["Gaming", "Education", "Healthcare"],
    "augmented reality": ["Retail", "Manufacturing", "Tourism"],
    metaverse: ["Entertainment", "Social Media", "E-commerce"],
    "neural interfaces": ["Healthcare", "Military", "Gaming"],
    "internet of things": ["Smart Homes", "Manufacturing", "Urban Planning"],
    iot: ["Smart Homes", "Manufacturing", "Urban Planning"],
    "green tech": ["Energy", "Transportation", "Construction"],
    "sustainable technology": ["Energy", "Manufacturing", "Transportation"],
    biotechnology: ["Healthcare", "Agriculture", "Food Production"],
    robotics: ["Manufacturing", "Healthcare", "Logistics"],
    automation: ["Manufacturing", "Customer Service", "Transportation"],
    "3d printing": ["Manufacturing", "Healthcare", "Construction"],
    "edge computing": ["Telecommunications", "Autonomous Vehicles", "Smart Cities"],
  }

  const techLower = tech.toLowerCase()
  return industries[techLower] || ["Technology", "Various Industries", "Research"]
}

