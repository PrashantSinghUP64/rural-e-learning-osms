import React from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { BookOpen, AlertCircle, Loader } from 'lucide-react';

// This function fetches the content from your backend
const fetchContent = async () => {
  const res = await fetch('/api/content');
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};

const ContentLibrary = () => {
  const { data: responseData, isLoading, isError, error } = useQuery('allContent', fetchContent);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin h-10 w-10 text-primary-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <AlertCircle className="h-12 w-12 mb-4" />
        <h2 className="text-xl font-semibold">Error loading content</h2>
        <p>{error.message}</p>
      </div>
    );
  }

  // The actual array of content is inside responseData.content
  const content = responseData?.content || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-4">Content Library</h1>
      <div className="text-center mb-10">
        <Link to="/add-content">
          <button className="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
            + Add New Content
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {content.map((item) => (
          <div key={item._id} className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-shadow overflow-hidden flex flex-col">
            {item.thumbnail && (
              <img src={item.thumbnail} alt={item.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-6 flex-grow flex flex-col">
              <span className="text-sm text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded-full self-start mb-4">{item.type}</span>
              <h2 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h2>
              <p className="text-gray-700 mb-4 flex-grow">{item.description}</p>
              <a 
                href={item.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-primary-600 hover:text-primary-800 mt-auto self-start"
              >
                View Content &rarr;
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentLibrary;

















