import { icons } from '../utils/icons.js'

const NAV_ITEMS = [
    { key: 'home', label: 'Home' },
    { key: 'decide', label: 'Pulse' },
    { key: 'saved', label: 'Saved' },
    { key: 'schedule', label: 'Schedule' },
    { key: 'society', label: 'Society' },
]

export function createTopBar(activePage, onNavigate) {
    const header = document.createElement('header')
    header.className = `
        sticky top-0 z-40
        bg-bg-secondary/80 backdrop-blur-xl
        border-b border-border
    `

    header.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">

            <!-- LEFT -->
            <div class="flex items-center gap-3">
                <img
                    src="/logo.svg"
                    alt="Unify"
                    class="h-7 w-auto cursor-pointer"
                    id="logo-btn"
                />
            </div>

            <!-- CENTER NAV (DESKTOP ONLY) -->
            <nav class="hidden md:flex items-center gap-6">
                ${NAV_ITEMS.map(item => `
                    <button
                        data-nav="${item.key}"
                        class="
                            relative text-sm font-medium
                            transition
                            ${
                                activePage === item.key
                                    ? 'text-primary'
                                    : 'text-text-secondary hover:text-text-primary'
                            }
                        "
                    >
                        ${item.label}
                        ${
                            activePage === item.key
                                ? `<span class="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary rounded-full"></span>`
                                : ''
                        }
                    </button>
                `).join('')}
            </nav>

            <!-- RIGHT -->
            <div class="flex items-center gap-2">
                <button
                    id="notifications-btn"
                    class="p-2 rounded-xl hover:bg-surface active:scale-95 transition"
                >
                    ${icons.Bell()}
                </button>

                <button
                    id="profile-btn"
                    class="p-2 rounded-xl hover:bg-surface active:scale-95 transition"
                >
                    ${icons.User()}
                </button>
            </div>
        </div>
    `

    /* =========================
       EVENTS
    ========================== */

    // Logo → Home
    header.querySelector('#logo-btn')
        ?.addEventListener('click', () => {
            onNavigate('home')
        })

    // Desktop nav buttons
    header.querySelectorAll('[data-nav]').forEach(btn => {
        btn.addEventListener('click', () => {
            onNavigate(btn.dataset.nav)
        })
    })

    return header
}
