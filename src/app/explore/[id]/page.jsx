"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

const fetchNaxusDataById = async (id) => {
  const res = await axios.get(`https://naxus-server.vercel.app/api/naxusdata/${id}`);
  return res.data; // { success, data }
};

export default function NaxusDataDetailsPage() {
  const { id } = useParams();
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["naxusdata", id],
    queryFn: () => fetchNaxusDataById(id),
    enabled: !!id,
  });

  if (isLoading) return <p className="p-6 text-center">Loading...</p>;
  if (isError) return <p className="p-6 text-center text-red-500">Error: {error.message}</p>;

  const item = data.data;

  const handleBooking = () => {
    setIsBooking(true);

    // Backend নেই, তাই এখানে শুধু UI feedback দেখানো হচ্ছে
    setTimeout(() => {
      setIsBooking(false);
      setIsBooked(true);
    }, 800);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Link href="/explore" className="text-sm text-gray-500 hover:underline mb-4 inline-block">
        ← Back to all items
      </Link>

      <div className="border rounded-xl overflow-hidden shadow-sm bg-white">
        <div className="relative h-72 w-full bg-gray-100">
          {item.image && (
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover"
              unoptimized
            />
          )}
          {item.featured && (
            <span className="absolute top-3 left-3 bg-yellow-400 text-xs font-semibold px-3 py-1 rounded-full">
              ⭐ Featured
            </span>
          )}
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl font-bold">{item.title}</h1>
            <span className="text-green-600 text-xl font-bold whitespace-nowrap ml-3">
              ${item.price}
            </span>
          </div>

          <p className="text-gray-500 mb-4">{item.category}</p>

          <p className="text-gray-700 mb-6 leading-relaxed">{item.description}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {item.tags?.map((tag) => (
              <span
                key={tag}
                className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-center border-t pt-4 mb-6 text-sm text-gray-500">
            <span>📍 {item.location}</span>
            <span>⭐ {item.rating}</span>
            <span>{item.date}</span>
          </div>

          {/* Booking Button */}
          {!isBooked ? (
            <button
              onClick={handleBooking}
              disabled={isBooking}
              className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {isBooking ? "Booking..." : `Book Now — $${item.price}`}
            </button>
          ) : (
            <div className="w-full bg-green-50 border border-green-200 text-green-700 font-medium py-3 rounded-lg text-center">
              ✅ Booked successfully! We&apos;ll be in touch shortly.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}