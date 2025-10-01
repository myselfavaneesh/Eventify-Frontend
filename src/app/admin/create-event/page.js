'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import { createEvent } from '@/services/api';
import Link from 'next/link';

const CreateEventPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    venue: '',
    eventTimestamp: '',
    totalSeats: 0,
    seatsPerRow: 0,
    category: 'MUSIC',
    images: [],
    seatPricing: [],
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const numberOfRows = useMemo(() => {
    if (formData.totalSeats > 0 && formData.seatsPerRow > 0) {
      return Math.ceil(formData.totalSeats / formData.seatsPerRow);
    }
    return 0;
  }, [formData.totalSeats, formData.seatsPerRow]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSeatPricingChange = (index, value) => {
    const newSeatPricing = [...formData.seatPricing];
    newSeatPricing[index] = value;
    setFormData({ ...formData, seatPricing: newSeatPricing });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, images: [...e.target.files] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (numberOfRows !== formData.seatPricing.length) {
        setError(`You must provide exactly ${numberOfRows} price entries.`);
        return;
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => {
        if (key === 'images') {
            formData.images.forEach(image => {
                data.append('images', image);
            });
        } else if (key === 'seatPricing') {
            formData.seatPricing.forEach(price => {
                data.append('seatPricing', price);
            });
        } else {
            data.append(key, formData[key]);
        }
    });

    try {
      const response = await createEvent(data);
      setSuccess('Event created successfully!');
      // Assuming the API returns the created event with an ID
      if (response && response.data && response.data.id) {
        router.push(`/events/${response.data.id}`);
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('Failed to create event. Please check the form and try again.');
      console.error(err);
    }
  };

  return (
    <ProtectedRoute allowedRoles={['ADMIN', 'VENDOR']}>
      <div className="flex">
        <aside className="w-64 bg-gray-800 text-white h-screen p-4">
          <h2 className="text-2xl font-bold mb-8">Admin Menu</h2>
          <nav>
            <Link href="/admin/dashboard">
              <p className="block py-2 px-4 rounded hover:bg-gray-700">Dashboard</p>
            </Link>
            <Link href="/admin/create-event">
              <p className="block py-2 px-4 rounded hover:bg-gray-700">Create Event</p>
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-8 bg-gray-100">
          <h1 className="text-3xl font-bold mb-8">Create New Event</h1>
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-500 mb-4">{success}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Details */}
              <div className="space-y-4">
                <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Event Name" className="w-full p-2 border rounded" required />
                <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" className="w-full p-2 border rounded" required />
                <input name="venue" value={formData.venue} onChange={handleInputChange} placeholder="Venue" className="w-full p-2 border rounded" required />
                <input type="datetime-local" name="eventTimestamp" value={formData.eventTimestamp} onChange={handleInputChange} className="w-full p-2 border rounded" required />
                <select name="category" value={formData.category} onChange={handleInputChange} className="w-full p-2 border rounded">
                  <option value="MUSIC">Music</option>
                  <option value="SPORTS">Sports</option>
                  <option value="ARTS">Arts</option>
                  <option value="THEATER">Theater</option>
                  <option value="CONFERENCE">Conference</option>
                </select>
                <input type="file" name="images" onChange={handleImageChange} multiple className="w-full p-2 border rounded" />
              </div>

              {/* Seating Details */}
              <div className="space-y-4">
                <input type="number" name="totalSeats" value={formData.totalSeats} onChange={handleInputChange} placeholder="Total Seats" className="w-full p-2 border rounded" required />
                <input type="number" name="seatsPerRow" value={formData.seatsPerRow} onChange={handleInputChange} placeholder="Seats Per Row" className="w-full p-2 border rounded" required />
                
                {numberOfRows > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Seat Pricing per Row ({numberOfRows} rows)</h3>
                    <div className="space-y-2">
                      {Array.from({ length: numberOfRows }).map((_, index) => (
                        <input
                          key={index}
                          type="number"
                          placeholder={`Price for row ${index + 1}`}
                          value={formData.seatPricing[index] || ''}
                          onChange={(e) => handleSeatPricingChange(index, e.target.value)}
                          className="w-full p-2 border rounded"
                          required
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className="mt-6 w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
              Create Event
            </button>
          </form>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default CreateEventPage;
