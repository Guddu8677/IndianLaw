'use client';

import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('en');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const searchLaw = async () => {
    if (!query) {
      setResult('Please enter a query to search.');
      return;
    }

    if (hasSearched) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, language }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An unknown error occurred.');
      }

      const data = await response.json();
      setResult(data.result || 'No result found. Please check your query.');
      setHasSearched(true);
    } catch (error) {
      console.error('Error fetching result:', error);
      setResult('Failed to fetch the result. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setQuery('');
    setResult('');
    setHasSearched(false);
  };

  const lawCards = [
    {
      title: 'Article 21',
      description: 'Right to life and personal liberty under the Indian Constitution.',
    },
    {
      title: 'Section 498A of IPC',
      description: 'Protection of married women from cruelty by husband or relatives.',
    },
    {
      title: 'The Consumer Protection Act, 2019',
      description: 'Safeguards consumer rights and provides a mechanism for grievance redressal.',
    },
    {
      title: 'The Right to Information Act, 2005',
      description: 'Empowers citizens to access public authority information.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-black to-gray-800 text-white">
      <Head>
        <title>AI Law Search Engine</title>
        <meta name="description" content="Search Indian laws effortlessly using AI." />
      </Head>

      {/* Header */}
      <header className="mb-8 flex items-center justify-center w-full max-w-4xl">
        <img
          src="/logo.png"
          alt="AI Law Logo"
          className="w-12 h-12 mr-4 rounded-full"
        />
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-orange-600">Indian</span>{' '}
            <span className="text-white">Law</span>{' '}
            <span className="text-green-600">AI</span>
          </h1>
          <p className="text-lg">
            Search Indian laws with references to the Constitution, IPC, CrPC, and more.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-md bg-gradient-to-r from-black to-gray-700 text-white p-8 rounded-lg shadow-md">
        {/* Language Selector */}
        <div className="mb-6">
          <label htmlFor="language" className="block text-gray-300 font-medium mb-2">
            Select Language:
          </label>
          <select
            id="language"
            className="w-full border border-gray-600 bg-gray-800 text-white rounded px-3 py-2"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
          </select>
        </div>

        {/* Query Input */}
        <div className="mb-6">
          <textarea
            placeholder="Type your legal query here"
            className="w-full border border-gray-600 bg-gray-800 text-white rounded px-3 py-2"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHasSearched(false);
            }}
          ></textarea>
        </div>

        {/* Search Button */}
        <div className="text-center">
          <button
            onClick={searchLaw}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow flex items-center justify-center"
            disabled={loading || hasSearched}
          >
            {loading ? (
              <>
                <span className="animate-spin border-2 border-t-transparent border-white rounded-full h-5 w-5 mr-2"></span>
                Loading...
              </>
            ) : (
              'Search'
            )}
          </button>
          {hasSearched && (
            <button
              onClick={resetSearch}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded shadow mt-4"
            >
              Reset
            </button>
          )}
        </div>
      </main>

      {/* Result Section */}
      <section className="mt-12 w-full max-w-2xl bg-gradient-to-r from-black to-gray-800 text-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Result</h2>
        <p>{result}</p>
      </section>

      {/* Law Cards Section */}
      <section className="mt-12 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {lawCards.map((law, index) => (
          <div
            key={index}
            className="bg-gray-800 text-white p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300"
          >
            <h3 className="text-xl font-bold mb-2">{law.title}</h3>
            <p>{law.description}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="mt-12 text-sm text-gray-400">
        <p>&copy; 2025 AI Law Search Engine</p>
      </footer>
    </div>
  );
}
