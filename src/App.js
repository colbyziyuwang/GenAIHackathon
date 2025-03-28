import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './App.css';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

function App() {
  const [events, setEvents] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // State for calendar view and date
  const [currentView, setCurrentView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/auto-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      const botReply = data.reply || 'No response from auto plan!';
      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
      
      const newEvents = [];

      data.plans?.forEach((plan) => {
        if (plan.item) {
          newEvents.push({
            title: plan.item.title,
            start: new Date(plan.item.start_time),
            end: new Date(plan.item.end_time),
            type: 'main',
          });
        }

        plan.steps?.forEach((step) => {
          newEvents.push({
            title: `🔧 ${step.title}`,
            start: new Date(step.due),
            end: new Date(step.due),
            type: 'subtask',
          });
        });
      });

      setEvents((prev) => [...prev, ...newEvents]);
    } catch (error) {
      console.error('❌ API Error:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: '⚠️ Failed to reach planner service.' },
      ]);
    }

    setInput('');
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Handlers for calendar view and navigation
  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleNavigate = (date) => {
    setCurrentDate(date);
  };

  return (
    <div className="App">
      <h2>📅 AI Planner + Calendar</h2>

      <div className="chatbox">
        <div className="messages">
          {messages.map((msg, i) => (
            <div key={i} className={`msg ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          {loading && <div className="msg bot">⏳ Planning...</div>}
        </div>

        <div className="input-area">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your plan (e.g., 'Plan my workout tomorrow')"
          />
          <button onClick={handleSubmit} disabled={loading}>
            Submit
          </button>
        </div>
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        views={['month', 'week', 'day', 'agenda']}
        view={currentView}
        onView={handleViewChange}
        date={currentDate}
        onNavigate={handleNavigate}
        onSelectEvent={(event) => alert(`Event: ${event.title}`)}
        style={{ height: '80vh', marginTop: '2rem' }}
        eventPropGetter={(event) => {
          let bg = event.type === 'subtask' ? '#ffc107' : '#28a745';
          return { style: { backgroundColor: bg } };
        }}        
      />
    </div>
  );
}

export default App;
