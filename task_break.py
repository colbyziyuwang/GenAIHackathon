import streamlit as st
import requests

# Set up your Streamlit app
st.set_page_config(page_title="Multi-Task Breakdown", layout="centered")
st.title("🧠 Multi-Task Decomposer")
st.markdown("Enter multiple high-level tasks (one per line), and get subtasks using LLaMA 3.2 via Ollama.")

# Input for multiple tasks
multi_task_input = st.text_area("Enter one task per line:", placeholder="e.g.\nStudy for physics exam\nDo grocery shopping\nPrepare presentation")

# Button to trigger breakdown
if st.button("Break Down All Tasks"):
    tasks = [t.strip() for t in multi_task_input.splitlines() if t.strip()]
    
    if not tasks:
        st.warning("Please enter at least one task.")
    else:
        st.subheader("📋 Task Breakdown Table")

        # Construct prompt for each task
        for task in tasks:
            prompt = f"""
You are a helpful assistant. Your job is to break down a task into 2 or 3 actionable subtasks. Output only subtasks and nothing else.

Task: {task}
Subtasks:
"""

            # Call Ollama
            response = requests.post(
                "http://localhost:11434/api/generate",
                json={
                    "model": "llama3.2",
                    "prompt": prompt,
                    "stream": False
                }
            )

            if response.status_code == 200:
                output = response.json()["response"]
                subtasks = [line.strip("0123456789. ").strip() for line in output.strip().split("\n") if line.strip()]
                
                # Display task and its subtasks
                st.markdown(f"**🧩 {task}**")
                for sub in subtasks:
                    st.write(f"- {sub}")
            else:
                st.error(f"Failed to get response for: {task}")

