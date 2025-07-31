export function ScrapingInstructions() {
    return (
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Web Scraping Implementation</h3>
        <p className="text-sm text-muted-foreground mb-4">
          The skill trends page now fetches real-time data from Coursera's "High-Income Skills" article. Here's how it
          works:
        </p>
  
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">1</span>
            <span>
              <strong>Server-side Scraping:</strong> We've created an API route at <code>/api/skills</code> that fetches
              and parses the Coursera article using Cheerio.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">2</span>
            <span>
              <strong>Data Caching:</strong> The API implements caching to avoid excessive requests to Coursera, with
              automatic refreshing every hour.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">3</span>
            <span>
              <strong>Fallback Mechanism:</strong> In case of scraping failures, the system falls back to predefined data
              to ensure your website always displays meaningful content.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-primary/10 text-primary rounded-full p-1 mt-0.5">4</span>
            <span>
              <strong>Manual Refresh:</strong> Users can manually refresh the data using the "Refresh Data" button in the
              header.
            </span>
          </li>
        </ul>
  
        <div className="mt-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-xs text-yellow-800">
          <strong>Note:</strong> Web scraping should be done responsibly and in accordance with the website's terms of
          service. Consider implementing proper rate limiting and caching to minimize the load on the target server.
        </div>
      </div>
    )
  }
  
  