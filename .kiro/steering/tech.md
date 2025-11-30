# Tech Stack

## Core Technologies

- **React 18**: UI framework with hooks and functional components
- **Vite 5**: Build tool and development server
- **React Router v6**: Client-side routing with BrowserRouter
- **Framer Motion**: Animation library (ready for future enhancements)
- **localStorage**: Browser-based data persistence

## Development Dependencies

- **@vitejs/plugin-react**: Vite plugin for React support
- **fast-check**: Property-based testing library

## Common Commands

```bash
# Start development server (runs on port 5173)
npm run dev

# Build for production (outputs to dist/)
npm run build

# Preview production build
npm run preview

# Install dependencies
npm install
```

## Build Configuration

- **Module Type**: ES modules (`"type": "module"` in package.json)
- **Dev Server Port**: 5173 (configured in vite.config.js)
- **React Plugin**: Uses @vitejs/plugin-react with default settings

## Browser Requirements

- Modern browsers with ES6+ support
- localStorage API availability
