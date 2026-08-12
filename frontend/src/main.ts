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

const getWeatherForCity = async (city = defaultCity) => {
  const response = await fetch(`${backendBase}/api/weather?city=${encodeURIComponent(city)}`)
  const data = await response.json()
  return data.weather
}

const render = async () => {
  const greeting = await getGreeting(defaultName)
  const weather = await getWeatherForCity(defaultCity)

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
            <option value="Dallas" selected>Dallas</option>
            <option value="Austin">Austin</option>
            <option value="Houston">Houston</option>
            <option value="Chicago">Chicago</option>
            <option value="New York">New York</option>
          </select>
        </div>
        <div class="weather-row">
          <span class="weather-temp">${weather}</span>
        </div>
      </section>
    </main>
  `

  const citySelect = document.querySelector<HTMLSelectElement>('#city-select')
  const weatherTemp = document.querySelector<HTMLSpanElement>('.weather-temp')

  citySelect?.addEventListener('change', async (event) => {
    const selectedCity = (event.target as HTMLSelectElement).value
    weatherTemp!.textContent = await getWeatherForCity(selectedCity)
  })
}

render()
