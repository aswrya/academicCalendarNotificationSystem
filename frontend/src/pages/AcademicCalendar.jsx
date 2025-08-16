import { useEffect, useMemo, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';           // NEW
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, startOfMonth, endOfMonth } from 'date-fns';
import enAU from 'date-fns/locale/en-AU';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from '../components/Modal';

const locales = { 'en-AU': enAU };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const toISO = (d) => (d instanceof Date ? d.toISOString() : new Date(d).toISOString());

export default function AcademicCalendar() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();    // NEW

  const [events, setEvents] = useState([]);
  const [range, setRange] = useState({ from: startOfMonth(new Date()), to: endOfMonth(new Date()) });

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', start: '', end: '', allDay: false });

  const loadEvents = useCallback(async (r) => {
    try {
      const res = await axiosInstance.get('/api/auth/academic', {
        headers: { Authorization: `Bearer ${user.token}` },
        params: { from: toISO(r.from), to: toISO(r.to), limit: 500, skip: 0 },
      });
      const mapped = res.data.map(e => ({ ...e, start: new Date(e.start), end: new Date(e.end) }));
      setEvents(mapped);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to load events');
    }
  }, [user?.token]);

  useEffect(() => { if (user) loadEvents(range); }, [user, range, loadEvents]);

  // Auto-open create modal when coming from Navbar (+ Add Event)
  useEffect(() => {
    if (searchParams.get('new') === '1') {
      openCreate();
      // Clear the param so it doesn’t re-open on re-render or refresh
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const defaultDate = useMemo(() => new Date(), []);

  const openCreate = (slotInfo) => {
    setEditing(null);
    setForm({
      title: '',
      start: slotInfo?.start ? new Date(slotInfo.start).toISOString().slice(0,16) : '',
      end:   slotInfo?.end   ? new Date(slotInfo.end).toISOString().slice(0,16)   : '',
      allDay: !!slotInfo?.action && slotInfo.action === 'select',
    });
    setOpen(true);
  };

  const openEdit = (eventObj) => {
    setEditing(eventObj);
    setForm({
      title: eventObj.title,
      start: eventObj.start.toISOString().slice(0,16),
      end:   eventObj.end.toISOString().slice(0,16),
      allDay: !!eventObj.allDay,
    });
    setOpen(true);
  };

  const closeModal = () => setOpen(false);

  const createEvent = async () => {
    if (!form.title || !form.start || !form.end) return alert('Please fill Title, Start and End');
    try {
      const payload = { title: form.title, start: toISO(form.start), end: toISO(form.end), allDay: !!form.allDay };
      const res = await axiosInstance.post('/api/auth/academic', payload, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const ev = { ...res.data, start: new Date(res.data.start), end: new Date(res.data.end) };
      setEvents(prev => [...prev, ev]);
      setOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create event');
    }
  };

  const updateEvent = async () => {
    if (!editing) return;
    if (!form.title || !form.start || !form.end) return alert('Please fill Title, Start and End');
    try {
      const payload = { title: form.title, start: toISO(form.start), end: toISO(form.end), allDay: !!form.allDay };
      const res = await axiosInstance.put(`/api/auth/academic/${editing._id}`, payload, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const saved = { ...res.data, start: new Date(res.data.start), end: new Date(res.data.end) };
      setEvents(prev => prev.map(e => e._id === saved._id ? saved : e));
      setOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update event');
    }
  };

  const deleteEvent = async () => {
    if (!editing) return;
    if (!window.confirm(`Delete "${editing.title}"?`)) return;
    try {
      await axiosInstance.delete(`/api/auth/academic/${editing._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setEvents(prev => prev.filter(e => e._id !== editing._id));
      setOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete event');
    }
  };

  const handleRangeChange = (r) => {
    if (Array.isArray(r)) {
      const from = r[0];
      const to = r[r.length - 1];
      setRange({ from, to });
    } else if (r?.start && r?.end) {
      setRange({ from: r.start, to: r.end });
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold">Academic Calendar</h1>
        {/* Removed the local + Add Event button */}
      </div>

      <div className="bg-white rounded shadow p-2">
        <Calendar
          culture="en-AU"
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView={Views.MONTH}
          defaultDate={defaultDate}
          style={{ height: 700 }}
          selectable
          onSelectEvent={openEdit}      // click existing -> edit dialog
          onSelectSlot={openCreate}     // drag/click empty -> create dialog
          onRangeChange={handleRangeChange}
        />
      </div>

      <Modal
        open={open}
        onClose={closeModal}
        title={editing ? 'Edit Event' : 'Create Event'}
        actions={
          <>
            {editing && (
              <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={deleteEvent}>
                Delete
              </button>
            )}
            <button className="px-4 py-2 rounded border" onClick={closeModal}>Cancel</button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={editing ? updateEvent : createEvent}
            >
              {editing ? 'Save' : 'Create'}
            </button>
          </>
        }
      >
        <div className="grid gap-3">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="border p-2 rounded"
          />
          <label className="text-sm text-gray-600">Start</label>
          <input
            type="datetime-local"
            value={form.start}
            onChange={e => setForm({ ...form, start: e.target.value })}
            className="border p-2 rounded"
          />
          <label className="text-sm text-gray-600">End</label>
          <input
            type="datetime-local"
            value={form.end}
            onChange={e => setForm({ ...form, end: e.target.value })}
            className="border p-2 rounded"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.allDay}
              onChange={e => setForm({ ...form, allDay: e.target.checked })}
            />
            All day
          </label>
        </div>
      </Modal>
    </div>
  );
}
