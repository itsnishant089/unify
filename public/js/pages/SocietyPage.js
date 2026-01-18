import { createEventCard } from '../shared/EventCard.js'
import { showEventModal } from '../shared/EventModal.js'
import { icons } from '../utils/icons.js'
import { mockEvents, mockSocieties } from '../../data/mockData.js'

export function renderSocietyPage(container) {
    let societies = [...mockSocieties]
    
    const handleAction = (eventId, action) => {
        console.log(`Action ${action} for event ${eventId}`)
    }
    
    const handleCardClick = (event) => {
        showEventModal(event, (action) => handleAction(event.id, action))
    }
    
    const toggleFollow = (societyId) => {
        societies = societies.map(s => 
            s.id === societyId ? { ...s, isFollowed: !s.isFollowed } : s
        )
        render()
    }
    
    const render = () => {
        const followedSocieties = societies.filter(s => s.isFollowed)
        const recommendedSocieties = societies.filter(s => !s.isFollowed)
        
        const followedEvents = mockEvents.filter(event => 
            followedSocieties.some(society => society.name === event.hostingSociety)
        )
        
        const followedCategories = followedSocieties.map(s => s.category)
        const relatedEvents = mockEvents.filter(event => 
            followedCategories.includes(event.category) && 
            !followedEvents.some(e => e.id === event.id)
        )
        
        const newGenreEvents = mockEvents.filter(event => 
            !followedCategories.includes(event.category)
        )
        
        if (followedSocieties.length === 0) {
            container.innerHTML = `
                <div class="px-4 py-6">
                    <div class="mb-8">
                        <h2 class="text-2xl font-bold text-text-primary mb-2 text-primary">
                            Recommended Societies
                        </h2>
                        <p class="text-sm text-text-muted">
                            Follow societies to see their events here
                        </p>
                    </div>
                    
                    <div class="space-y-4" id="societies-list"></div>
                </div>
            `
            
            const listContainer = container.querySelector('#societies-list')
            recommendedSocieties.forEach(society => {
                const societyDiv = document.createElement('div')
                societyDiv.className = 'bg-bg-secondary rounded-2xl p-6 border border-border hover:border-primary/50 transition-all duration-200'
                societyDiv.innerHTML = `
                    <div class="flex items-start justify-between mb-3">
                        <div class="flex-1">
                            <h3 class="text-xl font-semibold text-text-primary mb-2">${society.name}</h3>
                            <p class="text-sm text-text-secondary mb-4">${society.description}</p>
                            <span class="inline-block px-4 py-2 text-xs font-semibold bg-primary/10 text-primary rounded-xl border border-primary/20">
                                ${society.category}
                            </span>
                        </div>
                        <button 
                            data-society-id="${society.id}"
                            class="follow-btn ml-4 px-6 py-3 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-hover transition-colors active:scale-[0.98] flex items-center gap-2"
                        >
                            ${icons.UserPlus()}
                            Follow
                        </button>
                    </div>
                `
                listContainer.appendChild(societyDiv)
            })
            
            container.querySelectorAll('.follow-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    toggleFollow(btn.getAttribute('data-society-id'))
                })
            })
            
            return
        }
        
        container.innerHTML = `
            <div class="px-4 py-6">
                <div class="mb-8">
                    <h2 class="text-2xl font-bold text-text-primary mb-5 text-primary">Followed Societies</h2>
                    <div class="space-y-3" id="followed-societies"></div>
                </div>
                
                ${followedEvents.length > 0 ? `
                    <div class="mb-8">
                        <h2 class="text-xl font-bold text-text-primary mb-5 text-primary">
                            Events from Followed Societies
                        </h2>
                        <div class="space-y-4" id="followed-events"></div>
                    </div>
                ` : ''}
                
                ${relatedEvents.length > 0 ? `
                    <div class="mb-8">
                        <h2 class="text-xl font-bold text-text-primary mb-5 text-primary">Related Events</h2>
                        <div class="space-y-4" id="related-events"></div>
                    </div>
                ` : ''}
                
                ${newGenreEvents.length > 0 ? `
                    <div class="mb-8">
                        <h2 class="text-xl font-bold text-text-primary mb-5 text-primary">New Genre Events</h2>
                        <div class="space-y-4" id="new-genre-events"></div>
                    </div>
                ` : ''}
                
                ${recommendedSocieties.length > 0 ? `
                    <div class="mb-8">
                        <h2 class="text-xl font-bold text-text-primary mb-5 text-primary">Discover More</h2>
                        <div class="space-y-3" id="recommended-societies"></div>
                    </div>
                ` : ''}
            </div>
        `
        
        // Render followed societies
        const followedContainer = container.querySelector('#followed-societies')
        followedSocieties.forEach(society => {
            const societyDiv = document.createElement('div')
            societyDiv.className = 'bg-bg-secondary rounded-xl p-4 border border-border hover:border-primary/50 transition-all duration-200 flex items-center justify-between'
            societyDiv.innerHTML = `
                <div class="flex items-center gap-4">
                    <div class="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                        ${icons.Users()}
                    </div>
                    <div>
                        <h3 class="text-base font-semibold text-text-primary">${society.name}</h3>
                        <p class="text-xs text-text-secondary font-medium">${society.category}</p>
                    </div>
                </div>
                <button 
                    data-society-id="${society.id}"
                    class="unfollow-btn text-primary hover:text-primary-hover transition-colors p-2.5 hover:bg-primary/5 rounded-lg"
                >
                    ${icons.UserCheck()}
                </button>
            `
            followedContainer.appendChild(societyDiv)
        })
        
        // Render events
        const renderEvents = (containerId, events) => {
            const eventsContainer = container.querySelector(`#${containerId}`)
            if (!eventsContainer) return
            
            events.slice(0, 3).forEach(event => {
                const card = createEventCard(event, 'default', (action) => handleAction(event.id, action), handleCardClick)
                eventsContainer.appendChild(card)
            })
        }
        
        renderEvents('followed-events', followedEvents)
        renderEvents('related-events', relatedEvents)
        renderEvents('new-genre-events', newGenreEvents)
        
        // Render recommended societies
        const recommendedContainer = container.querySelector('#recommended-societies')
        if (recommendedContainer) {
            recommendedSocieties.slice(0, 3).forEach(society => {
                const societyDiv = document.createElement('div')
                societyDiv.className = 'bg-bg-secondary rounded-xl p-4 border border-border hover:border-primary/50 transition-all duration-200 flex items-center justify-between'
                societyDiv.innerHTML = `
                    <div class="flex items-center gap-4">
                        <div class="w-14 h-14 bg-surface rounded-xl flex items-center justify-center border border-border">
                            ${icons.Users()}
                        </div>
                        <div>
                            <h3 class="text-base font-semibold text-text-primary">${society.name}</h3>
                            <p class="text-xs text-text-secondary font-medium">${society.category}</p>
                        </div>
                    </div>
                    <button 
                        data-society-id="${society.id}"
                        class="follow-btn px-5 py-2.5 text-sm font-semibold text-primary hover:bg-primary/5 rounded-xl transition-colors active:scale-[0.98]"
                    >
                        Follow
                    </button>
                `
                recommendedContainer.appendChild(societyDiv)
            })
        }
        
        // Add event listeners
        container.querySelectorAll('.follow-btn, .unfollow-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                toggleFollow(btn.getAttribute('data-society-id'))
            })
        })
    }
    
    render()
}
