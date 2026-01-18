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

        if (dir === 'right') {
            openRegisterModal(event)
        } else {
            index++
            render()
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

        card.style.transform =
            `translate(${dx}px, ${dy}px) rotate(${dx * 0.06}deg)`

        if (dx > 50) {
            intent.className = 'swipe-intent visible right'
            intent.innerHTML = `<span>REGISTER</span>`
        } else if (dx < -50) {
            intent.className = 'swipe-intent visible left'
            intent.innerHTML = `<span>SAVE</span>`
        } else {
            intent.className = 'swipe-intent'
            intent.innerHTML = ''
        }
    }

    const onEnd = e => {
        if (!dragging) return
        dragging = false

        const dx = e.changedTouches[0].clientX - startX
        const threshold = 90

        if (dx > threshold) handleSwipe('right')
        else if (dx < -threshold) handleSwipe('left')
        else render()
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
