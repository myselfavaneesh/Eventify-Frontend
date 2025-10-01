"use client";

import { useState, useMemo } from "react";

// Component for a single seat
const Seat = ({ seat, onSelect, isSelected }) => {
  const getSeatStyle = () => {
    if (isSelected) {
      return "bg-green-500 text-white border-green-600";
    }
    switch (seat.status) {
      case "BOOKED":
      case "LOCKED":
        return "bg-gray-300 cursor-not-allowed";
      default:
        return "bg-white border-gray-300 hover:border-blue-500";
    }
  };

  return (
    <div
      onClick={() => seat.status === "AVAILABLE" && onSelect(seat)}
      className={`w-8 h-8 flex items-center justify-center rounded text-sm font-semibold border ${getSeatStyle()}`}
    >
      {seat.seatNumber.replace(/^[A-Z]/, "")}
    </div>
  );
};

const SeatLayout = ({ event, onConfirm }) => {
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Process and group seats by price category and then by row
  const seatLayout = useMemo(() => {
    if (!event || !event.seats) return {};

    const layout = event.seats.reduce((acc, seat) => {
      const price = seat.seatPricing;
      const row = seat.seatNumber.charAt(0);

      if (!acc[price]) {
        acc[price] = {};
      }
      if (!acc[price][row]) {
        acc[price][row] = [];
      }
      acc[price][row].push(seat);
      return acc;
    }, {});

    // Sort rows within each price category
    for (const price in layout) {
        const sortedRows = Object.keys(layout[price]).sort();
        const newRows = {};
        for(const row of sortedRows) {
            newRows[row] = layout[price][row];
        }
        layout[price] = newRows;
    }

    return layout;
  }, [event]);

  const handleSelectSeat = (seat) => {
    setSelectedSeats((prevSelected) => {
      const isSelected = prevSelected.some((s) => s.id === seat.id);
      if (isSelected) {
        return prevSelected.filter((s) => s.id !== seat.id);
      } else {
        return [...prevSelected, seat];
      }
    });
  };

  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((total, seat) => total + seat.seatPricing, 0);
  }, [selectedSeats]);

  const handleConfirmBooking = () => {
    const selectedSeatIds = selectedSeats.map((seat) => seat.id);
    onConfirm({ selectedSeatIds, totalPrice });
  };

  if (!event || !event.seats || Object.keys(seatLayout).length === 0) {
    return (
      <div className="mt-8 text-center">
        <p className="text-gray-500">
          Seating information is not available for this event.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex flex-col items-center space-y-8">
        {Object.entries(seatLayout).map(([price, rows]) => (
          <div key={price} className="w-full">
            <div className="text-center py-2 mb-4 border-b-2 border-gray-200">
              <h3 className="font-bold text-lg text-gray-700">
                ROYAL {price > 200 ? "GOLD" : "SILVER"} - Rs.{price}
              </h3>
            </div>
            <div className="flex flex-col items-center space-y-2">
              {Object.entries(rows).map(([rowLabel, seats]) => (
                <div key={rowLabel} className="flex items-center space-x-4">
                  <div className="w-6 font-semibold text-gray-500">{rowLabel}</div>
                  <div className="flex space-x-2">
                    {seats.map((seat) => (
                      <Seat
                        key={seat.id}
                        seat={seat}
                        onSelect={handleSelectSeat}
                        isSelected={selectedSeats.some((s) => s.id === seat.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Screen */}
      <div className="mt-12 mb-6">
          <div className="h-2 bg-gray-300 w-3/4 mx-auto rounded-t-lg"></div>
          <p className="text-center text-gray-500 text-sm">All eyes this way please</p>
      </div>


      {selectedSeats.length > 0 && (
        <div className="mt-8 p-4 border-t-2 border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">
                Selected Seats:{" "}
                <span className="font-normal">
                  {selectedSeats.map((s) => s.seatNumber).join(", ")}
                </span>
              </p>
              <p className="font-semibold">
                Total Price:{" "}
                <span className="font-normal">Rs.{totalPrice.toFixed(2)}</span>
              </p>
            </div>
            <button
              onClick={handleConfirmBooking}
              disabled={selectedSeats.length === 0}
              className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatLayout;