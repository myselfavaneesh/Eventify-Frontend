import Link from 'next/link';
import { getAllEvents } from '@/services/api';

async function HomePage() {
  let events = [];
  let error = null;

  try {
    events = await getAllEvents();
  } catch (err) {
    error = err.message;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Upcoming Events</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {!error && events.length === 0 && <p className="text-center">No events found.</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <Link href={`/events/${event.id}`} key={event.id}>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <img src={event.imageUrls[0]} alt={event.name} className="w-full h-48 object-cover" />
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

export default HomePage;
