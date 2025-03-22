import requests
import csv

def generate_schedule_with_llama(subtasks, output_file="schedule.csv"):
    # Join all subtasks into a single prompt
    joined_subtasks = "\n".join([f"- {s}" for s in subtasks])

    prompt = f"""
You are a helpful assistant. Your task is to create a daily schedule from a list of subtasks.
Spread them across the day from 9:00 AM to 6:00 PM with realistic durations. You should adjust the ordering to avoid burnouts.
Include start time, end time, and task description. Do not output anything else.

Subtasks:
{joined_subtasks}

Please return the schedule as a list like this:
Time,Task
09:00 - 10:00, Review lecture notes
10:00 - 10:30, Make flashcards
...
"""

    # Call Ollama LLaMA 3.2 model
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama3.2",
            "prompt": prompt,
            "stream": False
        }
    )

    if response.status_code != 200:
        raise Exception(f"Failed to generate schedule: {response.text}")

    raw_text = response.json()["response"].strip()

    # Parse lines into CSV rows
    lines = raw_text.split("\n")
    schedule_rows = []

    for line in lines:
        if "," in line:
            time_block, task = line.split(",", 1)
            schedule_rows.append([time_block.strip(), task.strip()])

    # Write to CSV
    with open(output_file, mode="w", newline="") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["Time", "Task"])
        writer.writerows(schedule_rows)

    print(f"✅ Schedule written to {output_file}")


# Example usage
if __name__ == "__main__":
    example_subtasks = [
        "Review lecture notes from weeks 1 to 5",
        "Re-do homework problems",
        "Make flashcards",
        "Buy vegetables",
        "Write the first draft of report",
        "Research for presentation"
    ]

    generate_schedule_with_llama(example_subtasks)

