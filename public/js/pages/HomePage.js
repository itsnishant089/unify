import { createEventCard } from '../shared/EventCard.js'
import { showEventModal } from '../shared/EventModal.js'
import { icons } from '../utils/icons.js'
import { mockEvents } from '../../data/mockData.js'

export function renderHomePage(container) {
    const featuredEvents = mockEvents.filter(e => e.isFeatured)
    const categories = ['All', 'Technology', 'Design', 'Business', 'Arts']

    let searchQuery = ''
    let selectedCategory = null
    let showFilters = false

    const handleAction = (eventId, action) => {
        console.log(`Action ${action} for event ${eventId}`)
    }

    const handleCardClick = (event) => {
        showEventModal(event, (action) => handleAction(event.id, action))
    }

    const getFilteredEvents = () => {
        return mockEvents.filter(event => {
            const matchesSearch =
                event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.description.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesCategory =
                !selectedCategory ||
                selectedCategory === 'All' ||
                event.category === selectedCategory

            return matchesSearch && matchesCategory
        })
    }

    const getEventsByCategory = () => {
        return categories.slice(1).map(category => ({
            category,
            events: getFilteredEvents().filter(e => e.category === category),
        }))
    }

    const render = () => {
        const eventsByCategory = getEventsByCategory()

        container.innerHTML = `
            <div class="px-4 py-6 space-y-12 fade-in">

                <!-- FEATURED SECTION -->
                ${featuredEvents.length ? `
                <section class="featured-wrapper">
                    <div class="flex items-start justify-between mb-4">
                        <div>
                            <h2 class="text-xl font-bold text-text-primary">
                                Featured Events
                            </h2>
                            <p class="text-sm text-text-muted mt-1">
                                Hand-picked opportunities you shouldn’t miss
                            </p>
                        </div>
                        <span class="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                            Featured
                        </span>
                    </div>

                    <div class="featured-scroll">
                        ${featuredEvents.map(() => `
                            <div class="featured-card"></div>
                        `).join('')}
                    </div>
                </section>
                ` : ''}

                <!-- SEARCH + FILTER -->
                <section class="space-y-4">
                    <div class="flex items-center gap-3">
                        <div class="relative flex-1">
                            <div class="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
                                ${icons.Search()}
                            </div>
                            <input
                                id="search-input"
                                type="text"
                                value="${searchQuery}"
                                placeholder="Search events"
                                class="w-full pl-10 pr-4 py-3 rounded-xl
                                       bg-surface border border-border text-sm
                                       focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        <button
                            id="filter-toggle-btn"
                            class="p-3 rounded-xl border border-border bg-bg-secondary"
                        >
                            ${icons.Filter()}
                        </button>
                    </div>

                    <div id="filter-panel" class="${showFilters ? '' : 'hidden'}">
                        <div class="bg-bg-secondary border border-border rounded-2xl p-4">
                            <div class="flex flex-wrap gap-2">
                                ${categories.map(cat => `
                                    <button
                                        data-category="${cat}"
                                        class="px-4 py-2 rounded-xl text-sm font-medium ${
                                            (cat === 'All' && !selectedCategory) || selectedCategory === cat
                                                ? 'bg-primary text-white'
                                                : 'bg-surface border border-border text-text-secondary'
                                        }"
                                    >
                                        ${cat}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </section>

                <!-- CATEGORY SECTIONS -->
                ${eventsByCategory.map(({ category, events }) => {
                    if (!events.length) return ''
                    return `
                        <section class="space-y-4">
                            <h3 class="text-lg font-semibold">${category}</h3>

                            <div class="overflow-x-auto scrollbar-hide -mx-4 px-4">
                                <div class="flex gap-4 pb-2 w-max" data-cards="${category}"></div>
                            </div>
                        </section>
                    `
                }).join('')}
            </div>
        `

        /* ---------- FEATURED CARDS ---------- */
        const featuredScroll = container.querySelector('.featured-scroll')
        if (featuredScroll) {
            featuredScroll.innerHTML = ''
            featuredEvents.forEach(event => {
                const wrapper = document.createElement('div')
                wrapper.className = 'featured-card'

                const card = createEventCard(
                    event,
                    'horizontal',
                    (action) => handleAction(event.id, action),
                    handleCardClick
                )

                wrapper.appendChild(card)
                featuredScroll.appendChild(wrapper)
            })

            initFeaturedAutoScroll(featuredScroll)
        }

        /* ---------- CATEGORY CARDS ---------- */
        eventsByCategory.forEach(({ category, events }) => {
            const cardsContainer = container.querySelector(`[data-cards="${category}"]`)
            if (!cardsContainer) return

            cardsContainer.innerHTML = ''
            events.forEach(event => {
                const card = createEventCard(
                    event,
                    'horizontal',
                    (action) => handleAction(event.id, action),
                    handleCardClick
                )
                cardsContainer.appendChild(card)
            })
        })

        /* ---------- EVENTS ---------- */
        container.querySelector('#search-input')
            ?.addEventListener('input', e => {
                searchQuery = e.target.value
                render()
            })

        container.querySelector('#filter-toggle-btn')
            ?.addEventListener('click', () => {
                showFilters = !showFilters
                render()
            })

        container.querySelectorAll('[data-category]').forEach(btn => {
            btn.addEventListener('click', () => {
                const cat = btn.dataset.category
                selectedCategory = cat === 'All' ? null : cat
                render()
            })
        })
    }

    render()
}

/* =========================
   FEATURED AUTO SCROLL
========================= */
function initFeaturedAutoScroll(container) {
    let paused = false

    const scroll = () => {
        if (paused) return

        const max = container.scrollWidth - container.clientWidth
        if (container.scrollLeft >= max - 5) {
            container.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
            container.scrollBy({ left: 320, behavior: 'smooth' })
        }
    }

    const interval = setInterval(scroll, 3500)

    container.addEventListener('touchstart', () => paused = true)
    container.addEventListener('touchend', () => paused = false)
    container.addEventListener('mouseenter', () => paused = true)
    container.addEventListener('mouseleave', () => paused = false)

    // cleanup safety
    container._autoScrollCleanup = () => clearInterval(interval)
}
