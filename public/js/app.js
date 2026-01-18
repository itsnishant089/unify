import { createTopBar } from './shared/TopBar.js'
import { createBottomNav } from './navigation/BottomNav.js'
import { renderHomePage } from './pages/HomePage.js'
import { renderDecidePage } from './pages/DecidePage.js'
import { renderSavedPage } from './pages/SavedPage.js'
import { renderSchedulePage } from './pages/SchedulePage.js'
import { renderSocietyPage } from './pages/SocietyPage.js'
import { renderLoginPage } from './auth/LoginPage.js'
import { renderSignupPage } from './auth/SignupPage.js'
import { showOverlayMenu, closeOverlayMenu } from './shared/OverlayMenu.js'

let isAuthenticated = false
let showLogin = true
let activePage = 'home'

const app = document.getElementById('app')

/* =========================
   HELPERS
========================= */
const isMobile = () => window.matchMedia('(max-width: 768px)').matches

/* =========================
   AUTH HANDLERS
========================= */
const handleLogin = (email, password) => {
    console.log('Login:', email, password)
    isAuthenticated = true
    render()
}

const handleSignup = (data) => {
    console.log('Signup:', data)
    isAuthenticated = true
    render()
}

/* =========================
   PAGE ROUTING
========================= */
const handlePageChange = (page) => {
    activePage = page
    closeOverlayMenu()
    render()
}

const renderPage = (container) => {
    switch (activePage) {
        case 'home':
            renderHomePage(container)
            break
        case 'decide':
            renderDecidePage(container)
            break
        case 'saved':
            renderSavedPage(container)
            break
        case 'schedule':
            renderSchedulePage(container)
            break
        case 'society':
            renderSocietyPage(container)
            break
        default:
            renderHomePage(container)
    }
}

/* =========================
   MAIN RENDER
========================= */
const render = () => {
    app.innerHTML = ''

    /* ---------- AUTH FLOW ---------- */
    if (!isAuthenticated) {
        if (showLogin) {
            renderLoginPage(app, handleLogin, () => {
                showLogin = false
                render()
            })
        } else {
            renderSignupPage(app, handleSignup, () => {
                showLogin = true
                render()
            })
        }
        return
    }

    /* ---------- MAIN CONTAINER ---------- */
    const mainContainer = document.createElement('div')
    mainContainer.className = 'min-h-screen bg-bg-primary'

    /* ---------- TOP BAR ---------- */
    const topBar = createTopBar(
        activePage,
        handlePageChange
    )
    mainContainer.appendChild(topBar)

    /* ---------- PAGE CONTENT ---------- */
    const pageContainer = document.createElement('div')
    pageContainer.id = 'page-container'

    // spacing logic
    pageContainer.className = isMobile()
        ? 'pb-[84px]'
        : 'pt-4 max-w-7xl mx-auto w-full px-6'

    mainContainer.appendChild(pageContainer)
    app.appendChild(mainContainer)

    renderPage(pageContainer)

    /* ---------- BOTTOM NAV (MOBILE ONLY) ---------- */
    if (isMobile()) {
        const bottomNav = createBottomNav(activePage, handlePageChange)
        app.appendChild(bottomNav)
    }

    /* =========================
       TOP BAR INTERACTIONS
    ========================== */
    const profileBtn = topBar.querySelector('#profile-btn')
    const notificationsBtn = topBar.querySelector('#notifications-btn')

    /* ---- PROFILE MENU ---- */
    profileBtn?.addEventListener('click', (e) => {
        e.stopPropagation()

        showOverlayMenu(profileBtn, `
            <div class="space-y-3">
                <p class="text-sm font-semibold text-text-primary">
                    Yash Rathore
                </p>

                <button
                    class="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-surface">
                    My Profile
                </button>

                <button
                    class="w-full text-left text-sm px-3 py-2 rounded-lg hover:bg-surface">
                    Settings
                </button>

                <button
                    id="logout-btn"
                    class="w-full text-left text-sm px-3 py-2 rounded-lg
                           text-red-600 hover:bg-red-50">
                    Logout
                </button>
            </div>
        `)

        setTimeout(() => {
            document.querySelector('#logout-btn')
                ?.addEventListener('click', () => {
                    isAuthenticated = false
                    showLogin = true
                    closeOverlayMenu()
                    render()
                })
        }, 0)
    })

    /* ---- NOTIFICATIONS MENU ---- */
    notificationsBtn?.addEventListener('click', (e) => {
        e.stopPropagation()

        showOverlayMenu(notificationsBtn, `
            <div class="space-y-3">
                <p class="text-sm font-semibold text-text-primary">
                    Notifications
                </p>

                <div class="text-sm text-text-secondary">
                    No new notifications
                </div>
            </div>
        `)
    })
}

/* =========================
   RE-RENDER ON RESIZE
========================= */
window.addEventListener('resize', () => {
    render()
})

/* =========================
   INIT
========================= */
render()
