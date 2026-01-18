import { createEventCard } from '../shared/EventCard.js'
import { showEventModal } from '../shared/EventModal.js'
import { icons } from '../utils/icons.js'
import { mockEvents } from '../../data/mockData.js'

export function renderSavedPage(container) {
    const savedEvents = mockEvents
        .filter(e => e.isSaved)
        .sort((a, b) => {
            const dateA = new Date(a.registrationDeadline).getTime()
            const dateB = new Date(b.registrationDeadline).getTime()
            return dateA - dateB
        })
    
    const handleAction = (eventId, action) => {
        console.log(`Action ${action} for event ${eventId}`)
    }
    
    const handleCardClick = (event) => {
        showEventModal(event, (action) => handleAction(event.id, action))
    }
    
    const getStatusColor = (deadline) => {
        const today = new Date()
        const deadlineDate = new Date(deadline)
        const diffTime = deadlineDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        
        if (diffDays < 0) return 'text-text-muted bg-surface border-border'
        if (diffDays <= 3) return 'text-warning bg-warning/10 border-warning/20'
        return 'text-text-secondary bg-surface border-border'
    }
    
    container.innerHTML = `
        <div class="px-4 py-6">
            ${savedEvents.length === 0 ? `
                <div class="flex flex-col items-center justify-center py-20">
                    <div class="p-6 bg-bg-secondary rounded-2xl border border-border mb-6">
                        ${icons.Bookmark()}
                    </div>
                    <p class="text-xl font-semibold text-text-secondary mb-2">No saved events</p>
                    <p class="text-sm text-text-muted text-center">
                        Save events you're interested in to track them here
                    </p>
                </div>
            ` : `
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-text-primary mb-2 text-primary">
                        ${savedEvents.length} Saved ${savedEvents.length === 1 ? 'Event' : 'Events'}
                    </h2>
                    <p class="text-sm text-text-muted">
                        Sorted by nearest registration deadline
                    </p>
                </div>
                
                <div class="space-y-4" id="saved-events-list"></div>
            `}
        </div>
    `
    
    if (savedEvents.length > 0) {
        const listContainer = container.querySelector('#saved-events-list')
        savedEvents.forEach(event => {
            const today = new Date()
            const deadlineDate = new Date(event.registrationDeadline)
            const diffTime = deadlineDate.getTime() - today.getTime()
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            const statusColor = getStatusColor(event.registrationDeadline)
            
            const wrapper = document.createElement('div')
            wrapper.className = 'relative'
            
            const card = createEventCard(event, 'default', (action) => handleAction(event.id, action), handleCardClick)
            wrapper.appendChild(card)
            
            const statusBadge = document.createElement('div')
            statusBadge.className = `absolute top-6 right-6 px-3 py-1.5 text-xs font-semibold rounded-lg border ${statusColor}`
            statusBadge.textContent = diffDays < 0 
                ? 'Deadline passed' 
                : diffDays === 0 
                ? 'Deadline today' 
                : `${diffDays}d left`
            
            wrapper.appendChild(statusBadge)
            listContainer.appendChild(wrapper)
        })
    }
}
