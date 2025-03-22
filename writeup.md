# 📝 GenAIHackathon Project Write-Up

## 🚀 Project Inspiration

AutoPlan was born out of a simple but universal frustration:

> We often know **what** we need to do — but not **when** or **how** to get it done.

Whether it's students juggling coursework or professionals overwhelmed by meetings and deadlines, people rarely sit down to break tasks into manageable steps — let alone schedule those steps intelligently.

Our team wanted to build something that could:
- Understand natural, messy input like “submit report by Friday midnight”
- Recognize it as a task with a deadline
- Decompose it into subtasks like “draft report” and “get feedback”
- Return a structured, time-aware plan

We saw generative AI — specifically **LLMs like Gemini** — as the perfect assistant for this job. With just one sentence of input, AutoPlan helps users go from vague intention to executable plan.

---

## 🧰 Technology Stack

### 🔤 Languages
- JavaScript (Node.js)
- JSON (API responses and prompt formatting)

### 🧱 Frameworks & Libraries
- **Express.js** – for building the backend server
- **@google-cloud/vertexai** – Vertex AI SDK to interact with Gemini
- **CORS**, **body-parser**, etc. – for development convenience

### ☁️ Platforms
- **Google Cloud Vertex AI** – to power the Gemini 1.0 Pro LLM for planning
- Localhost during development (`http://localhost:3000`)

### 🛠️ Tools
- Git – for team collaboration
- VSCode – for development
---

## 📦 Product Summary

AutoPlan contains an intelligent planning backend that:
1. Accepts **natural language input**
2. Uses **Gemini** to extract and normalize **events and tasks**
3. Automatically **generates subtasks** for each item with clear deadlines

### 🧠 Features
- Understands mixed-input natural language:  
  _“I have a team meeting on March 23 and need to submit my report by the 24th.”_
- Parses and normalizes this into structured JSON:
  - Events (with start/end time)
  - Tasks (with deadlines)
- Plans 2–3 **prior steps** per task/event with realistic due dates
- Returns output in clean, frontend-friendly format

### 💡 Innovative Aspects
- Modular pipeline:  
  `understand → normalize → plan`  
  Each powered by a targeted Gemini prompt
- Flexible architecture for future extensions (calendar export, reminders, chat interfaces)

### 🎯 User Experience
- Backend-first prototype
- Ideal for future integration with calendar tools, chatbots, or productivity apps
- Designed to act like a “mini project manager in your pocket” — without the overhead

---

## 👥 Team

- **Frontend**: Shawn Liu  
- **Backend**: Bill Zeng, Colby Wang

