import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { Document, Packer, Paragraph, HeadingLevel, AlignmentType, TextRun, convertInchesToTwip } from "docx"

export async function downloadAsPDF() {
  const resumeElement = document.querySelector(".resume-preview")
  if (!resumeElement) return

  // Fix for scaling issues on different devices
  const scale = 2 // Higher scale for better quality
  const options = {
    scale: scale,
    useCORS: true,
    logging: false,
    allowTaint: true,
    windowWidth: 800, // Fixed width to ensure consistency
    windowHeight: 1200, // Approximate height
    // Force specific font size to prevent scaling issues
    onclone: (clonedDoc: Document) => {
      const clonedElement = clonedDoc.querySelector(".resume-preview") as HTMLElement
      if (clonedElement) {
        // Apply a style to ensure consistent font sizing
        clonedElement.style.width = "800px"
        clonedElement.style.margin = "0"
        clonedElement.style.padding = "8px"
        // Force font size to be consistent
        const textElements = clonedElement.querySelectorAll("p, h1, h2, h3, span, div")
        textElements.forEach((el) => {
          const computedStyle = window.getComputedStyle(el)
          const currentSize = Number.parseFloat(computedStyle.fontSize)
          // Keep the current size but ensure it's explicitly set
          ;(el as HTMLElement).style.fontSize = `${currentSize}px`
        })
      }
    },
  }

  try {
    const canvas = await html2canvas(resumeElement as HTMLElement, options)

    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    // Calculate dimensions to fit on A4
    const imgWidth = 210 // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
    pdf.save("resume.pdf")
  } catch (error) {
    console.error("Error generating PDF:", error)
    alert("There was an error generating your PDF. Please try again.")
  }
}

export async function downloadAsWord(data: any) {
  // Create a new document with specific styling to prevent scaling issues
  const doc = new Document({
    styles: {
      paragraphStyles: [
        {
          id: "Normal",
          name: "Normal",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: 24, // 12pt font (24 half-points)
            font: "Calibri",
          },
          paragraph: {
            spacing: {
              line: 276, // Single line spacing
            },
          },
        },
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: 32, // 16pt font
            bold: true,
            font: "Calibri",
          },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: 28, // 14pt font
            bold: true,
            font: "Calibri",
          },
        },
        {
          id: "Heading3",
          name: "Heading 3",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: {
            size: 26, // 13pt font
            bold: true,
            font: "Calibri",
          },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
            },
          },
        },
        children: [
          // Personal Information
          new Paragraph({
            text: `${data.personal.name}`,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: `${data.personal.title}`,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: `${data.personal.email} | ${data.personal.phone} | ${data.personal.location}`,
            alignment: AlignmentType.CENTER,
          }),

          // Objective
          new Paragraph({
            text: "OBJECTIVE",
            heading: HeadingLevel.HEADING_2,
            thematicBreak: true,
          }),
          new Paragraph({
            text: data.objective,
          }),

          // Experience
          new Paragraph({
            text: "EXPERIENCE",
            heading: HeadingLevel.HEADING_2,
            thematicBreak: true,
          }),
          ...data.experience.flatMap((exp: any) => [
            new Paragraph({
              text: `${exp.position} at ${exp.company}`,
              heading: HeadingLevel.HEADING_3,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${exp.startDate} - ${exp.endDate} | ${exp.location}`,
                  italics: true,
                  size: 22, // 11pt
                }),
              ],
            }),
            new Paragraph({
              text: exp.description,
            }),
          ]),

          // Education
          new Paragraph({
            text: "EDUCATION",
            heading: HeadingLevel.HEADING_2,
            thematicBreak: true,
          }),
          ...data.education.flatMap((edu: any) => [
            new Paragraph({
              text: `${edu.degree}`,
              heading: HeadingLevel.HEADING_3,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${edu.institution} | ${edu.startDate} - ${edu.endDate}`,
                  italics: true,
                  size: 22, // 11pt
                }),
              ],
            }),
            new Paragraph({
              text: `${edu.location}${edu.gpa ? ` | GPA: ${edu.gpa}` : ""}`,
            }),
            edu.description ? new Paragraph({ text: edu.description }) : new Paragraph({}),
          ]),

          // Skills
          new Paragraph({
            text: "SKILLS",
            heading: HeadingLevel.HEADING_2,
            thematicBreak: true,
          }),
          new Paragraph({
            text: data.skills.join(", "),
          }),

          // Tools
          data.tools.length > 0
            ? new Paragraph({
                text: "TOOLS",
                heading: HeadingLevel.HEADING_3,
              })
            : new Paragraph({}),
          data.tools.length > 0
            ? new Paragraph({
                text: data.tools.join(", "),
              })
            : new Paragraph({}),
        ],
      },
    ],
  })

  try {
    // Generate the document as a blob
    const blob = await Packer.toBlob(doc)

    // Create a download link
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "resume.docx"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error("Error generating Word document:", error)
    alert("There was an error generating your Word document. Please try again.")
  }
}

