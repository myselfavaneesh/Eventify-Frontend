'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { getAllEvents } from "@/services/api";

const getImageUrl = (imageUrls) => {
  if (imageUrls && imageUrls.length > 0) {
    return `http://localhost:8080/api/v1/uploads/${imageUrls[0]}`;
  }
  return "https://via.placeholder.com/300x200.png?text=No+Image"; // Placeholder image
};

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('');
  const [inputCity, setInputCity] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getAllEvents(city);
        setEvents(fetchedEvents);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchEvents();
  }, [city]);

  const handleCityChange = (e) => {
    setInputCity(e.target.value);
  };

  const handleCitySubmit = (e) => {
    e.preventDefault();
    setCity(inputCity);
  };

  const handleDetectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Using a free reverse geocoding API
          const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
          const data = await response.json();
          const detectedCity = data.city || data.locality;
          if (detectedCity) {
            setCity(detectedCity);
            setInputCity(detectedCity);
          }
        } catch (error) {
          console.error("Error fetching city from coordinates:", error);
        }
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">Upcoming Events</h1>
        <form onSubmit={handleCitySubmit} className="flex justify-center items-center space-x-2">
          <input
            type="text"
            value={inputCity}
            onChange={handleCityChange}
            placeholder="Enter your city"
            className="px-4 py-2 border rounded-lg w-64"
          />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg">
            Set City
          </button>
          <button type="button" onClick={handleDetectLocation} className="px-4 py-2 bg-gray-500 text-white rounded-lg">
            Detect Location
          </button>
        </form>
        {city && <p className="mt-4 text-lg">Showing events in: <strong>{city}</strong></p>}
      </div>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {!error && events.length === 0 && (
        <p className="text-center">No events found for the selected city.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <Link href={`/events/${event.id}`} key={event.id}>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <img
                src={getImageUrl(event.imageUrls)}
                alt={event.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
                <p className="text-gray-600">{event.venue}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}