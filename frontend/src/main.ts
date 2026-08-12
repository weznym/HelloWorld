import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('App root not found')
}

const backendBase = 'http://127.0.0.1:8000'
const defaultCity = 'Dallas'
const defaultName = 'Wesley'

const getGreeting = async (name = defaultName) => {
  const response = await fetch(`${backendBase}/api/greeting?name=${encodeURIComponent(name)}`)
  const data = await response.json()
  return data.greeting
}

const resolveCurrentCity = async (): Promise<string> => {
  if (!('geolocation' in navigator)) {
    return defaultCity
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                'Accept-Language': 'en',
              },
            },
          )

          const data = await response.json()
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.municipality ||
            defaultCity

          resolve(city)
        } catch {
          resolve(defaultCity)
        }
      },
      () => resolve(defaultCity),
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    )
  })
}

const getWeatherForCity = async (city = defaultCity) => {
  const response = await fetch(`${backendBase}/api/weather?city=${encodeURIComponent(city)}`)
  const data = await response.json()
  return data.weather
}

const getWeatherIcon = (weatherText: string) => {
  const text = weatherText.toLowerCase()

  if (text.includes('sun') || text.includes('clear')) return '☀️'
  if (text.includes('cloud')) return '☁️'
  if (text.includes('rain') || text.includes('drizzle')) return '🌧️'
  if (text.includes('storm') || text.includes('thunder')) return '⛈️'
  if (text.includes('snow')) return '❄️'
  if (text.includes('fog') || text.includes('mist')) return '🌫️'

  return '🌤️'
}

const renderLoadingState = () => {
  app.innerHTML = `
    <main class="dashboard">
      <section class="card weather-card">
        <p class="eyebrow">City weather</p>
        <div class="loading-row" aria-live="polite">
          <span class="loading-spinner" aria-hidden="true"></span>
          <span>Detecting your location…</span>
        </div>
      </section>
    </main>
  `
}

const render = async () => {
  renderLoadingState()

  const detectedCity = await resolveCurrentCity()
  const greeting = await getGreeting(defaultName)
  const weather = await getWeatherForCity(detectedCity)

  const cityOptions = Array.from(
    new Set(['Dallas', 'Austin', 'Houston', 'Chicago', 'New York', detectedCity]),
  )

  app.innerHTML = `
    <main class="dashboard">
      <section class="card greeting-card">
        <p class="eyebrow">Personal greeting</p>
        <h1>${greeting}</h1>
      </section>

      <section class="card weather-card">
        <p class="eyebrow">City weather</p>
        <label for="city-select" class="city-label">Choose a city</label>
        <div class="input-row weather-row">
          <select id="city-select" name="city">
            ${cityOptions
              .map(
                (city) =>
                  `<option value="${city}" ${city === detectedCity ? 'selected' : ''}>${city}</option>`,
              )
              .join('')}
          </select>
        </div>
        <div class="weather-row weather-display">
          <span class="weather-icon" aria-label="weather icon">${getWeatherIcon(weather)}</span>
          <span class="weather-temp">${weather}</span>
        </div>
      </section>
    </main>
  `

  const citySelect = document.querySelector<HTMLSelectElement>('#city-select')
  const weatherTemp = document.querySelector<HTMLSpanElement>('.weather-temp')
  const weatherIcon = document.querySelector<HTMLSpanElement>('.weather-icon')

  citySelect?.addEventListener('change', async (event) => {
    const selectedCity = (event.target as HTMLSelectElement).value
    const updatedWeather = await getWeatherForCity(selectedCity)

    weatherTemp!.textContent = updatedWeather
    weatherIcon!.textContent = getWeatherIcon(updatedWeather)
  })
}

render()
