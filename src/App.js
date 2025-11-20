// Updated App.js with webhook integration
import React, { useState } from 'react';
import { Send, Loader2, MapPin, Home, Search, MessageCircle } from 'lucide-react';

export default function TravelApp() {
  const [currentPage, setCurrentPage] = useState('home');
  const [searchParams, setSearchParams] = useState({ destination: '', adults: 1, rooms: 1 });
  const [selectedDestination, setSelectedDestination] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm your Trip Planner assistant. Tell me about your dream trip and I'll help you create the perfect itinerary!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  const destinations = [
    { name: 'Trips to Bali', image: 'https://images.pexels.com/photos/3714902/pexels-photo-3714902.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Tropical Paradise', color: 'from-orange-400 to-red-500' },
    { name: 'Trips to Kuala Lumpur', image: 'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Modern Metropolis', color: 'from-purple-400 to-pink-500' },
    { name: 'Trips to Bangkok', image: 'https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'City of Angels', color: 'from-yellow-400 to-orange-500' },
    { name: 'Trips to Singapore', image: 'https://images.pexels.com/photos/1534993/pexels-photo-1534993.jpeg?auto=compress&cs=tinysrgb&w=600', description: 'Lion City', color: 'from-blue-400 to-cyan-500' }
  ];

  const handleDestinationClick = (destination) => {
    setSelectedDestination(destination);
    setCurrentPage('chatbot');
    setMessages([
      { role: 'assistant', content: `Great choice! Let's plan your trip to ${destination}. Tell me your preferences, budget, and what activities interest you most.` }
    ]);
  };

  const handleChatSubmit = async () => {
    if (!input.trim() || loading) return;
    if (!apiKey) {
      alert('Please enter your OpenAI API key in settings');
      return;
    }

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);

    // --- Webhook: Send User Message ---
    fetch("https://nihardip.app.n8n.cloud/webhook-test/d7de37ee-3a58-446b-a226-115066a37281", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "user_message",
        destination: selectedDestination,
        message: input,
        timestamp: new Date().toISOString()
      })
    }).catch(err => console.error("Webhook error:", err));

    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are an expert travel planner specializing in Southeast Asia. Help users plan amazing trips to ${selectedDestination}.`
            },
            ...messages,
            userMessage
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      const data = await response.json();
      const assistantMessage = { role: 'assistant', content: data?.choices?.[0]?.message?.content || '' };
      setMessages(prev => [...prev, assistantMessage]);

      // --- Webhook: Send Assistant Reply ---
      fetch("https://nihardip.app.n8n.cloud/webhook-test/d7de37ee-3a58-446b-a226-115066a37281", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "assistant_message",
          destination: selectedDestination,
          message: data?.choices?.[0]?.message?.content || '',
          timestamp: new Date().toISOString()
        })
      }).catch(err => console.error("Webhook error:", err));

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message}` }]);
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

  // --- HOME PAGE ---
  if (currentPage === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <nav className="bg-black bg-opacity-60 backdrop-blur-md border-b border-purple-500 border-opacity-30 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <MapPin className="w-8 h-8 text-purple-400" />
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">TravelMate</h1>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">Explore Southeast Asia</h2>
            <p className="text-xl text-purple-200 mb-8">Discover, Plan, and Experience Amazing Destinations</p>

            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 shadow-2xl max-w-2xl mx-auto mb-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Destination</label>
                  <select value={searchParams.destination} onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })} className="w-full px-4 py-3 rounded-lg text-gray-800 font-medium focus:ring-2 focus:ring-purple-300 outline-none">
                    <option value="">Select Destination</option>
                    {destinations.map(d => (<option key={d.name} value={d.name}>{d.name}</option>))}
                  </select>
                </div>

                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Adults</label>
                  <input type="number" min="1" max="10" value={searchParams.adults} onChange={(e) => setSearchParams({ ...searchParams, adults: parseInt(e.target.value) })} className="w-full px-4 py-3 rounded-lg text-gray-800 font-medium focus:ring-2 focus:ring-purple-300 outline-none" />
                </div>

                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Rooms</label>
                  <input type="number" min="1" max="10" value={searchParams.rooms} onChange={(e) => setSearchParams({ ...searchParams, rooms: parseInt(e.target.value) })} className="w-full px-4 py-3 rounded-lg text-gray-800 font-medium focus:ring-2 focus:ring-purple-300 outline-none" />
                </div>

                <div className="flex items-end">
                  <button className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold py-3 rounded-lg hover:from-yellow-300 hover:to-orange-300 transition transform hover:scale-105 flex items-center justify-center gap-2">
                    <Search className="w-5 h-5" /> Search
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">{
