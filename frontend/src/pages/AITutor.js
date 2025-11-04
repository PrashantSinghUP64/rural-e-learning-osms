import React, { useState } from 'react';

const AITutor = () => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { sender: 'user', text: message };
    setConversation(prev => [...prev, userMessage]);
    setIsLoading(true);
    setMessage('');

    try {
      // यह मैसेज आपके बनाए हुए बैकएंड API को भेजा जाएगा
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) { throw new Error('Network response was not ok'); }

      const data = await response.json();
      const aiMessage = { sender: 'ai', text: data.reply };
      setConversation(prev => [...prev, aiMessage]);

    } catch (error) {
      const errorMessage = { sender: 'ai', text: 'माफ़ कीजिए, मैं अभी कनेक्ट नहीं कर पा रहा हूँ। कृपया दोबारा प्रयास करें।' };
      setConversation(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto my-8 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">AI ट्यूटर 🤖</h1>
      
      <div className="h-96 overflow-y-auto mb-4 p-4 border rounded-md bg-gray-50 flex flex-col space-y-4">
        {conversation.map((entry, index) => (
          <div key={index} className={`p-3 rounded-lg max-w-lg text-white ${
            entry.sender === 'user' 
              ? 'bg-blue-600 ml-auto' 
              : 'bg-gray-700 mr-auto'
          }`}>
            {entry.text}
          </div>
        ))}
        {isLoading && <div className="self-center text-gray-500">AI सोच रहा है...</div>}
      </div>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="पढ़ाई के बारे में कुछ भी पूछें..."
          className="flex-grow p-3 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-r-md hover:bg-blue-700 disabled:bg-blue-300 font-semibold"
          disabled={isLoading}
        >
          भेजें
        </button>
      </form>
    </div>
  );
};

export default AITutor;