// src/components/EventForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EventForm = ({ fetchEvents, editingEvent, setEditingEvent }) => {
  const [form, setForm] = useState({
    title: '',
    image: null,
    link: '',
    description: '',
    event_date: '',
  });

  useEffect(() => {
    if (editingEvent) {
      setForm({
        title: editingEvent.title,
        image: null,
        link: editingEvent.link,
        description: editingEvent.description,
        event_date: editingEvent.event_date || '',
      });
    }
  }, [editingEvent]);

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let key in form) {
      if (form[key] !== null) formData.append(key, form[key]);
    }

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };

    try {
      if (editingEvent) {
        await axios.post(`/api/admin/events/${editingEvent.id}`, formData, config);
      } else {
        await axios.post('/api/admin/events', formData, config);
      }
      fetchEvents();
      setForm({
        title: '',
        image: null,
        link: '',
        description: '',
        event_date: '',
      });
      setEditingEvent(null);
    } catch (error) {
      console.error('Gagal submit event:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow p-4 mb-6 rounded-md">
      <h2 className="text-lg font-semibold mb-2">
        {editingEvent ? 'Edit Event' : 'Tambah Event'}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="title"
          placeholder="Judul"
          className="border p-2 rounded"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="event_date"
          className="border p-2 rounded"
          value={form.event_date}
          onChange={handleChange}
        />
        <input
          type="text"
          name="link"
          placeholder="Link (optional)"
          className="border p-2 rounded"
          value={form.link}
          onChange={handleChange}
        />
        <input
          type="file"
          name="image"
          accept="image/*"
          className="border p-2 rounded"
          onChange={handleChange}
        />
      </div>
      <textarea
        name="description"
        placeholder="Deskripsi"
        className="border p-2 rounded w-full mt-4"
        value={form.description}
        onChange={handleChange}
      ></textarea>
      <button
        type="submit"
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {editingEvent ? 'Update' : 'Tambah'}
      </button>
    </form>
  );
};

export default EventForm;
