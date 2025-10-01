'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getEventById, createBooking } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import SeatLayout from '@/components/SeatSelection';

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const [showSeatLayout, setShowSeatLayout] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData = await getEventById(id);
        setEvent(eventData);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchEvent();
  }, [id]);

  const handleBookingConfirm = async ({ selectedSeatIds }) => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      await createBooking({ eventId: event.id, seatIds: selectedSeatIds });
      alert('Booking successful!');
      router.push('/my-bookings');
    } catch (err) {
      setError('Booking failed. Please try again.');
      console.error(err);
    }
  };

  const handleBookTicketClick = () => {
    if (!user) {
      router.push('/login');
    } else {
      setShowSeatLayout(true);
    }
  };

  if (error) {
    return <p className="text-red-500 text-center py-8">{error}</p>;
  }

  if (!event) {
    return <p className="text-center py-8">Loading event details...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div>
            {event.imageUrls && event.imageUrls.length > 0 && (
              <img
                src={event.imageUrls[0]}
                alt={event.name}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">{event.name}</h1>
            <p className="text-gray-600 mb-4">{event.description}</p>
            <div className="mb-4">
              <span className="font-semibold">Category:</span> {event.category}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Venue:</span> {event.venue}
            </div>
            <div className="mb-4">
              <span className="font-semibold">Date:</span>{" "}
              {new Date(event.eventTimestamp).toLocaleDateString()}
            </div>
            {showSeatLayout ? (
              <SeatLayout event={event} onConfirm={handleBookingConfirm} />
            ) : (
              <button
                onClick={handleBookTicketClick}
                className="w-full px-6 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600"
              >
                Book Tickets
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
