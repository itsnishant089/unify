import { icons } from '../utils/icons.js'

export function createEventCard(event, variant = 'default', onAction, onCardClick) {
    const isHorizontal = variant === 'horizontal'
    const card = document.createElement('div')
    
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
    
    const today = new Date()
    const deadlineDate = new Date(event.registrationDeadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const isDeadlineSoon = diffDays <= 3 && diffDays >= 0
    const isDeadlineUrgent = diffDays <= 1 && diffDays >= 0
    
    const cardWidth = isHorizontal ? 'w-[280px] sm:w-[300px]' : 'w-full max-w-md mx-auto'
    
    card.className = `${cardWidth} bg-bg-secondary rounded-2xl border border-border overflow-hidden transition-all duration-200 hover:border-primary hover:shadow-md flex-shrink-0 cursor-pointer`
    
    if (isHorizontal) {
        card.innerHTML = `
            ${event.image ? `
                <div class="relative w-full h-40 overflow-hidden">
                    <img src="${event.image}" alt="${event.title}" class="w-full h-full object-cover" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    ${event.isRegistered ? `
                        <span class="absolute top-3 right-3 px-2.5 py-1 text-xs font-semibold bg-success text-white rounded-full border border-success/20">✓</span>
                    ` : ''}
                </div>
            ` : ''}
            <div class="p-5">
                <div class="flex items-start justify-between mb-3">
                    <h3 class="text-base font-semibold text-text-primary flex-1 pr-2 leading-tight">${event.title}</h3>
                    ${!event.image && event.isRegistered ? `
                        <span class="px-2.5 py-1 text-xs font-semibold bg-success/10 text-success rounded-full border border-success/20">✓</span>
                    ` : ''}
                </div>
                <p class="text-sm text-text-secondary mb-3 line-clamp-2 leading-relaxed">${event.description}</p>
                <div class="flex items-center gap-3 text-xs mb-3">
                    <div class="flex items-center gap-1.5">
                        ${icons.Clock()}
                        <span class="font-medium text-text-secondary">${event.duration}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                        ${icons.Users()}
                        <span class="font-medium text-text-secondary">${event.audience}</span>
                    </div>
                </div>
                <div class="mb-3">
                    ${isDeadlineUrgent ? `
                        <div class="flex items-center gap-2 px-3 py-1.5 bg-warning/10 border border-warning/30 rounded-lg">
                            ${icons.AlertCircle()}
                            <span class="text-xs font-semibold text-warning">
                                ${diffDays === 0 ? 'Deadline Today!' : 'Deadline Tomorrow!'}
                            </span>
                        </div>
                    ` : isDeadlineSoon ? `
                        <div class="flex items-center gap-2 px-3 py-1.5 bg-warning/10 border border-warning/20 rounded-lg">
                            ${icons.Calendar()}
                            <span class="text-xs font-medium text-warning">${diffDays}d left</span>
                        </div>
                    ` : `
                        <div class="flex items-center gap-2 text-xs text-text-muted">
                            ${icons.Calendar()}
                            <span>Deadline: ${formatDate(event.registrationDeadline)}</span>
                        </div>
                    `}
                </div>
            </div>
        `
    } else {
        card.innerHTML = `
            ${event.image ? `
                <div class="relative w-full h-48 overflow-hidden">
                    <img src="${event.image}" alt="${event.title}" class="w-full h-full object-cover" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    ${event.isRegistered ? `
                        <span class="absolute top-3 right-3 px-3 py-1 text-xs font-semibold bg-success text-white rounded-full border border-success/20">✓</span>
                    ` : ''}
                </div>
            ` : ''}
            <div class="p-5 sm:p-6">
                <div class="flex items-start justify-between mb-3">
                    <h3 class="text-lg sm:text-xl font-semibold text-text-primary flex-1 pr-2 leading-tight">${event.title}</h3>
                    ${!event.image && event.isRegistered ? `
                        <span class="px-3 py-1 text-xs font-semibold bg-success/10 text-success rounded-full border border-success/20">✓</span>
                    ` : ''}
                </div>
                <p class="text-sm text-text-secondary mb-4 line-clamp-2 leading-relaxed">${event.description}</p>
                <div class="flex items-center gap-4 text-xs mb-4">
                    <div class="flex items-center gap-1.5">
                        ${icons.Clock()}
                        <span class="font-semibold text-text-secondary">${event.duration}</span>
                    </div>
                    <div class="flex items-center gap-1.5">
                        ${icons.Users()}
                        <span class="font-semibold text-text-secondary">${event.audience}</span>
                    </div>
                </div>
                <div class="mb-4">
                    ${isDeadlineUrgent ? `
                        <div class="flex items-center gap-2 px-3 py-2 bg-warning/10 border border-warning/30 rounded-lg">
                            ${icons.AlertCircle()}
                            <span class="text-xs font-semibold text-warning">
                                ${diffDays === 0 ? '⚠️ Deadline Today!' : '⚠️ Deadline Tomorrow!'}
                            </span>
                        </div>
                    ` : isDeadlineSoon ? `
                        <div class="flex items-center gap-2 px-3 py-2 bg-warning/10 border border-warning/20 rounded-lg">
                            ${icons.Calendar()}
                            <span class="text-xs font-medium text-warning">${diffDays}d left - Register soon!</span>
                        </div>
                    ` : `
                        <div class="flex items-center gap-2 text-xs text-text-muted">
                            ${icons.Calendar()}
                            <span>Deadline: ${formatDate(event.registrationDeadline)}</span>
                        </div>
                    `}
                </div>
            </div>
        `
    }
    
    if (onCardClick) {
        card.addEventListener('click', () => onCardClick(event))
    }
    
    return card
}
