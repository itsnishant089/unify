let activeMenu = null

export function showOverlayMenu(anchor, html) {
    closeOverlayMenu()

    const rect = anchor.getBoundingClientRect()

    const menu = document.createElement('div')
    menu.className = `
        fixed z-50 bg-bg-secondary border border-border
        rounded-2xl shadow-lg p-3 w-64 fade-in
    `

    menu.style.top = `${rect.bottom + 8}px`
    menu.style.right = `16px`

    menu.innerHTML = html

    document.body.appendChild(menu)
    activeMenu = menu

    setTimeout(() => {
        document.addEventListener('click', handleOutsideClick)
    }, 0)
}

export function closeOverlayMenu() {
    if (activeMenu) {
        activeMenu.remove()
        activeMenu = null
        document.removeEventListener('click', handleOutsideClick)
    }
}

function handleOutsideClick(e) {
    if (activeMenu && !activeMenu.contains(e.target)) {
        closeOverlayMenu()
    }
}
