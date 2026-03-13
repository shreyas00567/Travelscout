-- ==========================================
-- TravelScout Database Schema
-- Intelligent Tourism Database with Location-Based Discovery
-- ==========================================

-- Create Database
CREATE DATABASE IF NOT EXISTS travelscout_db;
USE travelscout_db;

-- ==========================================
-- Table: featured_destinations
-- Stores information about featured travel destinations
-- ==========================================

CREATE TABLE IF NOT EXISTS featured_destinations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  location VARCHAR(255) NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  rating DECIMAL(3,2) DEFAULT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  category VARCHAR(100) DEFAULT 'General',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_location (latitude, longitude),
  INDEX idx_rating (rating),
  INDEX idx_category (category),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- Sample Data for featured_destinations - INDIA ONLY
-- ==========================================

-- Clear existing data safely
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE featured_destinations;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO featured_destinations (name, description, location, image_url, rating, latitude, longitude, category) VALUES
-- North India
(
  'Taj Mahal',
  'One of the Seven Wonders of the World, this white marble mausoleum is a symbol of eternal love. Marvel at its stunning Mughal architecture and intricate inlay work.',
  'Agra, Uttar Pradesh',
  'https://images.pexels.com/photos/1603650/pexels-photo-1603650.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  4.9,
  27.1751,
  78.0421,
  'Historical & Cultural'
),
(
  'Jaipur - Pink City',
  'Explore magnificent forts, palaces, and vibrant bazaars in the capital of Rajasthan. Known for its pink-hued buildings, rich culture, and royal heritage.',
  'Jaipur, Rajasthan',
  'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2940&auto=format&fit=crop',
  4.8,
  26.9124,
  75.7873,
  'Historical & Cultural'
),
(
  'Varanasi Ghats',
  'Experience the spiritual heart of India along the sacred Ganges River. Witness ancient rituals, sunrise boat rides, and the eternal essence of Indian spirituality.',
  'Varanasi, Uttar Pradesh',
  'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=2940&auto=format&fit=crop',
  4.7,
  25.3176,
  82.9739,
  'Spiritual & Religious'
),
(
  'Golden Temple',
  'The holiest shrine of Sikhism, this stunning golden temple surrounded by sacred water offers peace, spirituality, and the world-famous free community kitchen.',
  'Amritsar, Punjab',
  'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  4.9,
  31.6200,
  74.8765,
  'Spiritual & Religious'
),
(
  'Leh-Ladakh',
  'Discover the stunning landscapes of high-altitude desert, pristine lakes, ancient monasteries, and adventurous mountain passes in the Himalayas.',
  'Leh, Ladakh',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2940&auto=format&fit=crop',
  4.8,
  34.1526,
  77.5771,
  'Nature & Adventure'
),
(
  'Kashmir Valley',
  'Paradise on Earth with snow-capped mountains, beautiful houseboats, Mughal gardens, and serene Dal Lake. Perfect for honeymooners and nature lovers.',
  'Srinagar, Jammu & Kashmir',
  'https://images.unsplash.com/photo-1615497001839-b0a0eac3274c?q=80&w=2940&auto=format&fit=crop',
  4.9,
  34.0837,
  74.7973,
  'Nature & Adventure'
),
(
  'Manali Hill Station',
  'Popular mountain resort with adventure activities, ancient temples, scenic valleys, and snow-covered peaks. Perfect for trekking and skiing.',
  'Manali, Himachal Pradesh',
  'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2940&auto=format&fit=crop',
  4.7,
  32.2396,
  77.1887,
  'Nature & Adventure'
),
-- West India - Maharashtra (Extensive Coverage)
(
  'Gateway of India',
  'Iconic monument in Mumbai, built during British Raj. Starting point for most Mumbai tours, overlooking the Arabian Sea with stunning colonial architecture.',
  'Mumbai, Maharashtra',
  'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  4.6,
  18.9220,
  72.8347,
  'Historical & Cultural'
),
(
  'Marine Drive Mumbai',
  'Queen''s Necklace - iconic 3.6 km boulevard along Arabian Sea. Perfect for evening walks, stunning sunset views, and Mumbai''s vibrant nightlife.',
  'Mumbai, Maharashtra',
  'https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?q=80&w=2940&auto=format&fit=crop',
  4.7,
  18.9432,
  72.8236,
  'Urban & Modern'
),
(
  'Chhatrapati Shivaji Terminus',
  'UNESCO World Heritage Site, stunning Victorian Gothic architecture, and one of India''s busiest railway stations. A masterpiece of colonial-era design.',
  'Mumbai, Maharashtra',
  'https://images.unsplash.com/photo-1595436080619-dc83aa7e97a3?q=80&w=2940&auto=format&fit=crop',
  4.6,
  18.9398,
  72.8355,
  'Historical & Cultural'
),
(
  'Elephanta Caves',
  'UNESCO World Heritage Site on Elephanta Island with magnificent rock-cut cave temples dedicated to Lord Shiva. Ancient sculptures from 5th-8th century.',
  'Mumbai, Maharashtra',
  'https://images.unsplash.com/photo-1609137186974-d2715fb86ced?q=80&w=2940&auto=format&fit=crop',
  4.5,
  18.9633,
  72.9315,
  'Historical & Cultural'
),
(
  'Lonavala Hill Station',
  'Popular monsoon destination with lush green valleys, waterfalls, caves, and stunning viewpoints. Famous for chikki (sweet) and scenic landscapes.',
  'Lonavala, Maharashtra',
  'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2940&auto=format&fit=crop',
  4.6,
  18.7537,
  73.4086,
  'Nature & Adventure'
),
(
  'Ajanta Caves',
  'UNESCO World Heritage Site with 30 rock-cut Buddhist cave monuments dating from 2nd century BCE. Stunning ancient paintings and sculptures.',
  'Aurangabad, Maharashtra',
  'https://images.pexels.com/photos/14807345/pexels-photo-14807345.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  4.8,
  20.5517,
  75.7033,
  'Historical & Cultural'
),
(
  'Ellora Caves',
  'UNESCO World Heritage Site featuring 34 monasteries and temples carved side-by-side. Stunning example of ancient Indian rock-cut architecture.',
  'Aurangabad, Maharashtra',
  'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  4.8,
  20.0269,
  75.1791,
  'Historical & Cultural'
),
(
  'Bibi Ka Maqbara',
  'Mini Taj Mahal of Deccan, beautiful Mughal-era mausoleum built in 1660. Stunning marble architecture with gardens and intricate design.',
  'Aurangabad, Maharashtra',
  'https://images.pexels.com/photos/19734532/pexels-photo-19734532.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  4.5,
  19.9016,
  75.3315,
  'Historical & Cultural'
),
(
  'Mahabaleshwar Hill Station',
  'Queen of Hill Stations with strawberry farms, pristine viewpoints, waterfalls, and pleasant weather. Perfect weekend getaway from Mumbai and Pune.',
  'Mahabaleshwar, Maharashtra',
  'https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=2940&auto=format&fit=crop',
  4.7,
  17.9244,
  73.6577,
  'Nature & Adventure'
),
(
  'Panchgani Hill Station',
  'Charming hill station near Mahabaleshwar with table land, colonial architecture, boarding schools, and scenic valley views.',
  'Panchgani, Maharashtra',
  'https://images.unsplash.com/photo-1571126270712-3a6be6d00d1b?q=80&w=2940&auto=format&fit=crop',
  4.6,
  17.9244,
  73.8018,
  'Nature & Adventure'
),
(
  'Shirdi Sai Baba Temple',
  'Sacred pilgrimage site dedicated to Sai Baba. Attracts millions of devotees annually seeking blessings and spiritual peace.',
  'Shirdi, Maharashtra',
  'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=2940&auto=format&fit=crop',
  4.8,
  19.7645,
  74.4777,
  'Spiritual & Religious'
),
(
  'Shaniwar Wada Fort',
  'Historic fortification and palace of Peshwas in Pune. Famous for light and sound show depicting Maratha history and architecture.',
  'Pune, Maharashtra',
  'https://images.pexels.com/photos/12211543/pexels-photo-12211543.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  4.7,
  18.5195,
  73.8553,
  'Historical & Cultural'
),
(
  'Aga Khan Palace Pune',
  'Historic palace with beautiful architecture and Mahatma Gandhi memorial. Important landmark in India''s freedom struggle.',
  'Pune, Maharashtra',
  'https://images.pexels.com/photos/9544443/pexels-photo-9544443.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  4.6,
  18.5521,
  73.8990,
  'Historical & Cultural'
),
(
  'Sinhagad Fort Pune',
  'Historic hill fortress with Maratha legacy, trekking trails, and panoramic views. Popular weekend destination for adventure enthusiasts.',
  'Pune, Maharashtra',
  'https://images.pexels.com/photos/18955212/pexels-photo-18955212.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  4.7,
  18.3664,
  73.7556,
  'Historical & Cultural'
),
(
  'Osho Ashram Pune',
  'International meditation resort with beautiful gardens, meditation halls, and serene atmosphere. Popular spiritual and wellness destination.',
  'Pune, Maharashtra',
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2940&auto=format&fit=crop',
  4.5,
  18.5432,
  73.8977,
  'Spiritual & Religious'
),
(
  'Pune Okayama Friendship Garden',
  'Beautiful Japanese garden with pagodas, stone lanterns, bamboo groves, and koi ponds. Perfect peaceful retreat in the city.',
  'Pune, Maharashtra',
  'https://images.unsplash.com/photo-1580477667995-2b94f01c9516?q=80&w=2940&auto=format&fit=crop',
  4.6,
  18.5279,
  73.8832,
  'Nature & Adventure'
),
(
  'Dagdusheth Halwai Ganpati Temple',
  'Famous Ganesh temple in Pune with rich gold decorations. One of the most revered temples attracting thousands of devotees daily.',
  'Pune, Maharashtra',
  'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=2940&auto=format&fit=crop',
  4.8,
  18.5177,
  73.8562,
  'Spiritual & Religious'
),
(
  'Parvati Hill Temple',
  'Historic hilltop temple complex with panoramic city views. 108 steps lead to beautiful temples and Pune''s best viewpoint.',
  'Pune, Maharashtra',
  'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2940&auto=format&fit=crop',
  4.6,
  18.5018,
  73.8636,
  'Spiritual & Religious'
),
(
  'Rajgad Fort',
  'Historic Maratha fort, former capital of Chhatrapati Shivaji Maharaj. Popular trekking destination with stunning valley views.',
  'Pune, Maharashtra',
  'https://images.pexels.com/photos/15707162/pexels-photo-15707162.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  4.7,
  18.2455,
  73.6782,
  'Historical & Cultural'
),
(
  'Pashan Lake',
  'Serene artificial lake surrounded by hills. Perfect for bird watching, evening walks, and peaceful picnics near Pune city.',
  'Pune, Maharashtra',
  'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2940&auto=format&fit=crop',
  4.5,
  18.5362,
  73.7937,
  'Nature & Adventure'
),
(
  'Pune University Campus',
  'One of India''s most beautiful university campuses with heritage buildings, lush gardens, and colonial architecture.',
  'Pune, Maharashtra',
  'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2940&auto=format&fit=crop',
  4.7,
  18.5089,
  73.8067,
  'Urban & Modern'
),
(
  'Khadakwasla Dam',
  'Scenic dam and reservoir surrounded by hills. Popular picnic spot with water sports, boating, and beautiful sunset views.',
  'Pune, Maharashtra',
  'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2940&auto=format&fit=crop',
  4.6,
  18.4407,
  73.7605,
  'Nature & Adventure'
),
(
  'Lavasa Hill City',
  'Planned hill city with Italian-style architecture, lakeside promenades, adventure sports, and weekend resort facilities.',
  'Pune, Maharashtra',
  'https://images.unsplash.com/photo-1523731407965-2430cd12f5e4?q=80&w=2940&auto=format&fit=crop',
  4.5,
  18.4083,
  73.5084,
  'Urban & Modern'
),
(
  'Mulshi Lake and Dam',
  'Picturesque lake surrounded by Sahyadri mountains. Perfect for camping, trekking, and enjoying monsoon greenery.',
  'Pune, Maharashtra',
  'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2940&auto=format&fit=crop',
  4.7,
  18.5267,
  73.4948,
  'Nature & Adventure'
),
(
  'Torna Fort',
  'First fort captured by Chhatrapati Shivaji Maharaj. Challenging trek with historical significance and panoramic Sahyadri views.',
  'Pune, Maharashtra',
  'https://images.pexels.com/photos/13992484/pexels-photo-13992484.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  4.6,
  18.3004,
  73.5158,
  'Historical & Cultural'
),
(
  'Katraj Snake Park',
  'Reptile park and zoo with extensive snake collection, crocodiles, and wildlife. Educational and entertaining for families.',
  'Pune, Maharashtra',
  'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?q=80&w=2940&auto=format&fit=crop',
  4.4,
  18.4484,
  73.8648,
  'Wildlife & Nature'
),
(
  'Phoenix Marketcity Pune',
  'Modern shopping mall with entertainment, dining, and retail brands. Popular hangout spot for shopping and movies.',
  'Pune, Maharashtra',
  'https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?q=80&w=2940&auto=format&fit=crop',
  4.5,
  18.5597,
  73.7712,
  'Urban & Modern'
),
(
  'Tribal Museum Pune',
  'Museum showcasing tribal culture, artifacts, lifestyle, and traditions of Maharashtra and India. Educational cultural experience.',
  'Pune, Maharashtra',
  'https://images.unsplash.com/photo-1566127444979-b3d2b64d6b66?q=80&w=2940&auto=format&fit=crop',
  4.3,
  18.5244,
  73.8566,
  'Historical & Cultural'
),
(
  'Pune FC Road',
  'Famous food street with diverse restaurants, cafes, street food stalls, and vibrant nightlife. Food lover''s paradise.',
  'Pune, Maharashtra',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2940&auto=format&fit=crop',
  4.6,
  18.5314,
  73.8446,
  'Urban & Modern'
),
(
  'Vetal Tekdi',
  'Popular hilltop in Pune city for morning walks, jogging, and panoramic city views. Perfect for fitness enthusiasts and nature lovers.',
  'Pune, Maharashtra',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2940&auto=format&fit=crop',
  4.5,
  18.5204,
  73.8267,
  'Nature & Adventure'
),
(
  'Alibaug Beach',
  'Coastal town with pristine beaches, historic forts, water sports, and weekend getaway from Mumbai. Famous for seafood and beach resorts.',
  'Alibaug, Maharashtra',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2940&auto=format&fit=crop',
  4.5,
  18.6414,
  72.8722,
  'Beach & Island'
),
(
  'Kashid Beach',
  'Pristine white sand beach with clear blue waters, coconut and betel nut trees. Perfect for peaceful beach vacation near Alibaug.',
  'Kashid, Maharashtra',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2940&auto=format&fit=crop',
  4.6,
  18.4038,
  72.9914,
  'Beach & Island'
),
(
  'Kolhapur Mahalaxmi Temple',
  'Ancient temple dedicated to Goddess Mahalaxmi, one of the Shakti Peethas. Rich cultural heritage and traditional Kolhapuri cuisine.',
  'Kolhapur, Maharashtra',
  'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?q=80&w=2940&auto=format&fit=crop',
  4.7,
  16.6952,
  74.2329,
  'Spiritual & Religious'
),
(
  'Matheran Hill Station',
  'Asia''s only automobile-free hill station. Toy train ride, colonial architecture, stunning viewpoints, and pollution-free environment.',
  'Matheran, Maharashtra',
  'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2940&auto=format&fit=crop',
  4.6,
  18.9846,
  73.2663,
  'Nature & Adventure'
),
(
  'Tadoba National Park',
  'Maharashtra''s oldest and largest national park. Premier tiger reserve with rich biodiversity, jungle safaris, and wildlife photography.',
  'Chandrapur, Maharashtra',
  'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?q=80&w=2940&auto=format&fit=crop',
  4.7,
  20.2304,
  79.3298,
  'Wildlife & Nature'
),
(
  'Pratapgad Fort',
  'Historic Maratha fort with stunning architecture and Shivaji Maharaj''s legacy. Scenic location with valley views and trekking trails.',
  'Satara, Maharashtra',
  'https://images.unsplash.com/photo-1571126270712-3a6be6d00d1b?q=80&w=2940&auto=format&fit=crop',
  4.6,
  17.9473,
  73.5613,
  'Historical & Cultural'
),
(
  'Raigad Fort',
  'Capital of Maratha Empire under Chhatrapati Shivaji Maharaj. Historic fort with ropeway access, royal structures, and panoramic views.',
  'Raigad, Maharashtra',
  'https://images.pexels.com/photos/14807345/pexels-photo-14807345.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750',
  4.7,
  18.2358,
  73.4401,
  'Historical & Cultural'
),
(
  'Ganpatipule Beach',
  'Sacred beach town with Swayambhu Ganpati temple and pristine coastline. Perfect blend of spirituality and beach relaxation.',
  'Ganpatipule, Maharashtra',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2940&auto=format&fit=crop',
  4.6,
  17.1522,
  73.2683,
  'Beach & Island'
),
(
  'Bhandardara Lake',
  'Scenic hill station with Arthur Lake, Randha Falls, camping sites, and lush greenery. Perfect for nature lovers and adventure seekers.',
  'Ahmednagar, Maharashtra',
  'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2940&auto=format&fit=crop',
  4.7,
  19.5508,
  73.7503,
  'Nature & Adventure'
),
(
  'Karnala Bird Sanctuary',
  'Bird watcher''s paradise with 150+ bird species, Karnala Fort, dense forests, and trekking trails. Perfect day trip from Mumbai.',
  'Raigad, Maharashtra',
  'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?q=80&w=2940&auto=format&fit=crop',
  4.5,
  18.8777,
  73.1097,
  'Wildlife & Nature'
),
(
  'Goa Beaches',
  'India''s beach paradise with golden sands, water sports, vibrant nightlife, Portuguese heritage, and relaxed coastal vibes. Perfect beach holiday destination.',
  'Goa',
  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=2940&auto=format&fit=crop',
  4.7,
  15.2993,
  74.1240,
  'Beach & Island'
),
(
  'Rann of Kutch',
  'World''s largest salt desert transforms into a magical white landscape. Experience the Rann Utsav festival with folk culture, crafts, and stunning sunsets.',
  'Kutch, Gujarat',
  'https://images.unsplash.com/photo-1585074332559-5b4c8de0c1af?q=80&w=2940&auto=format&fit=crop',
  4.6,
  23.8347,
  69.6669,
  'Nature & Adventure'
),
-- South India
(
  'Hampi Ruins',
  'Ancient temple city and UNESCO World Heritage Site with magnificent ruins, boulders, temples, and rich Vijayanagara Empire history spread across stunning landscapes.',
  'Hampi, Karnataka',
  'https://images.unsplash.com/photo-1589900252040-4e8e5e10e465?q=80&w=2940&auto=format&fit=crop',
  4.8,
  15.3350,
  76.4600,
  'Historical & Cultural'
),
(
  'Kerala Backwaters',
  'Cruise through serene network of lagoons, lakes, and canals on traditional houseboats. Experience lush greenery, village life, and authentic Kerala cuisine.',
  'Alleppey, Kerala',
  'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2940&auto=format&fit=crop',
  4.9,
  9.4981,
  76.3388,
  'Nature & Adventure'
),
(
  'Mysore Palace',
  'Magnificent Indo-Saracenic palace with stunning architecture, intricate interiors, and royal heritage. Beautifully illuminated on Sundays and during festivals.',
  'Mysore, Karnataka',
  'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=2940&auto=format&fit=crop',
  4.7,
  12.3052,
  76.6551,
  'Historical & Cultural'
),
(
  'Munnar Tea Gardens',
  'Rolling hills covered with lush tea plantations, misty mountains, waterfalls, and cool climate. Perfect hill station for nature lovers and tea enthusiasts.',
  'Munnar, Kerala',
  'https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=2940&auto=format&fit=crop',
  4.8,
  10.0889,
  77.0595,
  'Nature & Adventure'
),
(
  'Coorg - Scotland of India',
  'Hill station known for coffee plantations, dense forests, waterfalls, and misty landscapes. Perfect for trekking, wildlife, and peaceful retreats.',
  'Coorg, Karnataka',
  'https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=2940&auto=format&fit=crop',
  4.7,
  12.3375,
  75.8069,
  'Nature & Adventure'
),
(
  'Mahabalipuram Shore Temple',
  'Ancient UNESCO World Heritage Site with stunning rock-cut architecture on the Bay of Bengal shore. Features intricate Pallava dynasty sculptures and temples.',
  'Mahabalipuram, Tamil Nadu',
  'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=2940&auto=format&fit=crop',
  4.6,
  12.6208,
  80.1948,
  'Historical & Cultural'
),
-- East India
(
  'Darjeeling Tea Gardens',
  'Queen of the Hills with world-famous tea estates, toy train ride, stunning Kanchenjunga views, and colonial charm. Perfect mountain escape.',
  'Darjeeling, West Bengal',
  'https://images.unsplash.com/photo-1597074866923-dc0589150900?q=80&w=2940&auto=format&fit=crop',
  4.8,
  27.0410,
  88.2663,
  'Nature & Adventure'
),
(
  'Sundarbans Mangrove Forest',
  'World''s largest mangrove forest and UNESCO World Heritage Site. Home to Royal Bengal Tigers, diverse wildlife, and unique ecosystem boat safaris.',
  'Sundarbans, West Bengal',
  'https://images.unsplash.com/photo-1584646098378-0874589d76b1?q=80&w=2940&auto=format&fit=crop',
  4.7,
  21.9497,
  89.1833,
  'Wildlife & Nature'
),
(
  'Konark Sun Temple',
  'UNESCO World Heritage Site shaped as a giant chariot with intricate stone carvings. Ancient architectural marvel dedicated to Sun God from 13th century.',
  'Konark, Odisha',
  'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?q=80&w=2940&auto=format&fit=crop',
  4.8,
  19.8876,
  86.0945,
  'Historical & Cultural'
),
-- Central India
(
  'Khajuraho Temples',
  'UNESCO World Heritage Site famous for stunning medieval Hindu and Jain temples adorned with intricate erotic sculptures and exceptional architectural beauty.',
  'Khajuraho, Madhya Pradesh',
  'https://images.unsplash.com/photo-1609137186974-d2715fb86ced?q=80&w=2940&auto=format&fit=crop',
  4.7,
  24.8318,
  79.9199,
  'Historical & Cultural'
),
(
  'Bandhavgarh National Park',
  'One of India''s best tiger reserves with high density of Royal Bengal Tigers. Dense forests, ancient caves, and excellent wildlife safari opportunities.',
  'Bandhavgarh, Madhya Pradesh',
  'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?q=80&w=2940&auto=format&fit=crop',
  4.6,
  23.7019,
  80.9600,
  'Wildlife & Nature'
),
-- Northeast India
(
  'Kaziranga National Park',
  'UNESCO World Heritage Site and home to two-thirds of world''s one-horned rhinoceros population. Rich biodiversity with elephants, tigers, and diverse birdlife.',
  'Kaziranga, Assam',
  'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?q=80&w=2940&auto=format&fit=crop',
  4.8,
  26.5775,
  93.1711,
  'Wildlife & Nature'
),
(
  'Tawang Monastery',
  'Largest monastery in India perched at 10,000 feet with stunning mountain views, Buddhist culture, and peaceful ambiance in Arunachal Pradesh.',
  'Tawang, Arunachal Pradesh',
  'https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=2940&auto=format&fit=crop',
  4.7,
  27.5861,
  91.8590,
  'Spiritual & Religious'
),
-- Additional Popular Spots
(
  'Andaman Islands',
  'Pristine beaches with crystal-clear waters, coral reefs, water sports, and tropical paradise. Perfect for diving, snorkeling, and beach relaxation.',
  'Port Blair, Andaman & Nicobar',
  'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?q=80&w=2940&auto=format&fit=crop',
  4.9,
  11.6234,
  92.7265,
  'Beach & Island'
),
(
  'Rishikesh - Yoga Capital',
  'World capital of yoga on banks of holy Ganges. Famous for river rafting, adventure sports, Beatles ashram, and spiritual retreats in Himalayan foothills.',
  'Rishikesh, Uttarakhand',
  'https://images.unsplash.com/photo-1583932772872-1d6c6ab2ebe5?q=80&w=2940&auto=format&fit=crop',
  4.7,
  30.0869,
  78.2676,
  'Spiritual & Religious'
),
(
  'Jim Corbett National Park',
  'India''s oldest national park and premier tiger reserve. Dense forests, diverse wildlife, elephant safaris, and adventure in the Himalayan foothills.',
  'Corbett, Uttarakhand',
  'https://images.unsplash.com/photo-1605029571412-64c1be48c436?q=80&w=2940&auto=format&fit=crop',
  4.6,
  29.5308,
  78.7571,
  'Wildlife & Nature'
),
(
  'Udaipur - City of Lakes',
  'Romantic city with stunning palaces, serene lakes, royal heritage, and beautiful architecture. Known as Venice of the East with City Palace and Lake Pichola.',
  'Udaipur, Rajasthan',
  'https://images.unsplash.com/photo-1605649487211-a5c9a31eb8d0?q=80&w=2940&auto=format&fit=crop',
  4.8,
  24.5854,
  73.7125,
  'Historical & Cultural'
),
(
  'Pondicherry - French Colony',
  'Charming coastal town with French colonial architecture, beautiful beaches, spiritual Auroville ashram, and unique Indo-French culture and cuisine.',
  'Pondicherry',
  'https://images.unsplash.com/photo-1590213957460-a7aa833a0963?q=80&w=2940&auto=format&fit=crop',
  4.6,
  11.9416,
  79.8083,
  'Beach & Island'
);

-- ==========================================
-- Additional Tables (Optional Extensions)
-- ==========================================

-- Table: destinations (All destinations, not just featured)
CREATE TABLE IF NOT EXISTS destinations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255) NOT NULL,
  image_url VARCHAR(500),
  rating DECIMAL(3,2),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  category VARCHAR(100),
  price_range VARCHAR(50),
  best_time_to_visit VARCHAR(100),
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_location (latitude, longitude),
  INDEX idx_featured (is_featured),
  INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: user_reviews
CREATE TABLE IF NOT EXISTS user_reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  destination_id INT NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (destination_id) REFERENCES featured_destinations(id) ON DELETE CASCADE,
  INDEX idx_destination (destination_id),
  INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: destination_images
CREATE TABLE IF NOT EXISTS destination_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  destination_id INT NOT NULL,
  image_url VARCHAR(500) NOT NULL,
  caption VARCHAR(255),
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (destination_id) REFERENCES featured_destinations(id) ON DELETE CASCADE,
  INDEX idx_destination (destination_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==========================================
-- Useful Queries
-- ==========================================

-- Get all featured destinations ordered by rating
-- SELECT * FROM featured_destinations WHERE is_active = 1 ORDER BY rating DESC;

-- Find destinations within a radius (example: 100km from Paris)
-- SELECT *, 
--   (6371 * acos(cos(radians(48.8566)) * cos(radians(latitude)) * 
--   cos(radians(longitude) - radians(2.3522)) + sin(radians(48.8566)) * 
--   sin(radians(latitude)))) AS distance
-- FROM featured_destinations
-- WHERE is_active = 1
-- HAVING distance < 100
-- ORDER BY distance;

-- Get destinations by category
-- SELECT * FROM featured_destinations WHERE category = 'Beach & Island' AND is_active = 1;

-- Get average rating
-- SELECT AVG(rating) as avg_rating FROM featured_destinations WHERE is_active = 1;

-- ==========================================
-- End of Schema
-- ==========================================
