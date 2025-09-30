import { getEventById } from '@/services/api';

async function EventDetailsPage({ params }) {
  const { id } = params;
  let event = null;
  let error = null;

  try {
    event = await getEventById(id);
  } catch (err) {
    error = err.message;
  }

  if (error) {
    return <p className="text-red-500 text-center py-8">{error}</p>;
  }

  if (!event) {
    return <p className="text-center py-8">Event not found.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div>
            {event.imageUrls && event.imageUrls.length > 0 && (
              <img src={event.imageUrls[0]} alt={event.name} className="w-full h-full object-cover" />
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
              <span className="font-semibold">Date:</span> {new Date(event.eventTimestamp).toLocaleDateString()}
            </div>
            {/* Seat Selection UI will go here */}
            <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-300">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetailsPage;
