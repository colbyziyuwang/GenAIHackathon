import cohere
import requests

CO_API_KEY = ""

# Unified interface
def get_llm_response(prompt, provider="cohere"):
    if provider == "cohere":
        return get_response_cohere(prompt)
    else:
        return get_response_free(prompt)

# Cohere wrapper
def get_response_cohere(prompt):
    try:
        co = cohere.ClientV2(CO_API_KEY)
        response = co.chat(
            model="command-a-03-2025",
            messages=[{"role": "user", "content": prompt}],
            temperature = 0.1
        )
        return response.message.content[0].text
    except Exception as e:
        return f"Cohere error: {e}"

# Ollama wrapper (LLaMA 3.2)
def get_response_free(prompt):
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3.2",
                "prompt": prompt,
                "stream": False,
                "temperature": 0.1
            }
        )
        if response.status_code == 200:
            return response.json()["response"]
        else:
            return f"Ollama error: {response.status_code} - {response.text}"
    except Exception as e:
        return f"Ollama error: {e}"
