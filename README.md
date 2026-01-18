# Unify - Student Event Experience (HTML/CSS/JS Version)

A mobile-first web application designed to create a student-first event experience. This is the vanilla HTML, CSS, and JavaScript version of the project, maintaining the same design, functionality, and user flows as the React/Next.js version.

## Features

### Core Pages

1. **Home** - Fast discovery with featured events carousel, search, filters, and category-wise event cards
2. **Decide** - Swipe-based decision mode (swipe right to register, left to save, up to skip)
3. **Saved** - Track interest and deadlines with events sorted by nearest registration deadline
4. **Schedule** - Weekly/monthly view of planned and registered events with filters
5. **Society** - Trust-based discovery of events from followed societies

### Design System

- **Colors**: Midnight Indigo, Electric Cyan, Soft Light backgrounds
- **Typography**: Inter font family
- **Mobile-first**: Responsive design optimized for mobile devices
- **Modern UI**: Clean, calm, confident, premium aesthetic

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional, but recommended)

### Running the Application

#### Option 1: Using a Local Server (Recommended)

1. Install a local server (if you don't have one):
   - Python: `python -m http.server 8000`
   - Node.js: `npx http-server`
   - VS Code: Use Live Server extension

2. Navigate to the project directory:
   ```bash
   cd unify-html
   ```

3. Start the server:
   ```bash
   # Python
   python -m http.server 8000
   
   # Node.js
   npx http-server
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

#### Option 2: Direct File Access

Simply open `index.html` in your browser. Note: Some features may not work due to CORS restrictions when loading modules.

## Project Structure

```
unify-html/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Custom styles and animations
├── js/
│   ├── app.js          # Main application entry point
│   ├── auth/           # Authentication pages
│   │   ├── LoginPage.js
│   │   └── SignupPage.js
│   ├── pages/          # Main page components
│   │   ├── HomePage.js
│   │   ├── DecidePage.js
│   │   ├── SavedPage.js
│   │   ├── SchedulePage.js
│   │   └── SocietyPage.js
│   ├── shared/         # Shared components
│   │   ├── TopBar.js
│   │   ├── EventCard.js
│   │   └── EventModal.js
│   ├── navigation/     # Navigation components
│   │   └── BottomNav.js
│   └── utils/          # Utility functions
│       └── icons.js
└── data/
    └── mockData.js     # Mock event and society data
```

## Tech Stack

- **HTML5** - Structure
- **CSS3** - Styling with Tailwind CSS (via CDN)
- **Vanilla JavaScript (ES6 Modules)** - Functionality
- **No build tools required** - Pure client-side code

## Key Features

- ✅ Mobile-first responsive design
- ✅ Swipe-based decision making (touch gestures)
- ✅ Event discovery and filtering
- ✅ Save and schedule events
- ✅ Society following
- ✅ Progressive registration flow
- ✅ Modern, calm UI design
- ✅ Smooth animations and transitions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- This version uses ES6 modules, so it requires a web server to run properly
- All icons are implemented as SVG functions
- Animations use CSS transitions and keyframes
- Swipe gestures are implemented using touch events
- The design and functionality match the React/Next.js version exactly

## Differences from React Version

- Uses vanilla JavaScript instead of React
- ES6 modules instead of React components
- DOM manipulation instead of virtual DOM
- CSS animations instead of Framer Motion
- Touch events instead of Framer Motion gestures

## Design Principles

- **Mobile-first always** - Optimized for mobile devices
- **Reduce thinking, not features** - Clear, intuitive interface
- **Calm > flashy** - Restrained, premium design
- **Action > browsing** - Focus on decision-making
- **Consistency over creativity** - Predictable patterns

## Success Criteria

A student should be able to:
1. Open the app
2. Discover an event
3. Decide what to do
4. Commit or save
5. See it in their schedule

...within 30 seconds, without confusion.

---

*Built with vanilla HTML, CSS, and JavaScript*
*Design Philosophy: Mobile-First, Calm, Action-Oriented*
