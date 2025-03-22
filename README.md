# 🚀 GenAI Hackathon

## 👥 Team
- **Front End**: Shawn Liu  
- **Backend**: Bill Zeng, Colby Wang

---

## 🧠 Project Description

The backend converts natural language input (containing tasks and events) into structured JSON plans, including:
- Extracted tasks/events  
- Structured format with subtasks  
- Deadlines and dependencies  

---

## 📁 Backend Structure

```
llm_backend/
├── index.js                     # Express server entry point
├── routes/
│   ├── chat.js                  # POST /chat - normalize structured lines into JSON
│   ├── plan.js                  # POST /plan - break down one item into subtasks
│   ├── understand.js            # POST /understand - extract task/event lines from freeform input
│   └── autoPlan.js              # POST /auto-plan - full pipeline (understand + plan)
├── services/
│   ├── chatService.js
│   ├── planService.js
│   ├── understandService.js
│   └── autoPlanService.js
├── vertex/
│   └── gemini.js                # Vertex AI client configuration
```

---

## 🛠️ Setup

```bash
# Install dependencies
npm install
```

---

## ⚙️ Configuration

Update `vertex/gemini.js` with your Google Cloud project details:

```js
const vertexAI = new VertexAI({
  project: 'your-project-id',
  location: 'us-central1',
});
```

---

## ▶️ Run the Server

```bash
node llm_backend/index.js
```

Access the server at:  
📍 `http://localhost:3000`
