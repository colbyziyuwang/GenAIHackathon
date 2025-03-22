import streamlit as st
import csv
import pandas as pd

from LLM import *
from generate_schedule import *

# Set up Streamlit app
st.set_page_config(page_title="Multi-Task Breakdown", layout="centered")
st.title("🧠 Multi-Task Decomposer")
st.markdown("Enter multiple high-level tasks (one per line), and get subtasks using an LLM.")

# Text input
multi_task_input = st.text_area("Enter one task per line:", placeholder="e.g.\nStudy for physics exam\nDo grocery shopping\nPrepare presentation")

# Session state
if "all_task_rows" not in st.session_state:
    st.session_state["all_task_rows"] = []

if "schedule" not in st.session_state:
    st.session_state["schedule"] = None

# Task breakdown
if st.button("Break Down All Tasks"):
    tasks = [t.strip() for t in multi_task_input.splitlines() if t.strip()]
    
    if not tasks:
        st.warning("Please enter at least one task.")
    else:
        all_task_rows = []
        st.session_state["all_task_rows"] = []

        for task in tasks:
            prompt = f"""
            You are a helpful assistant. Your job is to break down a task into 2 or 3 actionable subtasks **only if the task is complex or multi-step**.

            If the task is **already atomic**, such as "Go for grocery shopping", "Buy lunch", "Take a walk", "Attend lecture", or "Call mom", then do **not** break it down. Just return the task as a single subtask.

            Output only subtasks, one per line (do not output index), and nothing else.

            Task: {task}
            Subtasks:
            """

            response = get_llm_response(prompt)
            subtasks = [line.strip() for line in response.strip().split("\n") if line.strip()]

            for sub in subtasks:
                all_task_rows.append([task, sub])
                st.session_state["all_task_rows"].append([task, sub])

        # Save to CSV
        csv_filename = "subtasks.csv"
        with open(csv_filename, mode="w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["Task", "Subtask"])
            writer.writerows(all_task_rows)

        with open(csv_filename, "rb") as f:
            st.download_button(
                label="📥 Download Subtasks as CSV",
                data=f,
                file_name="subtasks.csv",
                mime="text/csv"
            )

# Show subtasks anytime if available
if st.session_state["all_task_rows"]:
    if st.button("See Subtasks"):
        st.subheader("📦 Previously Generated Subtasks")
        for task in set(row[0] for row in st.session_state["all_task_rows"]):
            st.markdown(f"**🧩 {task}**")
            for sub in [row[1] for row in st.session_state["all_task_rows"] if row[0] == task]:
                st.write(f"- {sub}")

# Generate schedule
if st.button("Generate Schedule"):
    all_sub_tasks = [row[1] for row in st.session_state["all_task_rows"]]
    output_file = generate_schedule(all_sub_tasks)
    st.session_state["schedule"] = output_file

# Show generated schedule
if st.session_state["schedule"]:
    if st.button("See Schedule"):
        st.subheader("📅 Generated Schedule")
        df = pd.read_csv(st.session_state["schedule"])
        st.dataframe(df)
