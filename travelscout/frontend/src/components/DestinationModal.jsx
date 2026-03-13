import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Star, Navigation, ExternalLink, Heart, Share2, Info, Globe } from 'lucide-react';

const DestinationModal = ({ destination, isOpen, onClose, allDestinations = [] }) => {
  console.log('DestinationModal render:', { destination: destination?.name, isOpen, allDestinations: allDestinations?.length });
  
  if (!destination || !isOpen) return null;

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      'Historical & Cultural': 'bg-amber-100 text-amber-800',
      'Nature & Adventure': 'bg-green-100 text-green-800',
      'Spiritual & Religious': 'bg-purple-100 text-purple-800',
      'Beach & Island': 'bg-blue-100 text-blue-800',
      'Wildlife & Nature': 'bg-teal-100 text-teal-800',
      'Urban & Modern': 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  // Calculate distance (simple approximation)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  // Get nearby destinations
  const nearbyDestinations = allDestinations
    ?.filter(d => d.id !== destination.id)
    .map(d => ({
      ...d,
      distance: calculateDistance(
        destination.latitude,
        destination.longitude,
        d.latitude,
        d.longitude
      )
    }))
    .filter(d => d.distance < 100)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3);

  // Get similar destinations (same category)
  const similarDestinations = allDestinations
    ?.filter(d => d.id !== destination.id && d.category === destination.category)
    .slice(0, 3);

  // Generate Google Maps URL
  const getDirectionsUrl = () => {
    return `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}`;
  };

  const getMapUrl = () => {
    return `https://www.google.com/maps/search/?api=1&query=${destination.latitude},${destination.longitude}`;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: destination.name,
          text: destination.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-4 md:inset-10 lg:inset-16 xl:inset-24 bg-white rounded-3xl shadow-2xl z-[70] overflow-hidden flex flex-col max-w-6xl mx-auto"
          >
            {/* Header Image */}
            <div className="relative h-64 md:h-80 flex-shrink-0">
              <img
                src={destination.image_url}
                alt={destination.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=2835&auto=format&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              
              {/* Header Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl md:text-4xl font-bold text-white mb-2"
                >
                  {destination.name}
                </motion.h2>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center space-x-2 text-white/90"
                >
                  <MapPin className="w-5 h-5" />
                  <span className="text-lg">{destination.location}</span>
                </motion.div>
              </div>

              {/* Top Right Buttons */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <Share2 className="w-5 h-5 text-gray-700" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <Heart className="w-5 h-5 text-gray-700" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-colors"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </motion.button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              <div className="p-6 md:p-8 space-y-6 bg-gradient-to-b from-white to-gray-50">
                {/* Quick Info Bar - REAL DATA ONLY */}
                <div className="flex flex-wrap gap-3">
                  {/* Rating - Real from DB */}
                  {destination.rating && (
                    <div className="flex items-center space-x-2 px-4 py-2 bg-amber-50 rounded-full border border-amber-200">
                      <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                      <span className="font-semibold text-gray-800">{destination.rating}</span>
                      <span className="text-gray-600 text-sm">/ 5.0</span>
                    </div>
                  )}

                  {/* Category - Real from DB */}
                  <div className={`px-4 py-2 rounded-full font-medium text-sm ${getCategoryColor(destination.category)}`}>
                    {destination.category}
                  </div>
                </div>

                {/* Description - Real from DB */}
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border-2 border-gray-200">
                  <div className="flex items-center space-x-2 mb-4">
                    <Info className="w-6 h-6 text-primary-600" />
                    <h3 className="text-2xl font-bold text-gray-800">About {destination.name}</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {destination.description}
                  </p>
                </div>

                {/* Location Details - Real from DB */}
                <div className="bg-white rounded-2xl border-2 border-primary-200 p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <MapPin className="w-6 h-6 text-primary-600" />
                    <h3 className="text-2xl font-bold text-gray-800">Location</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="bg-primary-100 p-2 rounded-lg">
                        <MapPin className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-lg">{destination.location}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          GPS: {parseFloat(destination.latitude).toFixed(6)}, {parseFloat(destination.longitude).toFixed(6)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Interactive Map - Real Location Data */}
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <MapPin className="w-6 h-6 text-primary-600" />
                    <h3 className="text-2xl font-bold text-gray-800">Interactive Map</h3>
                  </div>
                  <div className="rounded-xl overflow-hidden shadow-lg border-2 border-gray-300 mb-4">
                    <iframe
                      width="100%"
                      height="400"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${destination.latitude},${destination.longitude}&zoom=14`}
                      allowFullScreen
                      title={`Map of ${destination.name}`}
                    />
                  </div>
                  
                  {/* Navigation Buttons */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <motion.a
                      href={getDirectionsUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center space-x-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      <Navigation className="w-5 h-5" />
                      <span>Get Directions</span>
                      <ExternalLink className="w-4 h-4" />
                    </motion.a>

                    <motion.a
                      href={getMapUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center space-x-2 bg-white border-2 border-primary-600 text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-primary-50 transition-all"
                    >
                      <Globe className="w-5 h-5" />
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-4 h-4" />
                    </motion.a>
                  </div>
                </div>

                {/* Bottom Padding for Scroll */}
                <div className="h-4" />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default DestinationModal;
