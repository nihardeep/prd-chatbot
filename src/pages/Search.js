// Reverted to working state - removed dynamic filter changes to fix blank screen issue
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import SearchCard from '../components/SearchCard';
import FilterSidebar from '../components/search/FilterSidebar';
import SortOptions from '../components/search/SortOptions';
import HotelGrid from '../components/search/HotelGrid';
import HotelCardSkeleton from '../components/search/HotelCardSkeleton';
import ChatBot from '../components/ChatBot';
import SearchLoadingDialog from '../components/SearchLoadingDialog';
import Input from '../components/ui/input';
import Button from '../components/ui/button';
import { MapPin, Map } from 'lucide-react';
import { getDestinationDisplayName, getDestinationImage } from '../utils/destinations';
import { getOrCreateSearchSession } from '../lib/session';

const INITIAL_FILTERS = {
  payAtHotel: true,
  rating7: true,
  location9: false,
  washingMachine: false,
  apartment: false,
  serviced: false,
  hotel: false,
  villa: false,
};

const HOTEL_DATA = [
  {
    id: 'hotel-1',
    name: 'Deface Platinum 2 Kuala Lumpur',
    images: [
      'https://images.pexels.com/photos/261395/pexels-photo-261395.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/271643/pexels-photo-271643.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    newBadge: 'Newly built in 2023',
    location: 'Kuala Lumpur City Centre, Kuala Lumpur - City',
    booked: 'Booked 25 times today',
    tags: ['Promoted', 'Boosted', 'Agoda Preferred'],
    discountBadge: '-68%',
    discountAmount: '6,373',
    rating: { score: '8.5', label: 'Excellent', reviews: '1,142' },
    originalPrice: 'Rs. 17,336',
    discountPercent: '-68%',
    finalPrice: 'Rs. 4,847',
  },
  {
    id: 'hotel-2',
    name: 'Tribal Luxe Suites Bukit Bintang',
    images: [
      'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/261327/pexels-photo-261327.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    newBadge: 'Renovated in 2024',
    location: 'Bukit Bintang, Kuala Lumpur',
    booked: 'Booked 18 times today',
    tags: ['Agoda Preferred', 'Hot Deal'],
    discountBadge: '-52%',
    discountAmount: '4,210',
    rating: { score: '9.1', label: 'Exceptional', reviews: '2,743' },
    originalPrice: 'Rs. 21,090',
    discountPercent: '-52%',
    finalPrice: 'Rs. 10,112',
  },
  {
    id: 'hotel-3',
    name: 'Azure Heights KLCC Residences',
    images: [
      'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=1200',
      'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1200',
    ],
    newBadge: 'Newly built in 2022',
    location: 'KLCC, Kuala Lumpur',
    booked: 'Popular choice',
    tags: ['Boosted', 'Family Favorite'],
    discountBadge: '-35%',
    discountAmount: '3,320',
    rating: { score: '8.9', label: 'Wonderful', reviews: '987' },
    originalPrice: 'Rs. 12,500',
    discountPercent: '-35%',
    finalPrice: 'Rs. 8,125',
  },
];


export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [priceRange, setPriceRange] = React.useState([0, 2039410]);
  const [filters, setFilters] = React.useState(INITIAL_FILTERS);
  const [sortOption, setSortOption] = React.useState('best');
  const [favorites, setFavorites] = React.useState({});
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);

  // Get destination from search results or URL params
  const getCurrentDestination = () => {
    if (searchResults?.destination) {
      return searchResults.destination;
    }
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get('destination') || 'kuala-lumpur';
  };

  const getCurrentSearchParams = () => {
    const searchParams = new URLSearchParams(window.location.search);
    return {
      destination: searchParams.get('destination') || 'kuala-lumpur',
      adults: parseInt(searchParams.get('adults')) || 2,
      rooms: parseInt(searchParams.get('rooms')) || 1,
      sessionId: searchParams.get('sessionId')
    };
  };

  const currentDestination = getCurrentDestination();
  const currentSearchParams = getCurrentSearchParams();
  const destinationName = getDestinationDisplayName(currentDestination);
  const destinationImage = getDestinationImage(currentDestination);


  const handleToggleFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggleFavorite = (hotelId) => {
    setFavorites((prev) => ({
      ...prev,
      [hotelId]: !prev[hotelId],
    }));
  };

  const handleChatSubmit = async (message, chatId) => {
    const payload = {
      type: "chat",
      message: message,
      chatId: chatId,
      destination: currentDestination || null,
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
              // Reload the page to show new results
              window.location.reload();
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
            return cleanedText ? [cleanedText] : ["Thank you for your message! Our travel assistant will respond shortly."];
          } catch (textError) {
            console.error("Failed to read text response:", textError);
            return ["Thank you for your message! Our travel assistant will respond shortly."];
          }
        }
      } else {
        console.error("n8n webhook returned error status:", response.status);
        const errorText = await response.text().catch(() => "Unknown error");
        console.error("Error response:", errorText);
        return ["Sorry, I'm having trouble connecting right now. Please try again later."];
      }
    } catch (err) {
      console.error("Chat n8n webhook error:", err);
      return ["Sorry, I'm having trouble connecting right now. Please try again later."];
    }
  };

  const handleSearch = (searchData) => {
    // Show loading dialog immediately when search is initiated
    setIsLoading(true);

    const session = getOrCreateSearchSession();

    // Navigate to search page with new parameters - fetchSearchResults will handle the n8n request
    navigate(`/search?sessionId=${session.id}&destination=${searchData.destination}&adults=${searchData.adults}&rooms=${searchData.rooms}`);
  };

  const fetchSearchResults = async (sessionId) => {
    setIsLoading(true);
    try {
      // Get search parameters from URL
      const urlParams = new URLSearchParams(window.location.search);
      const destination = urlParams.get('destination') || 'kuala-lumpur';
      const adults = parseInt(urlParams.get('adults')) || 2;
      const rooms = parseInt(urlParams.get('rooms')) || 1;

      const payload = {
        type: "search",
        destination: destination,
        adults: adults,
        rooms: rooms,
        timestamp: new Date().toISOString(),
        sessionId: sessionId,
      };

      const response = await fetch("https://nihardeep.app.n8n.cloud/webhook/travel-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Search results from n8n:", data);

        if (data.action === "search_results" && data.packages) {
          setSearchResults(data);
          setIsLoading(false); // Hide loading dialog as soon as results are set
          return; // Exit early since we have results
        }
      } else {
        console.error("Failed to fetch search results");
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Check for stored search results from chat and handle URL parameter changes
  React.useEffect(() => {
    const handleSearchParamsChange = () => {
      // Show loading dialog initially
      setIsLoading(true);

      // Check if we have stored search results from chat
      const storedResults = sessionStorage.getItem('searchResults');
      if (storedResults) {
        try {
          const parsedResults = JSON.parse(storedResults);
          setSearchResults(parsedResults);
          sessionStorage.removeItem('searchResults'); // Clear after use
          setIsLoading(false); // Hide loading dialog when results are shown
          return;
        } catch (error) {
          console.error('Error parsing stored search results:', error);
          setIsLoading(false); // Hide loading dialog even on error
        }
      }

      // Get current search parameters
      const params = getCurrentSearchParams();

      // Fetch search results with current parameters
      if (params.sessionId) {
        fetchSearchResults(params.sessionId);
      } else {
        setIsLoading(false); // Hide loading if no session ID
      }
    };

    // Execute when location.search changes (URL parameters change)
    handleSearchParamsChange();
  }, [location.search]); // Depend on location.search to trigger on URL parameter changes

  const transformN8nData = (data) => {
    return data.packages.map((pkg, index) => ({
      id: `n8n-${index}`,
      name: pkg.hotel.name,
      images: pkg.hotel.image
        ? [pkg.hotel.image]
        : ['https://images.pexels.com/photos/261395/pexels-photo-261395.jpeg?auto=compress&cs=tinysrgb&w=1200'],
      newBadge: null,
      location: `${data.destination}`,
      booked: 'Popular choice',
      tags: pkg.activity ? ['Package Deal', 'Hotel + Activity'] : ['Hotel Only'],
      discountBadge: null,
      discountAmount: null,
      rating: { score: '8.0', label: 'Very Good', reviews: '100+' },
      originalPrice: null,
      discountPercent: null,
      finalPrice: `Rs. ${pkg.package_total_price.toLocaleString('en-IN')}`,
      description: pkg.hotel.description,
      hasActivity: !!pkg.activity,
      hotelPrice: pkg.hotel.price,
      packagePrice: pkg.package_total_price,
    }));
  };

  const filteredHotels = searchResults ? transformN8nData(searchResults) : HOTEL_DATA;

  // Handle scroll for sticky search widget
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0a24] via-[#1a1530] to-[#2d1b69] text-white">
      <Header />

      {/* Search Loading Dialog */}
      <SearchLoadingDialog open={isLoading} />

      {/* Sticky Search Widget */}
      <div className={`transition-all duration-300 ${isScrolled ? 'sticky top-0 z-40 shadow-lg bg-[#1a1530]/95 backdrop-blur' : ''}`}>
        <SearchCard
          variant="compact"
          className="mb-0"
          onSearch={handleSearch}
          initialDestination={currentSearchParams.destination}
          initialAdults={currentSearchParams.adults}
          initialRooms={currentSearchParams.rooms}
        />
      </div>

      {/* Dynamic Heading Section */}
      <section className="bg-[#1a1530] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-[0.4em] text-gray-400 mb-4">
            TRAVELMATE SEARCH
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Plan your stay in {destinationName}
          </h1>
        </div>
      </section>

      {/* Holiday Destination Image */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <img
            src={destinationImage}
            alt={destinationName}
            className="w-full h-64 md:h-72 object-cover rounded-lg shadow-2xl"
          />
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-80 lg:flex-shrink-0">
            <div className="lg:hidden space-y-4">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setIsFilterDrawerOpen((prev) => !prev)}
              >
                {isFilterDrawerOpen ? 'Hide filters' : 'Show filters'}
              </Button>
              {isFilterDrawerOpen && (
                <FilterSidebar
                  priceRange={priceRange}
                  onPriceRangeChange={setPriceRange}
                  filters={filters}
                  onToggleFilter={handleToggleFilter}
                  className="sticky top-24"
                />
              )}
            </div>

            <div className="hidden lg:block">
              <FilterSidebar
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                filters={filters}
                onToggleFilter={handleToggleFilter}
              />
            </div>
          </div>

          <div className="flex-1 space-y-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-white/70">Showing {filteredHotels.length} choices</p>
                  <h2 className="text-2xl font-semibold">
                    {destinationName} · Hotels & Accommodations
                  </h2>
                </div>
                <Button variant="outline" className="w-full sm:w-auto">
                  Modify search
                </Button>
              </div>
              <SortOptions value={sortOption} onChange={setSortOption} />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-white/70 uppercase tracking-[0.4em]">
                    Explore visually
                  </p>
                  <h3 className="text-xl font-semibold">Search on Map</h3>
                </div>
                <Button variant="secondary" className="flex items-center gap-2">
                  <Map className="w-4 h-4" />
                  View interactive map
                </Button>
              </div>
              <div className="h-56 rounded-2xl bg-gradient-to-r from-[#3b82f6]/20 to-[#e879f9]/20 border border-white/10 flex items-center justify-center text-white/70">
                <div className="text-center space-y-2">
                  <MapPin className="w-8 h-8 mx-auto text-[#e879f9]" />
                  <p className="font-semibold">Pinch and zoom to explore {destinationName}</p>
                  <p className="text-sm text-white/60">
                    Coming soon: full interactive map experience.
                  </p>
                </div>
              </div>
              <Input
                placeholder={`Search within ${destinationName} area (e.g. city center, landmarks)`}
                className="bg-white text-gray-900 border border-white/30 placeholder:text-gray-500"
              />
            </div>

            <HotelGrid
              hotels={filteredHotels}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              isLoading={!searchResults || isLoading}
            />


            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-[#ff8b5f]/20 border border-[#ff8b5f]/30 rounded-3xl p-6">
                <p className="text-sm uppercase tracking-[0.4em] text-[#ffedd5]">
                  Agoda insights
                </p>
                <h3 className="text-2xl font-semibold mt-3">
                  Save more when you bundle flights + stays
                </h3>
                <Button variant="accent" className="mt-4">
                  Explore bundles
                </Button>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-3xl p-6">
                <p className="text-sm uppercase tracking-[0.4em] text-white/70">
                  TravelMate perks
                </p>
                <h3 className="text-2xl font-semibold mt-3">
                  Get AI powered trip plans in seconds
                </h3>
                <p className="text-white/70 mt-2">
                  Launch the chatbot anytime for personalized recommendations.
                </p>
                <Button variant="secondary" className="mt-4">
                  Plan with AI
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ChatBot
        key="search-chat"
        onChatSubmit={handleChatSubmit}
        initialMessage={`I am your chat assistant and I am here to plan your trip to ${destinationName}!`}
      />
    </div>
  );
}

