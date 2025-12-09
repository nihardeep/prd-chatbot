import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SearchCard from '../components/SearchCard';
import DestinationCard from '../components/DestinationCard';
import ChatBot from '../components/ChatBot';
import SearchLoadingDialog from '../components/SearchLoadingDialog';
import { getOrCreateSearchSession } from '../lib/session';

const DESTINATIONS = [
  {
    name: "Trips to Bali",
    image: "https://images.pexels.com/photos/3714902/pexels-photo-3714902.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Tropical Paradise",
    destination: "bali",
  },
  {
    name: "Trips to Kuala Lumpur",
    image: "https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Modern Metropolis",
    destination: "kuala-lumpur",
  },
  {
    name: "Trips to Bangkok",
    image: "https://images.pexels.com/photos/2398220/pexels-photo-2398220.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "City of Angels",
    destination: "bangkok",
  },
  {
    name: "Trips to Singapore",
    image: "https://images.pexels.com/photos/1534993/pexels-photo-1534993.jpeg?auto=compress&cs=tinysrgb&w=600",
    description: "Lion City",
    destination: "singapore",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [selectedDestination, setSelectedDestination] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSearch = (searchData) => {
    const session = getOrCreateSearchSession();
    // Navigate to search page - fetchSearchResults will handle the n8n request
    navigate(`/search?sessionId=${session.id}&destination=${searchData.destination}&adults=${searchData.adults}&rooms=${searchData.rooms}`);
  };

  const handleDestinationClick = (destinationValue) => {
    const session = getOrCreateSearchSession();
    // Navigate to search page - fetchSearchResults will handle the n8n request
    navigate(`/search?sessionId=${session.id}&destination=${destinationValue}&adults=1&rooms=1`);
  };

  const handleChatSubmit = async (message, chatId) => {
    const payload = {
      type: "chat",
      message: message,
      chatId: chatId,
      destination: selectedDestination || null,
      timestamp: new Date().toISOString(),
    };

    const formatAssistantReplies = (responseData) => {
      const replies = [];

      const pushNormalized = (value) => {
        if (value === undefined || value === null) return;
        if (Array.isArray(value)) {
          value.forEach(pushNormalized);
          return;
        }
        if (typeof value === 'string') {
          const trimmed = value.trim();
          if (trimmed) replies.push(trimmed);
          return;
        }
        if (typeof value === 'object') {
          if (value.content) {
            pushNormalized(value.content);
            return;
          }
          if (value.reply) {
            pushNormalized(value.reply);
            return;
          }
          replies.push(JSON.stringify(value, null, 2));
          return;
        }
        replies.push(String(value));
      };

      const possibleFields = [
        responseData?.reply,
        responseData?.response,
        responseData?.message,
        responseData?.output,
        responseData?.text,
      ];
      possibleFields.forEach(pushNormalized);

      if (Array.isArray(responseData?.messages)) {
        responseData.messages.forEach(pushNormalized);
      }
      if (Array.isArray(responseData?.replies)) {
        responseData.replies.forEach(pushNormalized);
      }

      if (!replies.length) {
        pushNormalized(responseData);
      }

      return replies;
    };

    try {
      setIsLoading(true);
      console.log("Sending chat message to n8n:", payload);

      const response = await fetch("https://nihardeep.app.n8n.cloud/webhook/travel-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("n8n response status:", response.status);

      if (response.ok) {
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          // Try to parse as JSON
          try {
            const rawBody = await response.text();
            if (!rawBody || !rawBody.trim()) {
              console.warn("n8n JSON response had empty body.");
              return ["Received response but it was empty."];
            }

            const data = JSON.parse(rawBody);
            console.log("n8n JSON response:", data);

            // Check if this is a search results response
            if (data.action === "search_results" && data.packages) {
              // Store the search results and navigate to search page
              sessionStorage.setItem('searchResults', JSON.stringify(data));
              const session = getOrCreateSearchSession();
              const destination = data.destination || 'kuala-lumpur';
              navigate(`/search?sessionId=${session.id}&destination=${encodeURIComponent(destination)}`);
              return ["I've found some great options for you! Here are the search results:"];
            }

            const replies = formatAssistantReplies(data);
            if (replies.length) return replies;

            return ["Received response but it was empty."];
          } catch (jsonError) {
            console.error("Failed to parse JSON response:", jsonError);
            return ["Received response but couldn't parse it. Please check the server logs."];
          }
        } else {
          // Handle plain text response
          try {
            const text = await response.text();
            const cleanedText = text?.trim();
            console.log("n8n text response:", cleanedText);
            return [cleanedText || "Thank you for your message! Our travel assistant will respond shortly."];
          } catch (textError) {
            console.error("Failed to read text response:", textError);
            return ["Thank you for your message! Our travel assistant will respond shortly."];
          }
        }
      } else {
        console.error("n8n webhook returned error status:", response.status);
        const errorText = await response.text().catch(() => "Unknown error");
        console.error("Error response:", errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
    } catch (err) {
      console.error("Chat n8n webhook error:", err);
      return ["Sorry, I'm having trouble connecting right now. Please try again later."];
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2d1b69] to-[#1a1530]">
      <Header />

      {/* Search Loading Dialog */}
      <SearchLoadingDialog open={isLoading} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 leading-tight">
            Explore Southeast Asia
          </h1>
          <p className="text-xl text-gray-300 mb-12">
            Discover, Plan, and Experience Amazing Destinations
          </p>

          <SearchCard onSearch={handleSearch} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {DESTINATIONS.map((dest) => (
            <DestinationCard
              key={dest.name}
              name={dest.name}
              image={dest.image}
              description={dest.description}
              onClick={() => handleDestinationClick(dest.destination)}
            />
          ))}
        </div>
      </main>

      <ChatBot
        key="home-chat"
        onChatSubmit={handleChatSubmit}
        initialMessage="Hi! I'm your Trip Planner assistant. Tell me about your dream trip!"
      />
    </div>
  );
}
