import { useState, FormEvent, ChangeEvent } from 'react';
import { ArrowLeftIcon, DocumentTextIcon, LinkIcon } from '@heroicons/react/24/outline';

interface SkillCoverage {
  [key: string]: number;
}

interface ResumeResult {
  Similarity: string;
  "Completeness Score": string;
  "Missing Sections": string[];
  "Skill Coverage (%)": SkillCoverage;
}

interface ComparisonResult {
  "Resume 1": ResumeResult;
  "Resume 2": ResumeResult;
  "Best Fit": string;
}

export default function ResumeComparator() {
  const [resume1, setResume1] = useState<File | null>(null);
  const [resume2, setResume2] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [results, setResults] = useState<ComparisonResult | null>(null);
  const [visualizations, setVisualizations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, setter: (file: File | null) => void) => {
    if (e.target.files && e.target.files.length > 0) {
      setter(e.target.files[0]);
    } else {
      setter(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!resume1 || !resume2 || !jobDescription) {
      setError('Please fill all required fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('resume1', resume1);
      formData.append('resume2', resume2);
      formData.append('job_description', jobDescription);
      if (linkedinUrl) formData.append('linkedin_url', linkedinUrl);

      const response = await fetch('/compare', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setResults(data.result);
      setVisualizations(data.visualizations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setResume1(null);
    setResume2(null);
    setJobDescription('');
    setLinkedinUrl('');
    setResults(null);
    setVisualizations({});
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Resume Comparison Tool
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Compare two resumes against a job description
          </p>
        </div>
        
        {!results ? (
          <div className="bg-white shadow rounded-lg p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="resume1" className="block text-sm font-medium text-gray-700">
                    Resume 1 (PDF/DOCX)
                  </label>
                  <div className="mt-1">
                    <input
                      id="resume1"
                      name="resume1"
                      type="file"
                      accept=".pdf,.docx"
                      required
                      onChange={(e) => handleFileChange(e, setResume1)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  {resume1 && (
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <DocumentTextIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {resume1.name}
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="resume2" className="block text-sm font-medium text-gray-700">
                    Resume 2 (PDF/DOCX)
                  </label>
                  <div className="mt-1">
                    <input
                      id="resume2"
                      name="resume2"
                      type="file"
                      accept=".pdf,.docx"
                      required
                      onChange={(e) => handleFileChange(e, setResume2)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  {resume2 && (
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <DocumentTextIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {resume2.name}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="job_description" className="block text-sm font-medium text-gray-700">
                  Job Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="job_description"
                    name="job_description"
                    rows={5}
                    required
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center">
                    <LinkIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    LinkedIn Profile URL (Optional)
                  </div>
                </label>
                <div className="mt-1">
                  <input
                    type="url"
                    id="linkedin_url"
                    name="linkedin_url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Comparing...
                    </>
                  ) : (
                    'Compare Resumes'
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Comparison Results</h2>
              <button
                onClick={resetForm}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                New Comparison
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-blue-600">
                  <h3 className="text-lg leading-6 font-medium text-white">
                    Resume 1: {results["Resume 1"].Similarity}
                  </h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                  <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Similarity Score</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {results["Resume 1"].Similarity}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Completeness Score</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {results["Resume 1"]["Completeness Score"]}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Missing Sections</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {results["Resume 1"]["Missing Sections"].join(", ") || "None"}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Skill Coverage</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                          {Object.entries(results["Resume 1"]["Skill Coverage (%)"]).map(
                            ([category, score]) => (
                            <li key={category} className="pl-3 pr-4 py-3 flex items-center justify-between">
                              <div className="w-0 flex-1 flex items-center">
                                <span className="ml-2 flex-1 w-0 truncate">{category}</span>
                              </div>
                              <div className="ml-4 flex-shrink-0">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {score}%
                                </span>
                              </div>
                            </li>
                          )}
                        </ul>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-blue-600">
                  <h3 className="text-lg leading-6 font-medium text-white">
                    Resume 2: {results["Resume 2"].Similarity}
                  </h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                  <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Similarity Score</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {results["Resume 2"].Similarity}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Completeness Score</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {results["Resume 2"]["Completeness Score"]}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Missing Sections</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {results["Resume 2"]["Missing Sections"].join(", ") || "None"}
                      </dd>
                    </div>
                    <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">Skill Coverage</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                          {Object.entries(results["Resume 2"]["Skill Coverage (%)"]).map(
                            ([category, score]) => (
                            <li key={category} className="pl-3 pr-4 py-3 flex items-center justify-between">
                              <div className="w-0 flex-1 flex items-center">
                                <span className="ml-2 flex-1 w-0 truncate">{category}</span>
                              </div>
                              <div className="ml-4 flex-shrink-0">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {score}%
                                </span>
                              </div>
                            </li>
                          )}
                        </ul>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-green-800">
                    Best Fit: {results["Best Fit"]}
                  </h3>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {Object.entries(visualizations).map(([chartId, imgData]) => (
                <div key={chartId} className="bg-white p-4 shadow rounded-lg">
                  <img
                    src={`data:image/png;base64,${imgData}`}
                    className="w-full h-auto"
                    alt="Comparison chart"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}