import cohere

CO_API_KEY = "your api key" # get this from https://dashboard.cohere.com/
co = cohere.ClientV2(CO_API_KEY)

response = co.chat(model="command-a-03-2025", messages=[{"role": "user", "content": "tell me about university of toronto"}])

print(response)
