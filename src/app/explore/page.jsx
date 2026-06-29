"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

const fetchNaxusData = async () => {
  const res = await axios.get("https://naxus-server.vercel.app/api/naxusdata");
  return res.data;
};

export default function NaxusDataPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["naxusdata"],
    queryFn: fetchNaxusData,
  });

  if (isLoading) return <p className="p-6 text-center">Loading...</p>;
  if (isError) return <p className="p-6 text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Naxus Data <span className="text-gray-400 text-lg">({data.total})</span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.data.map((item) => (
          <div
            key={item._id}
            className="border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow bg-white flex flex-col"
          >
            <div className="relative h-44 w-full bg-gray-100">
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
                <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-semibold px-2 py-1 rounded-full">
                  ⭐ Featured
                </span>
              )}
            </div>

            <div className="p-4 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-1">
                <h2 className="font-semibold text-lg">{item.title}</h2>
                <span className="text-green-600 font-bold whitespace-nowrap ml-2">
                  ${item.price}
                </span>
              </div>

              <p className="text-sm text-gray-500 mb-2">{item.category}</p>
              <p className="text-sm text-gray-700 flex-1">{item.description}</p>

              <div className="flex flex-wrap gap-1 mt-3">
                {item.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                <span>📍 {item.location}</span>
                <span>⭐ {item.rating}</span>
              </div>

              <p className="text-xs text-gray-400 mt-1 mb-3">{item.date}</p>

              {/* View Details Button */}
              <Link
                href={`/explore/${item._id}`}
                className="mt-auto inline-block text-center bg-black text-white text-sm font-medium py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}