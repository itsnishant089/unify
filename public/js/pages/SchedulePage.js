// SchedulePage.js – Fixed, Clickable, Structured

const dummyEvents = [
  {
    id: 1,
    title: 'AI Bootcamp',
    description: 'Hands-on ML and GenAI workshop',
    hostingSociety: 'Tech Club',
    eventDate: '2026-01-20',
    status: 'available',
  },
  {
    id: 2,
    title: 'Design Sprint',
    description: 'Solve UX problems in teams',
    hostingSociety: 'Design Society',
    eventDate: '2026-01-20',
    status: 'saved',
  },
  {
    id: 3,
    title: 'Startup Pitch Night',
    description: 'Pitch ideas to founders',
    hostingSociety: 'E-Cell',
    eventDate: '2026-01-23',
    status: 'registered',
  },
]

export function renderSchedulePage(container) {
  let viewMode = 'monthly'
  let selectedDate = null

  /* ---------- GROUP EVENTS ---------- */
  const eventsByDate = {}
  dummyEvents.forEach(e => {
    eventsByDate[e.eventDate] ||= []
    eventsByDate[e.eventDate].push(e)
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const getTileClass = events => {
    if (events.some(e => e.status === 'registered')) return 'heatmap-registered'
    if (events.some(e => e.status === 'saved')) return 'heatmap-saved'
    if (events.length) return 'heatmap-available'
    return ''
  }

  const getDays = () => {
    const days = []
    const count = viewMode === 'weekly' ? 7 : 28

    for (let i = 0; i < count; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() + i)
      const key = d.toISOString().slice(0, 10)
      days.push({
        key,
        date: d.getDate(),
        events: eventsByDate[key] || [],
      })
    }
    return days
  }

  /* ---------- EVENTS LIST ---------- */
  const renderEvents = () => {
    if (!selectedDate) {
      return `
        <div class="text-center text-text-muted text-sm mt-6">
          Select a date to see events
        </div>
      `
    }

    const events = eventsByDate[selectedDate] || []

    if (!events.length) {
      return `
        <div class="text-center text-text-muted text-sm mt-6">
          No events on this day
        </div>
      `
    }

    return `
      <div class="mt-4 space-y-3 fade-in">
        ${events
          .map(
            e => `
          <div
            class="card p-4 card-hover"
            data-event-id="${e.id}"
            style="cursor:pointer"
          >
            <h3 class="font-semibold mb-1">${e.title}</h3>
            <p class="text-sm text-text-secondary mb-2">
              ${e.description}
            </p>
            <div class="flex justify-between items-center text-xs text-text-muted">
              <span>${e.hostingSociety}</span>
              <span class="chip">${e.status}</span>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    `
  }

  /* ---------- RENDER ---------- */
  const render = () => {
    const days = getDays()

    container.innerHTML = `
      <div class="px-4 pt-4 pb-24">

        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-bold">Scheduled Events</h2>
          <div class="flex bg-surface rounded-lg p-1">
            <button id="weekBtn"
              class="px-3 py-1 text-sm rounded-md ${
                viewMode === 'weekly'
                  ? 'bg-primary text-white'
                  : 'text-text-secondary'
              }">Week</button>
            <button id="monthBtn"
              class="px-3 py-1 text-sm rounded-md ${
                viewMode === 'monthly'
                  ? 'bg-primary text-white'
                  : 'text-text-secondary'
              }">Month</button>
          </div>
        </div>

        <!-- CALENDAR CARD -->
        <div class="card p-4 mb-4">
          <div class="heatmap">
            ${days
              .map(
                d => `
              <div
                class="heatmap-cell ${getTileClass(d.events)} ${
                  selectedDate === d.key ? 'active' : ''
                }"
                data-date="${d.key}"
              >
                ${d.date}
              </div>
            `
              )
              .join('')}
          </div>
        </div>

        <!-- EVENTS -->
        <div id="events-area">
          ${renderEvents()}
        </div>

      </div>
    `

    /* ---------- LISTENERS ---------- */
    container.querySelectorAll('.heatmap-cell').forEach(cell => {
      cell.addEventListener('click', () => {
        selectedDate = cell.dataset.date
        render()
      })
    })

    container.querySelector('#weekBtn').onclick = () => {
      viewMode = 'weekly'
      selectedDate = null
      render()
    }

    container.querySelector('#monthBtn').onclick = () => {
      viewMode = 'monthly'
      selectedDate = null
      render()
    }

    container.querySelectorAll('[data-event-id]').forEach(card => {
      card.onclick = () => {
        console.log('Clicked event:', card.dataset.eventId)
        // later → open modal
      }
    })
  }

  render()
}
