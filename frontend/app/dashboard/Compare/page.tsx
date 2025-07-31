"use client"
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CompareResult {
  result: any;
  visualizations: { [key: string]: string };
}

const SkillCompareForm: React.FC = () => {
  const [resume1, setResume1] = useState<File | null>(null);
  const [resume2, setResume2] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [compareResult, setCompareResult] = useState<CompareResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume1 || !resume2 || !jobDescription) {
      setError('All required fields must be filled.');
      return;
    }

    setError(null);
    setLoading(true);
    setCompareResult(null);

    const formData = new FormData();
    formData.append('resume1', resume1);
    formData.append('resume2', resume2);
    formData.append('job_description', jobDescription);
    if (linkedinUrl) formData.append('linkedin_url', linkedinUrl);

    try {
      const response = await fetch('http://localhost:5004/api/compare', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        setCompareResult({
          result: data.result,
          visualizations: data.charts
        });
        setShowForm(false);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const resetComparison = () => {
    setShowForm(true);
    setCompareResult(null);
    setResume1(null);
    setResume2(null);
    setJobDescription('');
    setLinkedinUrl('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 p-6 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl">
      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <motion.h1 
              className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              Resume Comparator
            </motion.h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resume 1 (PDF)</label>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="application/pdf" 
                      required 
                      onChange={(e) => setResume1(e.target.files?.[0] || null)} 
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-100 file:to-indigo-100 file:text-blue-700 hover:file:bg-blue-200 transition-all duration-200 shadow-sm"
                    />
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resume 2 (PDF)</label>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="application/pdf" 
                      required 
                      onChange={(e) => setResume2(e.target.files?.[0] || null)} 
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-100 file:to-indigo-100 file:text-blue-700 hover:file:bg-blue-200 transition-all duration-200 shadow-sm"
                    />
                  </div>
                </motion.div>
              </div>

              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
                <textarea
                  required
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
                  rows={6}
                  placeholder="Paste the job description here..."
                />
              </motion.div>

              <motion.div
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL (optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-gray-700 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
                    placeholder="https://linkedin.com/in/example"
                  />
                </div>
              </motion.div>

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-medium text-lg shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Resumes...
                  </div>
                ) : 'Compare Resumes'}
              </motion.button>
            </form>

            {error && (
              <motion.div 
                className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p>{error}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="space-y-8"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <motion.h1 
                className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Comparison Results
              </motion.h1>
              <motion.button
                onClick={resetComparison}
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                whileHover={{ x: -3 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                New Comparison
              </motion.button>
            </div>

            {/* Best Fit Section */}
            <motion.div
              className={`p-6 rounded-2xl shadow-md ${compareResult.result.BestFit === "Resume 1" ? 'bg-gradient-to-r from-green-100 to-blue-100 border-l-8 border-green-500' : 'bg-gradient-to-r from-green-100 to-blue-100 border-l-8 border-green-500'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-lg font-bold mb-3 text-gray-800">
                Best Fit: <span className="text-green-700">{compareResult.result.BestFit}</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  className={`p-4 rounded-xl transition-all duration-300 ${compareResult.result.BestFit === "Resume 1" ? 'bg-green-600 shadow-lg' : 'bg-white shadow-md'}`}
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className={`text-lg font-semibold ${compareResult.result.BestFit === "Resume 1" ? 'text-white' : 'text-gray-700'}`}>Resume 1</h3>
                </motion.div>
                <motion.div
                  className={`p-4 rounded-xl transition-all duration-300 ${compareResult.result.BestFit === "Resume 2" ? 'bg-green-600 shadow-lg' : 'bg-white shadow-md'}`}
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className={`text-lg font-semibold ${compareResult.result.BestFit === "Resume 2" ? 'text-white' : 'text-gray-700'}`}>Resume 2</h3>
                </motion.div>
              </div>
            </motion.div>

            {/* Visualizations */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-800">Analysis Charts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(compareResult.visualizations).map(([key, base64], index) => (
                  <motion.div
                    key={key}
                    className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                    whileHover={{ y: -5 }}
                  >
                    <h3 className="text-lg font-semibold mb-3 capitalize text-blue-600">
                      {key.replace(/_/g, ' ')}
                    </h3>
                    <div className="h-64 flex items-center justify-center">
                      <motion.img
                        src={`data:image/png;base64,${base64}`}
                        alt={`${key} visualization`}
                        className="max-w-full max-h-full object-contain"
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Detailed Comparison */}
            
                

            {/* New Comparison Button */}
            <motion.div
              className="flex justify-center mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <motion.button
                onClick={resetComparison}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-8 rounded-xl font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                Perform New Comparison
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillCompareForm;