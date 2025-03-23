import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './App.css';
import { set } from 'date-fns';

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
  const [prevEventId, setPrevEventId] = useState(0);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('month');
  const [date, setDate] = useState(new Date());

  // State for calendar view and date
  const [currentView, setCurrentView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleSubmit = async () => {
    if (!input.trim()) return;
  const raw_events = events.map((event) => {
    return {
      title: event.title,
      start: event.startTime,
      end: event.endTime,
    };
  });
  // console.log("raw_events: ", raw_events);

  // TODO: DOES NOT UPDATE THE CALENDAR VIEW PROPERLY
  const createEvent = (args) => { 
    const newEvent = {
      eventId: prevEventId,
      title: args.title,
      description: args.description,
      startTime: new Date(args.startTime),
      endTime: new Date(args.endTime),
    };
    setPrevEventId(prevEventId + 1);
    setEvents((prev) => [...prev, {
      title: args.title,
      start: new Date(args.startTime),
      end: new Date(args.endTime),
    }]);
  };

  const modifyEvent = (args) => {
    const { eventId } = args;
    const newEvents = events.map((event) => {
      if (event.eventId === eventId) {
        return {
          ...event,
          title: args.title,
          description: args.description,
          startTime: new Date(args.startTime),
          endTime: new Date(args.endTime),
        };
      }
      return event;
    });
    setEvents((prev) => newEvents);
  }

  const deleteEvent = (args) => {
    const { eventId } = args;
    const newEvents = events.filter((event) => event.eventId !== eventId);
    setEvents((prev) => newEvents);
  }

  const handleSubmit = async () => {
    if (!input.trim())
      return;

    const savedInput = input;
    setInput('');

    const userMessage = { sender: 'user', text: savedInput };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    

    try {
      const res = await fetch('http://localhost:5000/iplan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          calendar: events,
          message: savedInput
        }),
      });

      const data = await res.json();
      console.log("data: ", JSON.stringify(data, null, 2));

      // display reply from LLM
      const mReply = data.mReply;
      if (mReply)
        setMessages((prev) => [...prev, { sender: 'bot', text: mReply }]);

      // call the function if LLM wants to
      const mMethodToCall = data.mMethodToCall;
      if (mMethodToCall) {
        switch (mMethodToCall.name) {
          case "createEvent":
            createEvent(mMethodToCall.args);
            break;
          case "modifyEvent":
            modifyEvent(mMethodToCall.args);
            break;
          case "deleteEvent":
            deleteEvent(mMethodToCall.args);
            break;
          default:
            break;
        }
      }
    
    } catch (error) {
      console.error('❌ API Error:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: '⚠️ Failed to reach planner service.' },
      ]);
    }

  // const handleSubmit = async () => {
  //   if (!input.trim()) return;

  //   const userMessage = { sender: 'user', text: input };
  //   setMessages((prev) => [...prev, userMessage]);
  //   setLoading(true);
  //   setInput('');

  //   try {
  //     const res = await fetch('http://localhost:5000/auto-plan', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ message: input }),
  //     });

  //     const data = await res.json();

  //     // Add bot reply to messages
  //     const botReply = data.reply || 'No response from auto plan!';
  //     setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);

  //     // Map plans to calendar events
  //     const newEvents = [];

  //     data.plans?.forEach((plan) => {
  //       if (plan.item) {
  //         newEvents.push({
  //           title: plan.item.title,
  //           start: new Date(plan.item.start_time),
  //           end: new Date(plan.item.end_time),
  //         });
  //       }

  //       plan.steps?.forEach((step) => {
  //         newEvents.push({
  //           title: `🔧 ${step.title}`,
  //           start: new Date(step.due),
  //           end: new Date(step.due),
  //         });
  //       });
  //     });

  //     setEvents((prev) => [...prev, ...newEvents]);
  //   } catch (error) {
  //     console.error('❌ API Error:', error);
  //     setMessages((prev) => [
  //       ...prev,
  //       { sender: 'bot', text: '⚠️ Failed to reach planner service.' },
  //     ]);
  //   }

    // setInput('');
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
        style={{ height: '80vh', marginTop: '2rem' }}
      />
    </div>
  );
}

export default App;
