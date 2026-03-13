# 🌍 TravelScout: Intelligent Tourism Database

A modern, full-stack travel discovery application with location-based recommendations, built with React, Node.js, Express, and MySQL.

![TravelScout Banner](https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2835&auto=format&fit=crop)

## ✨ Features

- 🎨 **Modern UI Design**: Professional travel-company level design with TailwindCSS
- 🎬 **Smooth Animations**: Framer Motion for delightful user interactions
- 📍 **Location-Based Discovery**: Find destinations based on proximity
- 🗃️ **MySQL Database**: Robust data storage with spatial queries
- 🚀 **REST API**: Clean Express.js backend with multiple endpoints
- 📱 **Fully Responsive**: Works seamlessly on all devices
- ⭐ **Featured Destinations**: Handpicked popular travel spots
- 🔍 **Smart Search**: Category-based filtering and discovery

## 🛠️ Tech Stack

### Frontend
- ⚛️ React 18
- ⚡ Vite
- 🎨 TailwindCSS
- 🎬 Framer Motion
- 🔌 Axios
- 🎯 Lucide React Icons

### Backend
- 🟢 Node.js
- 🚂 Express.js
- 🗄️ MySQL 2
- 🔐 CORS
- 📦 dotenv

## 📁 Project Structure

```
travelscout/
├── frontend/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── HomePage.jsx  # Main homepage component
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── backend/                   # Node.js + Express backend
    ├── config/
    │   └── database.js        # MySQL connection pool
    ├── database/
    │   └── schema.sql         # Database schema & sample data
    ├── server.js              # Main server file with API routes
    ├── package.json
    ├── .env.example
    └── .gitignore
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL Server (v8 or higher)
- npm or yarn package manager

### 1️⃣ Database Setup

1. Start your MySQL server

2. Open MySQL command line or workbench:
```bash
mysql -u root -p
```

3. Run the schema file:
```sql
source backend/database/schema.sql
```

Or copy and paste the contents of `backend/database/schema.sql` into your MySQL client.

### 2️⃣ Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from example:
```bash
cp .env.example .env
```

4. Update `.env` with your database credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=travelscout_db
DB_PORT=3306
PORT=5000
```

5. Start the backend server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will start at `http://localhost:5000`

### 3️⃣ Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## 📡 API Endpoints

### Base URL: `http://localhost:5000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/featured` | Get all featured destinations |
| GET | `/api/destinations` | Get all destinations with filters |
| GET | `/api/destinations/:id` | Get single destination by ID |
| GET | `/api/nearby/:lat/:lng` | Get nearby destinations (radius in query) |
| GET | `/api/categories` | Get all unique categories |

### Example Requests

**Get Featured Destinations:**
```bash
GET http://localhost:5000/api/featured
```

**Get Nearby Destinations:**
```bash
GET http://localhost:5000/api/nearby/25.0804/55.1447?radius=100
```

**Get Destinations by Category:**
```bash
GET http://localhost:5000/api/destinations?category=Beach%20%26%20Island&limit=5
```

## 🎨 Design Features

### Color Theme
- **Primary**: Sky blue (#0ea5e9)
- **Accent**: Gold (#f59e0b)
- **Dark**: Navy (#1e293b)
- **Light**: White & Soft Gray

### Key Components

1. **Sticky Navbar**
   - Logo with globe icon
   - Navigation links (Home, Explore, Nearby, About, Contact)
   - Transparent to solid transition on scroll
   - Mobile responsive menu

2. **Hero Section**
   - Full-width scenic background
   - Gradient overlay
   - Animated tagline
   - Call-to-action buttons
   - Scroll indicator

3. **Featured Destinations**
   - Responsive grid layout (1-3 columns)
   - Hover animations
   - Star ratings
   - Location pins
   - Smooth transitions

## 🗄️ Database Schema

### featured_destinations Table

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key |
| name | VARCHAR(255) | Destination name |
| description | TEXT | Detailed description |
| location | VARCHAR(255) | Location string |
| image_url | VARCHAR(500) | Image URL |
| rating | DECIMAL(3,2) | Rating (0-5) |
| latitude | DECIMAL(10,8) | Latitude coordinate |
| longitude | DECIMAL(11,8) | Longitude coordinate |
| category | VARCHAR(100) | Category type |
| is_active | BOOLEAN | Active status |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Update timestamp |

## 🔧 Configuration

### Frontend (vite.config.js)
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
})
```

### Backend (server.js)
```javascript
const PORT = process.env.PORT || 5000;
```

## 📸 Screenshots

The application features:
- Scenic hero section with parallax effect
- Smooth animations on scroll
- Premium card designs for destinations
- Responsive navigation
- Professional color scheme

## 🚧 Development

### Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## 📦 Production Build

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

The build output will be in `frontend/dist/`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Images from [Unsplash](https://unsplash.com)
- Icons from [Lucide](https://lucide.dev)
- Fonts from [Google Fonts](https://fonts.google.com)

## 📞 Support

For issues or questions, please open an issue in the repository.

---

**Built with ❤️ using React, Node.js, Express, and MySQL**

**Tagline:** *Discover Your World Intelligently* 🌍✨
