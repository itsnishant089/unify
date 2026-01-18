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
                <h2 class="text-xl font-bold mb-4">
                    Register for ${event.title}
                </h2>

                <div class="space-y-4">
                    <input id="reg-name" class="w-full p-3 rounded-xl border"
                        value="${currentUser.name}" />

                    <input id="reg-email" class="w-full p-3 rounded-xl border"
                        value="${currentUser.email}" />

                    <input id="reg-college" class="w-full p-3 rounded-xl border"
                        value="${currentUser.college}" />
                </div>

                <button
                    id="submit-register"
                    class="w-full mt-6 py-3 btn-primary rounded-xl font-semibold">
                    Submit Registration
                </button>
            </div>
        `

        modal.addEventListener('click', e => {
            if (e.target === modal) modal.remove()
        })

        modal.querySelector('#submit-register').addEventListener('click', () => {
            console.log('Registered:', event.id)

            // simulate success
            modal.querySelector('#submit-register').textContent = 'Registered ✓'
            modal.querySelector('#submit-register').disabled = true

            setTimeout(() => {
                modal.remove()
                index++
                render()
            }, 600)
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
                index++
                render()
            }, 350)
        } else if (dir === 'up') {
            // Swipe UP → Skip
            card.classList.add('swipe-up')
            setTimeout(() => {
                index++
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

        // Check vertical swipe first (UP), then horizontal
        if (absDy > absDx && dy < -threshold) {
            // Swipe UP → Skip
            handleSwipe('up')
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

                <div id="swipe-card" class="absolute inset-0 decide-card touch-none">

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
