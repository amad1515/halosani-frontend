// src/components/EventList.jsx
import React from 'react';

const EventList = ({ events, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border-collapse border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2 border">Gambar</th>
            <th className="p-2 border">Judul</th>
            <th className="p-2 border">Tanggal</th>
            <th className="p-2 border">Link</th>
            <th className="p-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-t">
              <td className="p-2 border">
                {event.image && (
                  <img
                    src={`/storage/${event.image}`}
                    alt="event"
                    className="w-20 h-12 object-cover"
                  />
                )}
              </td>
              <td className="p-2 border">{event.title}</td>
              <td className="p-2 border">{event.event_date}</td>
              <td className="p-2 border">
                <a href={event.link} className="text-blue-500" target="_blank" rel="noreferrer">
                  {event.link}
                </a>
              </td>
              <td className="p-2 border">
                <button
                  onClick={() => onEdit(event)}
                  className="bg-yellow-400 px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(event.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EventList;
