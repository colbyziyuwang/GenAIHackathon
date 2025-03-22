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
  const [events] = useState([
    {
      title: 'Sample Event',
      start: new Date(),
      end: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [view, setView] = useState('month');

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      const res = await fetch('http://localhost:5000/auto-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setResponse(data.result || JSON.stringify(data));
    } catch (err) {
      console.error('Error:', err);
      setResponse('Error connecting to the server.');
    }

    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="App">
      <h2>📅 Calendar + Auto-Planning</h2>

      {/* View Switcher */}
      <div className="view-buttons">
        {['month', 'week', 'day', 'agenda'].map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={view === v ? 'active' : ''}
          >
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </button>
        ))}
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        view={view}
        onView={setView}
        style={{ height: '70vh', margin: '2rem 0' }}
      />

      {/* Input */}
      <div className="input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault(); // ⛔ Prevents form submit or page reload
              sendMessage();      // ✅ Trigger message sending
            }
          }}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
 

      {/* Response */}
      {response && (
        <div className="response-box">
          <h4>🧠 AutoPlan Response:</h4>
          <pre>{response}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
