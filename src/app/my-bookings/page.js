'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getUserBookings } from '@/services/api';

export default function MyBookingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const fetchBookings = async () => {
        try {
          const userBookings = await getUserBookings();
          setBookings(userBookings);
        } catch (err) {
          setError(err.message);
        }
      };
      fetchBookings();
    }
  }, [user]);

  if (loading || !user) {
    return <p className="text-center py-8">Loading...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {bookings.length === 0 && !error && <p className="text-center">You have no bookings yet.</p>}
      <div className="space-y-6">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">{booking.event.name}</h2>
            <p><span className="font-semibold">Status:</span> {booking.status}</p>
            <p><span className="font-semibold">Total Amount:</span> ${booking.totalAmount.toFixed(2)}</p>
            <p><span className="font-semibold">Booking Date:</span> {new Date(booking.bookingTimestamp).toLocaleDateString()}</p>
            <div className="mt-2">
              <span className="font-semibold">Booked Seats:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {booking.bookedSeats.map((seat) => (
                  <span key={seat.id} className="bg-gray-200 px-2 py-1 rounded-md text-sm">{seat.seatNumber}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
