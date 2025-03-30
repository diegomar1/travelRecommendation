// Fetch data from JSON file
let travelData;

fetch('travel_recommendation_api.json')
  .then(response => response.json())
  .then(data => {
    travelData = data;
  })
  .catch(error => console.error('Error loading JSON:', error));


function searchLocation() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Clear previous results

    if (!travelData) {
        resultDiv.innerHTML = "<p>Data is still loading...</p>";
        return;
    }

    let found = [];

    // Check if the search term includes "beach" or "temple"
    const isBeachSearch = searchInput.includes('beach');
    const isTempleSearch = searchInput.includes('temple');

    if (isBeachSearch) {
        // Search in beaches if the input contains 'beach'
        travelData.beaches.forEach(beach => {
            if (beach.name.toLowerCase().includes(searchInput)) {
                found.push(beach);
            }
        });
    } else if (isTempleSearch) {
        // Search in temples if the input contains 'temple'
        travelData.temples.forEach(temple => {
            if (temple.name.toLowerCase().includes(searchInput)) {
                found.push(temple);
            }
        });
    } else {
        // Otherwise, search in countries and cities
        travelData.countries.forEach(country => {
            country.cities.forEach(city => {
                if (city.name.toLowerCase().includes(searchInput)) {
                    found.push(city);
                }
            });
        });

        // Search in temples
        travelData.temples.forEach(temple => {
            if (temple.name.toLowerCase().includes(searchInput)) {
                found.push(temple);
            }
        });

        // Search in beaches
        travelData.beaches.forEach(beach => {
            if (beach.name.toLowerCase().includes(searchInput)) {
                found.push(beach);
            }
        });
    }

    // Display the result (limit to two results)
    if (found.length > 0) {
        resultDiv.innerHTML = `
            <div class="result-container">
                ${found.slice(0, 2).map(item => `
                    <div class="result-item">
                        <div class="result-top-bar" id="localtime-${item.name}"></div>            
                        <img src="${item.imageUrl}" alt="${item.name}">
                        <div class="result-desc">
                            <h2>${item.name}</h2>
                            <p>${item.description}</p>
                            <button class="visit-button">Visit</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        // Fetch and display the local time for each result
        found.slice(0, 2).forEach(item => {
            getLocalTime(item.name, `localtime-${item.name}`);
        });

    } else {
        resultDiv.innerHTML = "<p>No results found.</p>";
    }
}

function resetFunction() {
    // Clear search input field
    document.getElementById('searchInput').value = '';

    // Clear results from the page
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';  // Clear the displayed results
}

const cityTimezones = {
    "Sydney, Australia": "Australia/Sydney",
    "Melbourne, Australia": "Australia/Melbourne",
    "Tokyo, Japan": "Asia/Tokyo",
    "Kyoto, Japan": "Asia/Tokyo",
    "Rio de Janeiro, Brazil": "America/Sao_Paulo",
    "São Paulo, Brazil": "America/Sao_Paulo",
    "Angkor Wat, Cambodia": "Asia/Phnom_Penh",
    "Taj Mahal, India": "Asia/Kolkata",
    "Bora Bora, French Polynesia": "Pacific/Tahiti",
    "Copacabana Beach, Brazil": "America/Sao_Paulo"
};

function getLocalTime(city, localtime) {
    const apiKey = 'e8765702771f3b15e946ae72209506e8';  // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

  // Fetch weather data using OpenWeatherMap API
  fetch(url)
  .then(response => response.json())
  .then(data => {
      console.log('API Response:', data);  // Log the response for debugging
      
      // Check if the response is valid and contains necessary data
      if (data && data.timezone) {
          const timezoneOffset = data.timezone;  // Timezone offset in seconds from UTC
          const utcTime = new Date(data.dt * 1000);  // Convert OpenWeather's UTC time (in seconds) to a Date object
          
          // Adjust the time by the timezone offset
          const localTime = new Date(utcTime.getTime() + timezoneOffset * 1000); // Adjust time in milliseconds
          
          // Use `Intl.DateTimeFormat` to format the local time correctly
          const formattedTime = new Intl.DateTimeFormat('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,  // 24-hour format
              timeZone: 'UTC', // Ensuring it's being shown as the correct local time zone
          }).format(localTime);
          
          // Update the div with the local time
          const timeDiv = document.getElementById(localtime);
          if (timeDiv) {
              timeDiv.innerHTML = `Local Time: ${formattedTime}`;
          }
      } else {
          const timeDiv = document.getElementById(localtime);
          if (timeDiv) {
              timeDiv.innerHTML = "Local Time: Unavailable";
          }
      }
  })
  .catch(error => {
      console.error('Error fetching local time:', error);
      const timeDiv = document.getElementById(localtime);
      if (timeDiv) {
          timeDiv.innerHTML = "Local Time: Unavailable";
      }
  });
}