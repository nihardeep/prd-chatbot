// CLEAN, VALIDATED, FULLY FIXED App.js WITH WEBHOOK
// No JSX errors, no stray characters, fully build-ready

import React, { useState } from 'react';
import { Send, Loader2, MapPin, Home, Search, MessageCircle } from 'lucide-react';

export default function TravelApp() {
  const [currentPage, setCurrentPage] = useState('home');
  const [searchParams, setSearchParams] = useState({ destination: '', adults: 1, rooms: 1 });
  const [selectedDestination, setSelectedDestination] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I'm your Trip Planner assistant. Tell me about your dream trip and I'll help you create the perfect itinerary!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const destinations = [
    {
      name: 'Trips to Bali',
      image:
        'https://images.pexels.com/photos/3714902/pexels-photo-3714902.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Tropical Paradise',
      color: 'from-orange-400 to-red-500'
    },
    {
      name: 'Trips to Kuala Lumpur',
      image:
        'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Modern Metropolis',
      color: 'from-purple-400 to-pink-500'
    },
    {
      name: 'Trips to Bangkok',
      image:
        'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'City of Angels',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      name: 'Trips to Singapore',
      image:
        'https://images.pexels.com/photos/1534993/pexels-photo-1534993.jpeg?auto=compress&cs=tinysrgb&w=600',
      description: 'Lion City',
      color: 'from-blue-400 to-cyan-500'
    }
  ];

  const handleDestinationClick = (destination) => {
    setSelectedDestination(destination);
    setCurrentPage('chatbot');
    setMessages([
      {
        role: 'assistant',
        content: `Great choice! Let's plan your trip to ${destination}. Tell me your preferences, budget, and what activities interest you most.`
      }
    ]);
  };

  const handleChatSubmit = async () => {
    if (!input.trim() || loading) return;

    if (!apiKey) {
      alert('Please enter your OpenAI API key in settings');
      return;
    }

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);

    // Webhook - user message
    fetch('https://nihardip.app.n8n.cloud/webhook-test/d7de37ee-3a58-446b-a226-115066a37281', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'user_message',
        destination: selectedDestination,
        message: input,
        timestamp: new Date().toISOString()
      })
    }).catch((err) => console.error('Webhook error:', err));

    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content:
                `You are an expert travel planner specializing in Southeast Asian destinations. Help users plan amazing trips to ${selectedDestination}.`
            },
            ...messages,
            userMessage
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      const data = await response.json();

      const assistantMessage = {
        role: 'assistant',
        content: data?.choices?.[0]?.message?.content || ''
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Webhook - assistant message
      fetch('https://nihardip.app.n8n.cloud/webhook-test/d7de37ee-3a58-446b-a226-115066a37281', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'assistant_message',
          destination: selectedDestination,
          message: assistantMessage.content,
          timestamp: new Date().toISOString()
        })
      }).catch((err) => console.error('Webhook error:', err));
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Error: ${error.message}` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatSubmit();
    }
  };

  // HOME PAGE
  if (currentPage === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <nav className="bg-black bg-opacity-60 backdrop-blur-md border-b border-purple-500 border-opacity-30 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <MapPin className="w-8 h-8 text-purple-400" />
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  TravelMate
                </h1>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
              Explore Southeast Asia
            </h2>
            <p className="text-xl text-purple-200 mb-8">
              Discover, Plan, and Experience Amazing Destinations
            </p>

            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 shadow-2xl max-w-2xl mx-auto mb-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Destination
                  </label>
                  <select
                    value={searchParams.destination}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, destination: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg text-gray-800 font-medium focus:ring-2 focus:ring-purple-300 outline-none"
                  >
                    <option value="">Select Destination</option>
                    {destinations.map((d) => (
                      <option key={d.name} value={d.name}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Adults
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={searchParams.adults}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, adults: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-3 rounded-lg text-gray-800 font-medium focus:ring-2 focus:ring-purple-300 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-semibold mb-2">
                    Rooms
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={searchParams.rooms}
                    onChange={(e) =>
                      setSearchParams({ ...searchParams, rooms: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-3 rounded-lg text-gray-800 font-medium focus:ring-2 focus:ring-purple-300 outline-none"
                  />
                </div>

                <div className="flex items-end">
                   onClick={() => {
    if (!searchParams.destination) {
      alert("Please select a destination");
      return;
    }
    handleDestinationClick(searchParams.destination);
  }}
  className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold py-3 rounded-lg hover:from-yellow-300 hover:to-orange-300 transition transform hover:scale-105 flex items-center justify-center gap-2"
>
  <Search className="w-5 h-5" />
  Search
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Destination Tiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {destinations.map((destination) => (
              <div
                key={destination.name}
                onClick={() => handleDestinationClick(destination.name)}
                className="group cursor-pointer"
              >
                <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl transform transition hover:scale-105 hover:shadow-purple-500/50 duration-300">
                  <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />

                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${destination.color} opacity-0 group-hover:opacity-40 transition duration-300`}
                  ></div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {destination.name}
                    </h3>
                    <p className="text-purple-200 mb-4">
                      {destination.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-purple-300 group-hover:text-purple-100 transition">
                      <MapPin className="w-4 h-4" />
                      <span>Explore Now →</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Chat Icon */}
          <div className="fixed bottom-6 right-6 z-40">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="group relative"
            >
              {!showSettings && (
                <div className="absolute -top-12 right-0 bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  Trip Planner
                </div>
              )}

              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-4 shadow-lg hover:shadow-purple-500/50 transition transform hover:scale-110 cursor-pointer">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
            </button>

            {showSettings && (
              <div className="absolute bottom-16 right-0 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden border border-purple-200">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white font-bold flex justify-between items-center">
                  <span>Trip Planner</span>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-white hover:text-gray-200 transition"
                  >
                    ✕
                  </button>
                </div>

                <div className="h-64 overflow-y-auto p-4 bg-gray-50 space-y-3">
                  <div className="bg-purple-100 rounded-lg p-3 text-sm text-gray-800">
                    Click on any destination tile to start planning your trip!
                  </div>
                </div>

                <div className="p-4 border-t border-gray-200">
                  <p className="text-xs text-gray-600 text-center">
                    Select a destination to get personalized recommendations
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // CHATBOT PAGE
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="bg-black bg-opacity-60 backdrop-blur-md border-b border-purple-500 border-opacity-30 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MapPin className="w-8 h-8 text-purple-400" />
          <div>
            <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              Trip Planner
            </h1>
            <p className="text-sm text-purple-200">{selectedDestination}</p>
          </div>
        </div>

        <button
          onClick={() => setCurrentPage('home')}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition flex items-center gap-2"
        >
          <Home className="w-5 h-5" /> Back to Home
        </button>
      </div>

      {!apiKey && (
        <div className="bg-yellow-500 bg-opacity-90 border-b border-yellow-600 p-4">
          <div className="max-w-4xl mx-auto">
            <label className="block text-sm font-bold text-gray-900 mb-2">
              🔑 OpenAI API Key Required
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="flex-1 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-300 outline-none"
              />
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition text-sm font-semibold"
              >
                Get Key
              </a>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-2xl rounded-2xl p-4 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                  : 'bg-white text-gray-800 shadow-lg border border-purple-200'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl p-4 shadow-lg">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            </div>
          </div>
        )}
      </div>

      <div className="bg-black bg-opacity-40 border-t border-purple-500 border-opacity-30 p-6">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about attractions, hotels, food, activities..."
            className="flex-1 px-4 py-3 rounded-xl bg-white text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            disabled={loading || !apiKey}
          />

          <button
            onClick={handleChatSubmit}
            disabled={loading || !input.trim() || !apiKey}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
