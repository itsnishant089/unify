import { icons } from '../utils/icons.js'

export function createBottomNav(activePage, onPageChange) {
    const nav = document.createElement('nav')

    nav.className = `
        fixed bottom-0 left-0 right-0
        bg-bg-secondary
        border-t border-border
        z-[100]
        shadow-lg
        safe-area-inset-bottom
        will-change-transform
    `

    const navItems = [
        { id: 'home', label: 'Home', icon: icons.Home },
        { id: 'decide', label: 'Pulse', icon: icons.CheckCircle2 },
        { id: 'saved', label: 'Saved', icon: icons.Bookmark },
        { id: 'schedule', label: 'Schedule', icon: icons.Calendar },
        { id: 'society', label: 'Society', icon: icons.Users },
    ]

    nav.innerHTML = `
        <div class="flex justify-around items-center h-16 max-w-md mx-auto px-1">
            ${navItems.map(item => {
                const isActive = activePage === item.id
                return `
                    <button
                        data-page="${item.id}"
                        class="flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-all active:scale-[0.96] ${
                            isActive
                                ? 'text-primary'
                                : 'text-text-muted hover:text-text-secondary'
                        }"
                    >
                        <div class="p-2.5 rounded-xl ${
                            isActive ? 'bg-primary/10' : ''
                        }">
                            ${item.icon()}
                        </div>
                        <span class="text-[11px] ${
                            isActive ? 'font-semibold' : 'font-medium'
                        }">
                            ${item.label}
                        </span>
                    </button>
                `
            }).join('')}
        </div>
    `

    nav.querySelectorAll('button[data-page]').forEach(btn => {
        btn.addEventListener('click', () => {
            onPageChange(btn.getAttribute('data-page'))
        })
    })

    return nav
}
