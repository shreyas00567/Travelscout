# 🗺️ TravelScout AI Trip Planner

## Overview

Advanced Trip Planner with AI-powered route optimization, real-time weather integration, cost estimation, and PDF report generation.

## ✨ Features

### 1️⃣ AI Route Optimization
- **Nearest Neighbor Algorithm**: Automatically calculates the shortest route through all selected destinations
- **Visual Route Display**: Interactive map shows optimized path with polylines
- **Distance Savings**: Displays how many kilometers were saved compared to original order
- **Step-by-step Navigation**: Numbered markers show optimal visit sequence

### 2️⃣ Weather-Aware Planning
- **Live Weather Data**: Fetches current temperature, conditions, and forecasts from OpenWeatherMap API
- **Weather Icons**: Visual indicators (☀️ 🌧️ ❄️ ☁️) for each destination
- **Bad Weather Alerts**: Automatic warnings for rain, storms, or poor conditions
- **Average Temperature**: Shows overall trip weather summary

### 3️⃣ Dynamic Cost Estimator
- **Multiple Travel Modes**:
  - 🚗 Car: ₹8/km @ 60 km/h
  - 🏍️ Bike: ₹3/km @ 40 km/h
  - 🚌 Bus: ₹2/km @ 50 km/h
  - 🚆 Train: ₹4/km @ 80 km/h
- **Real-time Cost Calculation**: Updates automatically based on distance and mode
- **Cost Breakdown**: Shows per-kilometer rates and total expenses

### 4️⃣ Trip Insights Dashboard
Comprehensive analytics including:
- **Total Distance**: Sum of all route segments
- **Estimated Time**: Based on selected travel mode speed
- **Total Cost**: Calculated from distance × mode cost
- **CO₂ Emissions**: Environmental impact estimate (0.04-0.12 kg/km)
- **Weather Overview**: Average temperature and bad weather alerts
- **Distance Saved**: Optimization benefits highlighted

### 5️⃣ Auto PDF Report Generator
Professional trip reports with:
- TravelScout branding and logo
- Trip summary (mode, distance, time, cost, CO₂)
- Destination list with weather info
- Environmental impact analysis
- Generated with jsPDF and formatted beautifully

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI framework
- **Vite 5.0** - Build tool with HMR
- **TailwindCSS 3.3.5** - Styling
- **Framer Motion 10.16.4** - Animations
- **Leaflet 1.9.4** - Interactive maps
- **React-Leaflet 4.2.1** - React bindings for Leaflet
- **Axios 1.6.2** - API requests
- **jsPDF 2.5.2** - PDF generation
- **html2canvas 1.4.1** - Screenshot capture
- **Lucide-React** - Icons

### Backend
- **Node.js + Express** - REST API
- **MySQL 8.x** - Database
- **OpenWeatherMap API** - Weather data

## 📦 Installation

### 1. Install Dependencies

```bash
cd frontend
npm install leaflet react-leaflet@4.2.1 jspdf html2canvas --legacy-peer-deps
```

### 2. Setup Environment Variables

Create `.env` file in `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000
VITE_WEATHER_API_KEY=your_openweather_api_key
```

**Get Free API Key**: https://openweathermap.org/api

### 3. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

## 🎯 How to Use

### Step 1: Select Travel Mode
Choose your preferred mode of transportation (Car, Bike, Bus, or Train)

### Step 2: Add Destinations
Click destinations from the "Add Destinations" list to add them to your trip

### Step 3: Optimize Route
Click "Optimize" button to:
- Calculate shortest route
- Fetch live weather for each location
- Generate trip insights

### Step 4: Review Insights
Check the Trip Insights Dashboard for:
- Total distance and time
- Cost breakdown
- Weather conditions
- Environmental impact

### Step 5: Download Report
Click "Download PDF" to generate a professional trip report

## 🧮 Algorithm Details

### Haversine Distance Formula

```javascript
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};
```

### Nearest Neighbor Route Optimization

```javascript
const optimizeRoute = (destinations) => {
  const unvisited = [...destinations];
  const optimized = [unvisited.shift()]; // Start with first

  while (unvisited.length > 0) {
    const current = optimized[optimized.length - 1];
    let nearestIndex = 0;
    let minDistance = Infinity;

    // Find nearest unvisited destination
    unvisited.forEach((dest, index) => {
      const distance = calculateDistance(
        current.latitude, current.longitude,
        dest.latitude, dest.longitude
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = index;
      }
    });

    // Add nearest to route
    optimized.push(unvisited.splice(nearestIndex, 1)[0]);
  }

  return optimized;
};
```

### Weather API Integration

```javascript
const getWeatherData = async (lat, lon, name) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather`,
      {
        params: {
          lat: lat,
          lon: lon,
          appid: WEATHER_API_KEY,
          units: 'metric'
        }
      }
    );
    
    return {
      temp: Math.round(response.data.main.temp),
      condition: response.data.weather[0].main.toLowerCase(),
      description: response.data.weather[0].description,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
    };
  } catch (error) {
    console.error(`Weather fetch error for ${name}:`, error);
    return {
      temp: 'N/A',
      condition: 'unknown',
      description: 'Weather unavailable'
    };
  }
};
```

### Cost Calculation Logic

```javascript
const TRAVEL_MODES = {
  car: { costPerKm: 8, speed: 60, co2PerKm: 0.12 },
  bike: { costPerKm: 3, speed: 40, co2PerKm: 0.08 },
  bus: { costPerKm: 2, speed: 50, co2PerKm: 0.05 },
  train: { costPerKm: 4, speed: 80, co2PerKm: 0.04 },
};

// Calculate totals
const totalCost = optimizedDistance * TRAVEL_MODES[travelMode].costPerKm;
const estimatedTime = optimizedDistance / TRAVEL_MODES[travelMode].speed;
const co2Emissions = optimizedDistance * TRAVEL_MODES[travelMode].co2PerKm;
```

## 📊 Insights Structure

```javascript
const insights = {
  totalDistance: "245.80 km",
  savedDistance: "23.45 km",
  estimatedTime: "4.10 hours",
  totalCost: "₹1966.40",
  co2Emissions: "29.50 kg",
  avgTemp: "28.5°C",
  badWeatherCount: 1, // Number of destinations with bad weather
};
```

## 🎨 Design Features

### Color Palette
- **Primary**: Sky Blue (#0ea5e9) to Blue (#3b82f6)
- **Accents**: Navy (#1e3a8a), White, Gray tones
- **Semantic Colors**: 
  - Green for cost/savings
  - Purple for time
  - Amber for emissions
  - Red for weather alerts

### Layout
- **Split View**: Map (left 2/3) + Controls (right 1/3)
- **Responsive**: Works on mobile, tablet, and desktop
- **Animations**: Smooth Framer Motion transitions
- **Professional**: Clean, modern, presentation-ready design

### Icons
- MapPin, Route, CloudSun, Wallet, BarChart, Download
- Plus, X, Navigation, AlertCircle, Leaf, Clock
- Weather icons: Sun, Cloud, CloudRain, CloudSnow, Wind

## 🚀 Advanced Features

### Map Features
- **Interactive Markers**: Click to see destination details
- **Route Polyline**: Visual path between destinations
- **Auto-fit Bounds**: Map automatically adjusts to show all locations
- **Zoom Controls**: Standard Leaflet navigation

### Weather Intelligence
- **Bad Weather Detection**: Automatically flags rain/storm
- **Alternative Suggestions**: Recommends rescheduling poor weather destinations
- **Weather Icons**: Visual condition indicators
- **Temperature Display**: Celsius by default

### PDF Export
- **Professional Layout**: Clean formatting with TravelScout branding
- **Comprehensive Data**: All trip details included
- **Environmental Section**: CO₂ impact analysis
- **Weather Info**: Temperature and conditions for each stop

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (single column)
- **Tablet**: 768px - 1024px (adjusted grid)
- **Desktop**: > 1024px (full split layout)

## ⚡ Performance Optimizations

- **Lazy Loading**: Map tiles load on demand
- **Debounced Weather Calls**: Prevents API rate limits
- **Optimized Re-renders**: React memo where appropriate
- **Efficient Distance Calculations**: Haversine formula (O(n²) for n destinations)

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_URL` | Backend API endpoint | Yes |
| `VITE_WEATHER_API_KEY` | OpenWeatherMap API key | Yes |

## 🐛 Troubleshooting

### Map Not Loading
- Check Leaflet CSS is imported
- Verify internet connection for tile loading
- Ensure coordinates are valid numbers

### Weather Not Showing
- Confirm `VITE_WEATHER_API_KEY` is set correctly
- Check OpenWeatherMap API quota (60 calls/minute free tier)
- Verify lat/lon values are valid

### PDF Generation Issues
- Allow popup windows in browser
- Check if jsPDF and html2canvas are installed
- Ensure insights data is populated before generating

### Route Not Optimizing
- Select at least 2 destinations
- Check browser console for errors
- Verify destination data has valid coordinates

## 📄 API Endpoints Used

### Backend (TravelScout)
```
GET /api/featured - Fetch all destinations
```

### External APIs
```
GET https://api.openweathermap.org/data/2.5/weather
  ?lat={lat}&lon={lon}&appid={key}&units=metric
```

## 🎓 Learning Resources

- **Leaflet Docs**: https://leafletjs.com/
- **OpenWeatherMap API**: https://openweathermap.org/api
- **jsPDF Documentation**: https://github.com/parallax/jsPDF
- **Traveling Salesman Problem**: https://en.wikipedia.org/wiki/Travelling_salesman_problem
- **Haversine Formula**: https://en.wikipedia.org/wiki/Haversine_formula

## 📝 License

MIT License - Feel free to use for your projects!

## 👨‍💻 Author

TravelScout Team - Intelligent Tourism Database

---

**Need Help?** Open an issue or contact support!
