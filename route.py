import requests

# Replace this with your real API key
API_KEY = ""

# Sample locations (Toronto Union Station to UofT Robarts Library)
start_lat, start_lon = 43.6450, -79.3807  # Toronto Union Station
end_lat, end_lon = 43.6629, -79.3980      # UofT Robarts Library

# Mode options: walk, drive, bicycle, transit
mode = "walk"

# Build the URL
url = f"https://api.geoapify.com/v1/routing?waypoints={start_lat},{start_lon}|{end_lat},{end_lon}&mode={mode}&apiKey={API_KEY}"

# Make the request
response = requests.get(url)

if response.status_code == 200:
    data = response.json()
    leg = data["features"][0]["properties"]["legs"][0]
    
    print("\n🧭 Route Instructions:")
    for step in leg["steps"]:
        instruction = step["instruction"]
        distance = step["distance"]
        print(f"- {instruction} ({distance:.1f} m)")

    total_dist = leg["distance"] / 1000  # convert to km
    duration_min = leg["time"] / 60      # convert to minutes

    print(f"\n📏 Total distance: {total_dist:.2f} km")
    print(f"⏱️ Estimated time: {duration_min:.2f} minutes")
else:
    print("❌ Request failed:", response.status_code, response.text)

