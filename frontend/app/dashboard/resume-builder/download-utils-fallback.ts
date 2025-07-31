// This is a fallback method that can be used if the main download method fails
export function printToPDF() {
    const resumeElement = document.querySelector(".resume-preview")
    if (!resumeElement) return
  
    // Create a new window
    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      alert("Please allow popups for this website to download your resume.")
      return
    }
  
    // Write the resume HTML to the new window
    printWindow.document.write(`
      <html>
        <head>
          <title>Resume</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
            }
            .resume-container {
              max-width: 800px;
              margin: 0 auto;
              font-size: 12px;
            }
            h1 { font-size: 18px; }
            h2 { font-size: 16px; }
            h3 { font-size: 14px; }
            p, div, span { font-size: 12px; }
            @media print {
              body { 
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
          </style>
        </head>
        <body>
          <div class="resume-container">
            ${resumeElement.outerHTML}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 500);
            }
          </script>
        </body>
      </html>
    `)
  
    printWindow.document.close()
  }
  
  