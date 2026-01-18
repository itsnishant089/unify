import { icons } from '../utils/icons.js'
import { mockEvents } from '../../data/mockData.js'

const currentUser = {
    name: 'Yash Rathore',
    email: 'yash@email.com',
    college: 'DCRUST',
}

export function renderDecidePage(container) {
    const events = mockEvents.filter(e => !e.isRegistered)
    let index = 0
    const eventHistory = [] // Track event history for swipe down (previous)

    let startX = 0
    let startY = 0
    let dragging = false

    const haptic = ms => {
        if ('vibrate' in navigator) navigator.vibrate(ms)
    }

    /* =========================
       REGISTER MODAL (WORKING)
    ========================= */
    const openRegisterModal = event => {
        const modal = document.createElement('div')
        modal.className = 'register-modal'

        modal.innerHTML = `
            <div class="register-card fade-in">
                <button id="modal-close-btn" class="absolute top-4 right-4 p-2 rounded-full bg-surface hover:bg-surface/80 transition-colors">
                    ${icons.X()}
                </button>

                <h2 class="text-2xl font-bold mb-2 text-text-primary">
                    Register for Event
                </h2>
                <p class="text-sm text-text-secondary mb-6">${event.title}</p>

                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-semibold text-text-primary mb-2">Full Name</label>
                        <input id="reg-name" type="text" 
                            class="w-full px-4 py-3 rounded-xl bg-surface border border-border 
                                   text-text-primary placeholder-text-muted
                                   focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                            value="${currentUser.name}" />
                    </div>

                    <div>
                        <label class="block text-sm font-semibold text-text-primary mb-2">Email</label>
                        <input id="reg-email" type="email" 
                            class="w-full px-4 py-3 rounded-xl bg-surface border border-border 
                                   text-text-primary placeholder-text-muted
                                   focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                            value="${currentUser.email}" />
                    </div>

                    <div>
                        <label class="block text-sm font-semibold text-text-primary mb-2">College</label>
                        <input id="reg-college" type="text" 
                            class="w-full px-4 py-3 rounded-xl bg-surface border border-border 
                                   text-text-primary placeholder-text-muted
                                   focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                            value="${currentUser.college}" />
                    </div>
                </div>

                <div class="mt-6 flex gap-3">
                    <button
                        id="cancel-register"
                        class="flex-1 py-3 px-4 rounded-xl bg-surface border border-border 
                               text-text-secondary font-semibold hover:bg-surface/80 transition-colors">
                        Cancel
                    </button>
                    <button
                        id="submit-register"
                        class="flex-1 py-3 px-4 rounded-xl bg-primary text-white font-semibold
                               hover:bg-primary-hover transition-colors shadow-lg shadow-primary/30">
                        Submit Registration
                    </button>
                </div>
            </div>
        `

        modal.addEventListener('click', e => {
            if (e.target === modal) modal.remove()
        })

        const closeModal = () => modal.remove()

        modal.querySelector('#modal-close-btn')?.addEventListener('click', closeModal)
        modal.querySelector('#cancel-register')?.addEventListener('click', closeModal)

        modal.querySelector('#submit-register').addEventListener('click', () => {
            console.log('Registered:', event.id)

            const submitBtn = modal.querySelector('#submit-register')
            submitBtn.textContent = 'Registered ✓'
            submitBtn.disabled = true
            submitBtn.classList.remove('hover:bg-primary-hover')
            submitBtn.classList.add('bg-success', 'cursor-not-allowed')

            setTimeout(() => {
                modal.remove()
                // Save current index to history before moving forward
                if (index >= 0) eventHistory.push(index)
                index++
                render()
            }, 800)
        })

        document.body.appendChild(modal)
    }

    /* =========================
       SWIPE LOGIC
    ========================= */
    const handleSwipe = dir => {
        const event = events[index]
        if (!event) return

        haptic(12)
        const card = container.querySelector('#swipe-card')

        if (dir === 'right') {
            // Swipe RIGHT → Register
            card.classList.add('swipe-right')
            setTimeout(() => {
                openRegisterModal(event)
            }, 200)
        } else if (dir === 'left') {
            // Swipe LEFT → Save
            card.classList.add('swipe-left')
            // Mark event as saved
            event.isSaved = true
            console.log('Event saved:', event.id)
            setTimeout(() => {
                // Save current index to history before moving forward
                if (index >= 0) eventHistory.push(index)
                index++
                render()
            }, 350)
        } else if (dir === 'up') {
            // Swipe UP → Skip
            card.classList.add('swipe-up')
            setTimeout(() => {
                // Save current index to history before moving forward
                if (index >= 0) eventHistory.push(index)
                index++
                render()
            }, 350)
        } else if (dir === 'down') {
            // Swipe DOWN → Previous event
            card.classList.add('swipe-down')
            setTimeout(() => {
                if (eventHistory.length > 0) {
                    // Go back to last viewed event
                    index = eventHistory.pop()
                } else if (index > 0) {
                    // Fallback: just go back one if no history
                    index--
                }
                render()
            }, 350)
        }
    }

    const onStart = e => {
        startX = e.touches[0].clientX
        startY = e.touches[0].clientY
        dragging = true
    }

    const onMove = e => {
        if (!dragging) return

        const card = container.querySelector('#swipe-card')
        const intent = container.querySelector('#swipe-intent')

        const dx = e.touches[0].clientX - startX
        const dy = e.touches[0].clientY - startY

        // Determine primary swipe direction (horizontal vs vertical)
        const absDx = Math.abs(dx)
        const absDy = Math.abs(dy)

        if (absDy > absDx && dy < -50) {
            // Swiping UP
            card.style.transform = `translate(${dx}px, ${dy}px)`
            intent.className = 'swipe-intent visible up'
            intent.innerHTML = `<span>SKIP</span>`
        } else if (absDy > absDx && dy > 50 && index > 0) {
            // Swiping DOWN (go to previous event)
            card.style.transform = `translate(${dx}px, ${dy}px)`
            intent.className = 'swipe-intent visible down'
            intent.innerHTML = `<span>PREVIOUS</span>`
        } else if (dx > 50) {
            // Swiping RIGHT
            card.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx * 0.06}deg)`
            intent.className = 'swipe-intent visible right'
            intent.innerHTML = `<span>REGISTER</span>`
        } else if (dx < -50) {
            // Swiping LEFT
            card.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx * 0.06}deg)`
            intent.className = 'swipe-intent visible left'
            intent.innerHTML = `<span>SAVE</span>`
        } else {
            // Default position
            card.style.transform = `translate(${dx}px, ${dy}px) rotate(${dx * 0.03}deg)`
            intent.className = 'swipe-intent'
            intent.innerHTML = ''
        }
    }

    const onEnd = e => {
        if (!dragging) return
        dragging = false

        const card = container.querySelector('#swipe-card')
        const intent = container.querySelector('#swipe-intent')

        const dx = e.changedTouches[0].clientX - startX
        const dy = e.changedTouches[0].clientY - startY
        const threshold = 90

        const absDx = Math.abs(dx)
        const absDy = Math.abs(dy)

        // Check vertical swipe first (UP/DOWN), then horizontal
        if (absDy > absDx && dy < -threshold) {
            // Swipe UP → Skip
            handleSwipe('up')
        } else if (absDy > absDx && dy > threshold && (eventHistory.length > 0 || index > 0)) {
            // Swipe DOWN → Previous event
            handleSwipe('down')
        } else if (dx > threshold) {
            // Swipe RIGHT → Register
            handleSwipe('right')
        } else if (dx < -threshold) {
            // Swipe LEFT → Save
            handleSwipe('left')
        } else {
            // Reset card position
            card.style.transform = ''
            intent.className = 'swipe-intent'
            intent.innerHTML = ''
        }
    }

    /* =========================
       RENDER
    ========================= */
    const render = () => {
        const event = events[index]

        if (!event) {
            container.innerHTML = `
                <div class="min-h-screen flex items-center justify-center">
                    <p class="text-xl text-text-secondary font-semibold">
                        You're all caught up 🎉
                    </p>
                </div>
            `
            return
        }

        container.innerHTML = `
            <div class="decide-root">

                <div id="swipe-intent" class="swipe-intent"></div>

                <div id="swipe-card" class="absolute decide-card touch-none">

                    <div class="decide-hero">
                        <img src="${event.image}" />
                        <div class="decide-hero-overlay"></div>
                    </div>

                    <div class="decide-body">
                        <h2 class="decide-title">${event.title}</h2>
                        <p class="decide-tagline">${event.description}</p>

                        <div class="decide-meta">
                            <span>${icons.Calendar()} ${event.registrationDeadline}</span>
                            <span>${icons.Users()} ${event.audience}</span>
                            <span>${icons.Building2()} ${event.hostingSociety}</span>
                        </div>

                        <div class="decide-chips">
                            ${event.skills.map(s => `<span class="chip">${s}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `

        const card = container.querySelector('#swipe-card')
        card.addEventListener('touchstart', onStart)
        card.addEventListener('touchmove', onMove)
        card.addEventListener('touchend', onEnd)
    }

    render()
}
