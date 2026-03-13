import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Route, CloudSun, Wallet, BarChart, Download, 
  Plus, X, Navigation, AlertCircle, Leaf, Clock, TrendingDown,
  Sun, Cloud, CloudRain, CloudSnow, CloudDrizzle, Wind, Search, Calendar,
  Save, Upload, Moon, Utensils, Home as HomeIcon, DollarSign, PieChart,
  Hotel, Ticket, ShoppingBag, TrendingUp
} from 'lucide-react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'your_openweather_api_key';

// Travel modes with cost per km
const TRAVEL_MODES = {
  car: { name: 'Car', icon: '🚗', costPerKm: 8, speed: 60, co2PerKm: 0.12 },
  bike: { name: 'Bike', icon: '🏍️', costPerKm: 3, speed: 40, co2PerKm: 0.08 },
  bus: { name: 'Bus', icon: '🚌', costPerKm: 2, speed: 50, co2PerKm: 0.05 },
  train: { name: 'Train', icon: '🚆', costPerKm: 4, speed: 80, co2PerKm: 0.04 },
};

// Haversine formula to calculate distance between two points
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Nearest Neighbor Algorithm for route optimization
const optimizeRoute = (destinations) => {
  if (destinations.length <= 2) return destinations;

  const unvisited = [...destinations];
  const optimized = [unvisited.shift()]; // Start with first destination

  while (unvisited.length > 0) {
    const current = optimized[optimized.length - 1];
    let nearestIndex = 0;
    let minDistance = Infinity;

    unvisited.forEach((dest, index) => {
      const distance = calculateDistance(
        parseFloat(current.latitude),
        parseFloat(current.longitude),
        parseFloat(dest.latitude),
        parseFloat(dest.longitude)
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = index;
      }
    });

    optimized.push(unvisited.splice(nearestIndex, 1)[0]);
  }

  return optimized;
};

// Calculate total distance for route
const calculateTotalDistance = (destinations) => {
  let total = 0;
  for (let i = 0; i < destinations.length - 1; i++) {
    total += calculateDistance(
      parseFloat(destinations[i].latitude),
      parseFloat(destinations[i].longitude),
      parseFloat(destinations[i + 1].latitude),
      parseFloat(destinations[i + 1].longitude)
    );
  }
  return total;
};

// Get weather icon component
const WeatherIcon = ({ condition, size = 24 }) => {
  const iconProps = { size, className: "text-blue-500" };
  
  if (condition.includes('rain')) return <CloudRain {...iconProps} />;
  if (condition.includes('snow')) return <CloudSnow {...iconProps} />;
  if (condition.includes('drizzle')) return <CloudDrizzle {...iconProps} />;
  if (condition.includes('cloud')) return <Cloud {...iconProps} />;
  if (condition.includes('clear')) return <Sun {...iconProps} />;
  return <CloudSun {...iconProps} />;
};

// Map component to auto-fit bounds
const MapBoundsHandler = ({ destinations }) => {
  const map = useMap();

  useEffect(() => {
    if (destinations.length > 0) {
      const bounds = destinations.map(d => [
        parseFloat(d.latitude),
        parseFloat(d.longitude)
      ]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [destinations, map]);

  return null;
};

const TripPlanner = () => {
  const [availableDestinations, setAvailableDestinations] = useState([]);
  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [optimizedRoute, setOptimizedRoute] = useState([]);
  const [travelMode, setTravelMode] = useState('car');
  const [weatherData, setWeatherData] = useState({});
  const [weatherForecast, setWeatherForecast] = useState({});
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [insights, setInsights] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [tripDuration, setTripDuration] = useState(3);
  const [dailyTravelHours, setDailyTravelHours] = useState(6);
  const [budgetBreakdown, setBudgetBreakdown] = useState(null);
  const [multiDayPlan, setMultiDayPlan] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [tripName, setTripName] = useState('');
  const [savedTrips, setSavedTrips] = useState([]);
  const mapRef = useRef(null);

  // Filter destinations based on search and category
  const filteredDestinations = availableDestinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dest.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dest.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || dest.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Load saved trips from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('travelscout_trips');
    if (saved) {
      setSavedTrips(JSON.parse(saved));
    }
  }, []);

  // Fetch destinations from backend
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/featured`);
        setAvailableDestinations(response.data.data || response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching destinations:', error);
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  // Fetch weather data for a destination (using WeatherAPI.com)
  const getWeatherData = async (lat, lon, name) => {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${lat},${lon}`
      );
      return {
        temp: Math.round(response.data.current.temp_c),
        condition: response.data.current.condition.text.toLowerCase(),
        description: response.data.current.condition.text,
        humidity: response.data.current.humidity,
        windSpeed: response.data.current.wind_kph / 3.6, // Convert kph to m/s
      };
    } catch (error) {
      console.error(`Error fetching weather for ${name}:`, error);
      return {
        temp: 'N/A',
        condition: 'unknown',
        description: 'Weather data unavailable',
        humidity: 0,
        windSpeed: 0,
      };
    }
  };

  // Fetch 7-day weather forecast (using WeatherAPI.com)
  const getWeatherForecast = async (lat, lon, name) => {
    try {
      const response = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${lat},${lon}&days=7`
      );
      
      // Map WeatherAPI.com forecast format
      const forecast = response.data.forecast.forecastday.map(day => ({
        date: new Date(day.date).toLocaleDateString('en-IN', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        }),
        minTemp: Math.round(day.day.mintemp_c),
        maxTemp: Math.round(day.day.maxtemp_c),
        avgTemp: Math.round(day.day.avgtemp_c),
        condition: day.day.condition.text.toLowerCase(),
        humidity: Math.round(day.day.avghumidity),
        windSpeed: (day.day.maxwind_kph / 3.6).toFixed(1), // Convert kph to m/s
        rain: day.day.totalprecip_mm.toFixed(1)
      }));

      return forecast;
    } catch (error) {
      console.error(`Error fetching forecast for ${name}:`, error);
      return [];
    }
  };

  // Add destination to trip
  const addDestination = (destination) => {
    if (!selectedDestinations.find(d => d.id === destination.id)) {
      setSelectedDestinations([...selectedDestinations, destination]);
    }
  };

  // Remove destination from trip
  const removeDestination = (id) => {
    setSelectedDestinations(selectedDestinations.filter(d => d.id !== id));
    setOptimizedRoute([]);
    setInsights(null);
  };

  // Optimize route and fetch weather
  const handleOptimizeTrip = async () => {
    if (selectedDestinations.length < 2) {
      alert('Please select at least 2 destinations to optimize route');
      return;
    }

    setOptimizing(true);

    // Optimize route
    const optimized = optimizeRoute(selectedDestinations);
    setOptimizedRoute(optimized);

    // Fetch current weather for all destinations
    const weatherPromises = optimized.map(dest =>
      getWeatherData(parseFloat(dest.latitude), parseFloat(dest.longitude), dest.name)
    );
    const weatherResults = await Promise.all(weatherPromises);

    // Fetch 7-day forecast for all destinations
    const forecastPromises = optimized.map(dest =>
      getWeatherForecast(parseFloat(dest.latitude), parseFloat(dest.longitude), dest.name)
    );
    const forecastResults = await Promise.all(forecastPromises);
    
    const weatherMap = {};
    const forecastMap = {};
    optimized.forEach((dest, index) => {
      weatherMap[dest.id] = weatherResults[index];
      forecastMap[dest.id] = forecastResults[index];
    });
    setWeatherData(weatherMap);
    setWeatherForecast(forecastMap);

    // Calculate insights
    const originalDistance = calculateTotalDistance(selectedDestinations);
    const optimizedDistance = calculateTotalDistance(optimized);
    const savedDistance = originalDistance - optimizedDistance;
    
    const mode = TRAVEL_MODES[travelMode];
    const totalCost = optimizedDistance * mode.costPerKm;
    const estimatedTime = optimizedDistance / mode.speed;
    const co2Emissions = optimizedDistance * mode.co2PerKm;
    
    const avgTemp = weatherResults.reduce((sum, w) => sum + (typeof w.temp === 'number' ? w.temp : 0), 0) / weatherResults.length;
    const badWeatherCount = weatherResults.filter(w => 
      w.condition.includes('rain') || w.condition.includes('storm')
    ).length;

    setInsights({
      totalDistance: optimizedDistance.toFixed(2),
      savedDistance: savedDistance.toFixed(2),
      estimatedTime: estimatedTime.toFixed(2),
      totalCost: totalCost.toFixed(2),
      co2Emissions: co2Emissions.toFixed(2),
      avgTemp: avgTemp.toFixed(1),
      badWeatherCount,
    });

    setOptimizing(false);
  };

  // Generate PDF report with detailed cost breakdown
  const generatePDFReport = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Helper function to check page overflow
    const checkPageOverflow = (requiredSpace = 30) => {
      if (yPosition > pageHeight - requiredSpace) {
        pdf.addPage();
        yPosition = 20;
      }
    };

    // Header with gradient effect (simulated with lines)
    pdf.setFillColor(30, 58, 138);
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.text('TravelScout Trip Report', pageWidth / 2, 20, { align: 'center' });
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Generated on ${new Date().toLocaleDateString('en-IN', { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    })}`, pageWidth / 2, 30, { align: 'center' });

    yPosition = 50;

    // Trip Overview Box
    pdf.setDrawColor(30, 58, 138);
    pdf.setLineWidth(0.5);
    pdf.roundedRect(15, yPosition, pageWidth - 30, 35, 3, 3, 'S');
    
    yPosition += 8;
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Trip Overview', 20, yPosition);
    
    yPosition += 8;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(60, 60, 60);
    
    const mode = TRAVEL_MODES[travelMode];
    const destinations = optimizedRoute.length;
    const days = Math.ceil(parseFloat(insights.estimatedTime) / 8);
    
    pdf.text(`Destinations: ${destinations} places`, 20, yPosition);
    pdf.text(`Mode: ${mode.name}`, 90, yPosition);
    pdf.text(`Duration: ${days} day(s)`, 140, yPosition);
    
    yPosition += 6;
    pdf.text(`Distance: ${insights.totalDistance} km`, 20, yPosition);
    pdf.text(`Time: ${insights.estimatedTime} hrs`, 90, yPosition);
    pdf.text(`Optimized: Yes`, 140, yPosition);

    // Cost Breakdown Section
    yPosition += 15;
    checkPageOverflow(80);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('Cost Breakdown', 20, yPosition);
    
    yPosition += 8;
    
    // Calculate detailed costs
    const distance = parseFloat(insights.totalDistance);
    const travelCost = distance * mode.costPerKm;
    const fuelCost = mode.name === 'Car' ? distance * 6 : 0;
    const accommodationCost = (days - 1) * 1500; // ₹1500 per night
    const foodCost = days * 3 * 250; // 3 meals × ₹250
    const entryCost = optimizedRoute.length * 200; // ₹200 avg entry fee
    const miscCost = days * 300; // ₹300 misc per day
    const totalCost = travelCost + fuelCost + accommodationCost + foodCost + entryCost + miscCost;

    // Cost table
    pdf.setDrawColor(200, 200, 200);
    pdf.setFillColor(245, 245, 245);
    
    const costItems = [
      { label: 'Travel Cost', value: travelCost, icon: mode.icon },
      { label: 'Fuel/Energy', value: fuelCost, icon: '⛽' },
      { label: 'Accommodation', value: accommodationCost, icon: '🏨' },
      { label: 'Food & Dining', value: foodCost, icon: '🍽️' },
      { label: 'Entry Tickets', value: entryCost, icon: '🎫' },
      { label: 'Miscellaneous', value: miscCost, icon: '💰' }
    ];

    costItems.forEach((item, index) => {
      if (index % 2 === 0) {
        pdf.rect(15, yPosition - 5, pageWidth - 30, 8, 'F');
      }
      
      pdf.setTextColor(60, 60, 60);
      pdf.setFontSize(10);
      pdf.text(`${item.icon} ${item.label}`, 20, yPosition);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Rs ${item.value.toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });
      pdf.setFont('helvetica', 'normal');
      yPosition += 8;
    });

    // Total cost
    yPosition += 3;
    pdf.setDrawColor(30, 58, 138);
    pdf.setLineWidth(0.8);
    pdf.line(15, yPosition - 3, pageWidth - 15, yPosition - 3);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(30, 58, 138);
    pdf.text('Total Estimated Cost', 20, yPosition);
    pdf.setTextColor(0, 128, 0);
    pdf.text(`Rs ${totalCost.toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });

    // Destinations Section
    yPosition += 15;
    checkPageOverflow(50);
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.text('Itinerary Details', 20, yPosition);
    
    yPosition += 8;
    
    optimizedRoute.forEach((dest, index) => {
      checkPageOverflow(35);
      
      // Destination box
      pdf.setDrawColor(220, 220, 220);
      pdf.setLineWidth(0.3);
      pdf.roundedRect(15, yPosition - 3, pageWidth - 30, 28, 2, 2, 'S');
      
      // Day badge
      pdf.setFillColor(30, 58, 138);
      pdf.circle(23, yPosition + 3, 4, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'bold');
      pdf.text(String(index + 1), 23, yPosition + 4.5, { align: 'center' });
      
      // Destination name
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(11);
      pdf.text(dest.name, 32, yPosition + 2);
      
      // Location
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text(dest.location, 32, yPosition + 8);
      
      // Rating
      if (dest.rating) {
        const stars = '⭐'.repeat(Math.floor(dest.rating));
        pdf.text(`${stars} ${dest.rating}/5`, 32, yPosition + 14);
      }
      
      // Weather info
      const weather = weatherData[dest.id];
      if (weather) {
        pdf.setFontSize(8);
        pdf.setTextColor(70, 130, 180);
        pdf.text(`Weather: ${weather.temp}°C, ${weather.description}`, 32, yPosition + 20);
      }
      
      // Distance from previous
      if (index > 0) {
        const distFromPrev = calculateDistance(
          parseFloat(optimizedRoute[index - 1].latitude),
          parseFloat(optimizedRoute[index - 1].longitude),
          parseFloat(dest.latitude),
          parseFloat(dest.longitude)
        );
        pdf.setTextColor(150, 150, 150);
        pdf.text(`${distFromPrev.toFixed(1)} km from previous`, pageWidth - 20, yPosition + 2, { align: 'right' });
      }
      
      yPosition += 32;
    });

    // Trip Statistics
    yPosition += 5;
    checkPageOverflow(60);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('Trip Statistics', 20, yPosition);
    
    yPosition += 10;
    
    // Stats boxes
    const stats = [
      { label: 'Distance Saved', value: `${insights.savedDistance} km`, color: [34, 197, 94] },
      { label: 'CO₂ Emissions', value: `${insights.co2Emissions} kg`, color: [234, 179, 8] },
      { label: 'Avg Temperature', value: `${insights.avgTemp}°C`, color: [59, 130, 246] },
      { label: 'Travel Speed', value: `${mode.speed} km/h`, color: [168, 85, 247] }
    ];

    const boxWidth = (pageWidth - 40) / 2;
    let xPos = 20;
    
    stats.forEach((stat, index) => {
      if (index === 2) {
        yPosition += 22;
        xPos = 20;
      }
      
      pdf.setFillColor(...stat.color);
      pdf.roundedRect(xPos, yPosition, boxWidth - 5, 18, 2, 2, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.text(stat.label, xPos + 3, yPosition + 6);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(stat.value, xPos + 3, yPosition + 14);
      
      xPos += boxWidth;
    });

    // Environmental Impact
    yPosition += 28;
    checkPageOverflow(40);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('Environmental Impact', 20, yPosition);
    
    yPosition += 8;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(60, 60, 60);
    
    const treesNeeded = (parseFloat(insights.co2Emissions) / 21).toFixed(1);
    pdf.text(`🌱 Carbon Footprint: ${insights.co2Emissions} kg CO₂`, 20, yPosition);
    yPosition += 6;
    pdf.text(`🌳 Trees needed to offset: ${treesNeeded} trees (annual absorption)`, 20, yPosition);
    yPosition += 6;
    pdf.text(`♻️  Travel mode efficiency: ${mode.co2PerKm} kg CO₂/km`, 20, yPosition);

    // Footer
    pdf.setDrawColor(30, 58, 138);
    pdf.setLineWidth(0.5);
    pdf.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);
    
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('Powered by TravelScout - Smart Tourism Planning', pageWidth / 2, pageHeight - 12, { align: 'center' });
    pdf.text(`Report ID: TS-${Date.now()}`, pageWidth / 2, pageHeight - 8, { align: 'center' });

    // Save PDF
    const fileName = `TravelScout_${optimizedRoute[0].name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  };

  // Get route coordinates for polyline
  const getRouteCoordinates = () => {
    return optimizedRoute.map(dest => [
      parseFloat(dest.latitude),
      parseFloat(dest.longitude)
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-10 px-6 shadow-2xl relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <Route className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-5xl font-bold tracking-tight">AI Trip Planner</h1>
                <p className="text-blue-100 mt-2 text-lg">Optimize your journey with intelligent route planning & real-time weather</p>
              </div>
            </div>
            
            {/* Quick stats badge */}
            {insights && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="hidden md:flex flex-col items-end space-y-1 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20"
              >
                <div className="text-3xl font-bold">₹{insights.totalCost}</div>
                <div className="text-sm text-blue-100">Total Trip Cost</div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Map Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map Container */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-200"
            >
              <div className="p-4 bg-gradient-to-r from-sky-600 to-blue-600 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-6 h-6" />
                    <h2 className="text-xl font-bold">Route Map</h2>
                  </div>
                  {optimizedRoute.length > 0 && (
                    <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                      {optimizedRoute.length} destinations
                    </span>
                  )}
                </div>
              </div>

              <div className="h-[500px] relative">
                <MapContainer
                  center={[20.5937, 78.9629]} // Center of India
                  zoom={5}
                  style={{ height: '100%', width: '100%' }}
                  ref={mapRef}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* Markers for optimized route */}
                  {optimizedRoute.map((dest, index) => (
                    <Marker
                      key={dest.id}
                      position={[parseFloat(dest.latitude), parseFloat(dest.longitude)]}
                    >
                      <Popup>
                        <div className="text-center">
                          <p className="font-bold text-lg">{index + 1}. {dest.name}</p>
                          <p className="text-sm text-gray-600">{dest.location}</p>
                          {weatherData[dest.id] && (
                            <p className="text-sm mt-1">
                              🌡️ {weatherData[dest.id].temp}°C
                            </p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  ))}

                  {/* Route polyline */}
                  {optimizedRoute.length > 1 && (
                    <Polyline
                      positions={getRouteCoordinates()}
                      color="#3b82f6"
                      weight={4}
                      opacity={0.7}
                    />
                  )}

                  {optimizedRoute.length > 0 && (
                    <MapBoundsHandler destinations={optimizedRoute} />
                  )}
                </MapContainer>

                {optimizedRoute.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 backdrop-blur-sm">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 text-lg font-medium">
                        Select destinations and optimize to see route
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Insights Dashboard */}
            {insights && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-200"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <BarChart className="w-6 h-6 text-primary-600" />
                    <h2 className="text-2xl font-bold text-gray-800">Trip Insights</h2>
                  </div>
                  <button
                    onClick={generatePDFReport}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download PDF</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Total Distance */}
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                          <Route className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-sm text-blue-100 font-medium">Distance</p>
                      </div>
                      <p className="text-3xl font-bold text-white mb-1">{insights.totalDistance} km</p>
                      {parseFloat(insights.savedDistance) > 0 && (
                        <div className="flex items-center space-x-1 text-green-200 text-xs bg-green-500/20 px-2 py-1 rounded-full w-fit">
                          <TrendingDown className="w-3 h-3" />
                          <span>Saved {insights.savedDistance} km</span>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Estimated Time */}
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-sm text-purple-100 font-medium">Travel Time</p>
                      </div>
                      <p className="text-3xl font-bold text-white mb-1">{insights.estimatedTime} hrs</p>
                      <p className="text-xs text-purple-200">
                        {Math.ceil(parseFloat(insights.estimatedTime) / 8)} day(s) • {TRAVEL_MODES[travelMode].speed} km/h
                      </p>
                    </div>
                  </motion.div>

                  {/* Total Cost */}
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                          <Wallet className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-sm text-green-100 font-medium">Trip Cost</p>
                      </div>
                      <p className="text-3xl font-bold text-white mb-1">₹{insights.totalCost}</p>
                      <p className="text-xs text-green-200">
                        ₹{TRAVEL_MODES[travelMode].costPerKm}/km • Travel only
                      </p>
                    </div>
                  </motion.div>

                  {/* CO2 Emissions */}
                  <motion.div 
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="bg-gradient-to-br from-amber-500 to-orange-600 p-5 rounded-2xl shadow-lg hover:shadow-xl transition-all relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                      <div className="flex items-center space-x-2 mb-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                          <Leaf className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-sm text-amber-100 font-medium">CO₂ Impact</p>
                      </div>
                      <p className="text-3xl font-bold text-white mb-1">{insights.co2Emissions} kg</p>
                      <p className="text-xs text-amber-200">
                        {(parseFloat(insights.co2Emissions) / 21).toFixed(1)} trees needed/year
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Cost Breakdown Section */}
                <div className="mt-6 bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border-2 border-indigo-200">
                  <div className="flex items-center space-x-2 mb-4">
                    <DollarSign className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-xl font-bold text-gray-800">Detailed Cost Breakdown</h3>
                  </div>
                  
                  {(() => {
                    const distance = parseFloat(insights.totalDistance);
                    const mode = TRAVEL_MODES[travelMode];
                    const days = Math.ceil(parseFloat(insights.estimatedTime) / 8);
                    const travelCost = distance * mode.costPerKm;
                    const fuelCost = mode.name === 'Car' ? distance * 6 : 0;
                    const accommodationCost = (days - 1) * 1500;
                    const foodCost = days * 3 * 250;
                    const entryCost = optimizedRoute.length * 200;
                    const miscCost = days * 300;
                    const totalCost = travelCost + fuelCost + accommodationCost + foodCost + entryCost + miscCost;

                    return (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100">
                          <div className="text-2xl mb-1">{mode.icon}</div>
                          <div className="text-xs text-gray-600">Travel</div>
                          <div className="text-lg font-bold text-gray-800">₹{travelCost.toFixed(0)}</div>
                        </div>
                        {fuelCost > 0 && (
                          <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100">
                            <div className="text-2xl mb-1">⛽</div>
                            <div className="text-xs text-gray-600">Fuel</div>
                            <div className="text-lg font-bold text-gray-800">₹{fuelCost.toFixed(0)}</div>
                          </div>
                        )}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100">
                          <div className="text-2xl mb-1">🏨</div>
                          <div className="text-xs text-gray-600">Hotels</div>
                          <div className="text-lg font-bold text-gray-800">₹{accommodationCost.toFixed(0)}</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100">
                          <div className="text-2xl mb-1">🍽️</div>
                          <div className="text-xs text-gray-600">Food</div>
                          <div className="text-lg font-bold text-gray-800">₹{foodCost.toFixed(0)}</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100">
                          <div className="text-2xl mb-1">🎫</div>
                          <div className="text-xs text-gray-600">Entry Fees</div>
                          <div className="text-lg font-bold text-gray-800">₹{entryCost.toFixed(0)}</div>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100">
                          <div className="text-2xl mb-1">💰</div>
                          <div className="text-xs text-gray-600">Misc</div>
                          <div className="text-lg font-bold text-gray-800">₹{miscCost.toFixed(0)}</div>
                        </div>
                      </div>
                    );
                  })()}
                  
                  <div className="mt-4 pt-4 border-t-2 border-indigo-300 flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-800">Grand Total</span>
                    <span className="text-3xl font-bold text-indigo-600">
                      ₹{(() => {
                        const distance = parseFloat(insights.totalDistance);
                        const mode = TRAVEL_MODES[travelMode];
                        const days = Math.ceil(parseFloat(insights.estimatedTime) / 8);
                        return (distance * mode.costPerKm + 
                                (mode.name === 'Car' ? distance * 6 : 0) + 
                                (days - 1) * 1500 + 
                                days * 3 * 250 + 
                                optimizedRoute.length * 200 + 
                                days * 300).toFixed(0);
                      })()}
                    </span>
                  </div>
                </div>

                {/* Weather Summary */}
                <div className="mt-6 bg-gradient-to-r from-sky-50 to-blue-50 p-4 rounded-xl border border-sky-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CloudSun className="w-5 h-5 text-sky-600" />
                      <p className="font-semibold text-gray-800">Weather Overview</p>
                    </div>
                    <p className="text-2xl font-bold text-sky-900">{insights.avgTemp}°C avg</p>
                  </div>
                  {insights.badWeatherCount > 0 && (
                    <div className="mt-3 flex items-start space-x-2 bg-red-50 p-3 rounded-lg border border-red-200">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-800">
                        <strong>Weather Alert:</strong> {insights.badWeatherCount} destination(s) have rain/storm. Consider rescheduling or alternate routes.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* 7-Day Weather Forecast */}
            {insights && Object.keys(weatherForecast).length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-200"
              >
                <div className="flex items-center space-x-2 mb-6">
                  <Calendar className="w-6 h-6 text-primary-600" />
                  <h2 className="text-2xl font-bold text-gray-800">7-Day Weather Forecast</h2>
                </div>

                <div className="space-y-6">
                  {optimizedRoute.map((dest, destIndex) => {
                    const forecast = weatherForecast[dest.id];
                    if (!forecast || forecast.length === 0) return null;

                    return (
                      <div key={dest.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                        <h3 className="font-bold text-gray-800 mb-3 flex items-center space-x-2">
                          <div className="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
                            {destIndex + 1}
                          </div>
                          <span>{dest.name}</span>
                        </h3>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
                          {forecast.map((day, dayIndex) => (
                            <div
                              key={dayIndex}
                              className="bg-gradient-to-br from-blue-50 to-sky-50 p-3 rounded-xl border border-blue-200"
                            >
                              <p className="text-xs font-semibold text-gray-700 mb-2">{day.date}</p>
                              <div className="flex justify-center mb-2">
                                <WeatherIcon condition={day.condition} size={32} />
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-bold text-gray-800">
                                  {day.maxTemp}° / {day.minTemp}°
                                </p>
                                <p className="text-xs text-gray-600 capitalize mt-1">{day.condition}</p>
                                <div className="mt-2 space-y-1 text-xs text-gray-600">
                                  <div className="flex items-center justify-between">
                                    <span>💧</span>
                                    <span>{day.humidity}%</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <Wind size={10} />
                                    <span>{day.windSpeed} m/s</span>
                                  </div>
                                  {parseFloat(day.rain) > 0 && (
                                    <div className="flex items-center justify-between text-blue-600 font-medium">
                                      <span>🌧️</span>
                                      <span>{day.rain}mm</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Side - Controls & Destinations */}
          <div className="space-y-6">
            {/* Travel Mode Selector */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-200"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <Navigation className="w-6 h-6 text-primary-600" />
                <span>Travel Mode</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(TRAVEL_MODES).map(([key, mode]) => (
                  <button
                    key={key}
                    onClick={() => setTravelMode(key)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      travelMode === key
                        ? 'border-primary-600 bg-primary-50 shadow-md'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-3xl mb-2">{mode.icon}</div>
                    <p className="font-semibold text-gray-800">{mode.name}</p>
                    <p className="text-xs text-gray-600 mt-1">₹{mode.costPerKm}/km</p>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Selected Destinations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                  <MapPin className="w-6 h-6 text-primary-600" />
                  <span>Your Trip ({selectedDestinations.length})</span>
                </h3>
                {selectedDestinations.length > 1 && (
                  <button
                    onClick={handleOptimizeTrip}
                    disabled={optimizing}
                    className="flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {optimizing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        <span>Optimizing...</span>
                      </>
                    ) : (
                      <>
                        <Route className="w-4 h-4" />
                        <span>Optimize</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {selectedDestinations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No destinations selected yet</p>
                  <p className="text-sm mt-1">Add destinations from below</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {(optimizedRoute.length > 0 ? optimizedRoute : selectedDestinations).map((dest, index) => (
                    <motion.div
                      key={dest.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200 relative"
                    >
                      <button
                        onClick={() => removeDestination(dest.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      
                      <div className="flex items-start space-x-3">
                        <div className="bg-primary-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-800">{dest.name}</p>
                          <p className="text-sm text-gray-600">{dest.location}</p>
                          
                          {weatherData[dest.id] && (
                            <div className="mt-2 flex items-center space-x-4 text-sm">
                              <div className="flex items-center space-x-1">
                                <WeatherIcon condition={weatherData[dest.id].condition} size={18} />
                                <span className="font-medium">{weatherData[dest.id].temp}°C</span>
                              </div>
                              <span className="text-gray-600 capitalize">{weatherData[dest.id].description}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Available Destinations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-200"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <Plus className="w-6 h-6 text-primary-600" />
                <span>Add Destinations</span>
              </h3>

              {/* Search and Filter */}
              <div className="space-y-3 mb-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded-xl focus:border-primary-600 focus:outline-none transition-colors"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                  {['All', 'Historical', 'Beach', 'Hill Station', 'Wildlife', 'Religious', 'Adventure'].map(category => (
                    <button
                      key={category}
                      onClick={() => setCategoryFilter(category)}
                      className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                        categoryFilter === category
                          ? 'bg-primary-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <p className="text-sm text-gray-600">
                  Showing {filteredDestinations.length} of {availableDestinations.length} destinations
                </p>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent mx-auto" />
                  <p className="text-gray-600 mt-3">Loading destinations...</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto">
                  {filteredDestinations.map((dest) => {
                    const isSelected = selectedDestinations.find(d => d.id === dest.id);
                    return (
                      <motion.button
                        key={dest.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => addDestination(dest)}
                        disabled={isSelected}
                        className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                          isSelected
                            ? 'border-green-500 bg-green-50 cursor-not-allowed'
                            : 'border-gray-200 hover:border-primary-400 hover:bg-primary-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800">{dest.name}</p>
                            <p className="text-sm text-gray-600">{dest.location}</p>
                            {dest.rating && (
                              <div className="flex items-center space-x-1 mt-1">
                                <span className="text-amber-500">⭐</span>
                                <span className="text-sm font-medium">{dest.rating}</span>
                              </div>
                            )}
                          </div>
                          {isSelected && (
                            <div className="text-green-600 font-bold text-sm">✓ Added</div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripPlanner;
