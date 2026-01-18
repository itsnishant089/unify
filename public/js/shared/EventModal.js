import { icons } from '../utils/icons.js'

let currentModal = null

export function showEventModal(event, onAction, onClose) {
    if (!event) return

    // Remove existing modal
    if (currentModal) {
        currentModal.backdrop.remove()
        currentModal.modal.remove()
        currentModal = null
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        })
    }

    const today = new Date()
    const deadlineDate = new Date(event.registrationDeadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const isUrgent = daysUntil <= 1 && daysUntil >= 0
    const isSoon = daysUntil <= 3 && daysUntil >= 0

    /* ---------- BACKDROP ---------- */
    const backdrop = document.createElement('div')
    backdrop.className =
        'fixed inset-0 bg-black/60 backdrop-blur-sm z-50'
    backdrop.addEventListener('click', closeModal)

    /* ---------- MODAL ---------- */
    const modal = document.createElement('div')
    modal.className =
        'fixed inset-0 z-50 flex items-end justify-center p-4'

    const modalContent = document.createElement('div')
    modalContent.className = `
        w-full max-w-2xl bg-bg-secondary rounded-3xl shadow-2xl
        max-h-[92vh] overflow-y-auto modal-safe-bottom
    `
    modalContent.addEventListener('click', e => e.stopPropagation())

    modalContent.innerHTML = `
        ${event.image ? `
            <div class="relative h-64 overflow-hidden rounded-t-3xl">
                <img src="${event.image}" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                <button id="modal-close-btn"
                    class="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white">
                    ${icons.X()}
                </button>
            </div>
        ` : `
            <div class="p-6 border-b border-border flex justify-end">
                <button id="modal-close-btn"
                    class="p-2 rounded-full bg-surface">
                    ${icons.X()}
                </button>
            </div>
        `}

        <div class="p-6 space-y-6">
            <div>
                <h2 class="text-3xl font-bold mb-2">${event.title}</h2>
                <p class="text-text-secondary">${event.description}</p>
            </div>

            <div class="space-y-2 text-sm">
                <div class="flex gap-2">${icons.Calendar()} ${formatDate(event.eventDate)}</div>
                <div class="flex gap-2">${icons.Users()} ${event.audience}</div>
                <div class="flex gap-2">${icons.Clock()} ${event.duration}</div>
                <div class="flex gap-2">${icons.Building2()} ${event.hostingSociety}</div>
                <div class="flex gap-2">
                    ${icons.AlertCircle()} Deadline: ${formatDate(event.registrationDeadline)}
                    ${isUrgent || isSoon ? `
                        <span class="px-2 py-0.5 text-xs rounded-full bg-warning/10 text-warning">
                            ${isUrgent ? 'Urgent' : `${daysUntil}d left`}
                        </span>` : ''}
                </div>
            </div>

            ${!event.isRegistered ? `
                <div class="pt-4 border-t border-border flex gap-3">
                    <button id="modal-save-btn"
                        class="flex-1 py-3 px-4 rounded-xl bg-surface border border-border 
                               text-text-primary font-semibold flex items-center justify-center gap-2">
                        ${icons.Bookmark()}
                        <span>Save</span>
                    </button>
                    <button id="modal-register-btn"
                        class="flex-1 py-3 px-4 rounded-xl bg-primary text-white font-semibold 
                               flex items-center justify-center gap-2 shadow-lg shadow-primary/30">
                        ${icons.CheckCircle2()}
                        <span>Register</span>
                    </button>
                </div>
            ` : `
                <div class="py-3 text-center bg-success/10 text-success rounded-xl">
                    ✓ Already Registered
                </div>
            `}
        </div>
    `

    modal.appendChild(modalContent)
    document.body.append(backdrop, modal)

    currentModal = { backdrop, modal }

    /* ---------- ACTIONS ---------- */
    modalContent.querySelector('#modal-close-btn')?.addEventListener('click', closeModal)

    modalContent.querySelector('#modal-save-btn')?.addEventListener('click', () => {
        onAction?.('save')
        showToast('Event saved')
        closeModal()
    })

    modalContent.querySelector('#modal-register-btn')?.addEventListener('click', () => {
        closeModal()
        showRegisterPopup(event, onAction)
    })

    function closeModal() {
        if (!currentModal) return
        currentModal.backdrop.remove()
        currentModal.modal.remove()
        currentModal = null
        onClose?.()
    }
}

/* =========================
   REGISTER POPUP
========================= */
function showRegisterPopup(event, onAction) {
    const backdrop = document.createElement('div')
    backdrop.className = 'fixed inset-0 bg-black/50 z-50'

    const modal = document.createElement('div')
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4'

    const box = document.createElement('div')
    box.className = 'bg-bg-secondary w-full max-w-md rounded-2xl p-6'

    box.innerHTML = `
        <h3 class="text-lg font-semibold mb-4">
            Register for ${event.title}
        </h3>

        <form id="register-form" class="space-y-4">
            <input class="w-full px-4 py-3 rounded-xl bg-surface border"
                value="Yash Rathore" />
            <input class="w-full px-4 py-3 rounded-xl bg-surface border"
                value="yash@example.com" />

            <button type="submit"
                class="w-full py-3 rounded-xl bg-primary text-white font-semibold">
                Submit
            </button>
        </form>
    `

    modal.appendChild(box)
    document.body.append(backdrop, modal)

    box.querySelector('#register-form').addEventListener('submit', e => {
        e.preventDefault()
        onAction?.('register')
        backdrop.remove()
        modal.remove()
        showToast('Registered successfully')
    })

    backdrop.addEventListener('click', () => {
        backdrop.remove()
        modal.remove()
    })
}

/* =========================
   TOAST
========================= */
function showToast(message) {
    const toast = document.createElement('div')
    toast.className = `
        fixed bottom-24 left-1/2 -translate-x-1/2
        bg-black text-white px-4 py-2 rounded-xl text-sm z-50
    `
    toast.textContent = message
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 2000)
}

export function closeEventModal() {
    if (currentModal) {
        currentModal.backdrop.remove()
        currentModal.modal.remove()
        currentModal = null
    }
}
