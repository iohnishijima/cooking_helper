# Cooking Helper

A modern, responsive web application built with React, TypeScript, Vite, and Tailwind CSS. This project is deployed to GitHub Pages using GitHub Actions.

## 🚀 Tech Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 3
- **Routing**: React Router (HashRouter for GitHub Pages compatibility)
- **Deployment**: GitHub Pages via GitHub Actions
- **Linting**: ESLint

## 📋 Features

- ✅ Fully responsive design (PC, iPad, iPhone)
- ✅ TypeScript for type safety
- ✅ Fast development with Vite HMR
- ✅ Modern UI with Tailwind CSS
- ✅ SPA routing with HashRouter
- ✅ Automated deployment to GitHub Pages

## 🛠️ Development

### Prerequisites

- Node.js 20 or higher
- npm

### Installation

```bash
# Install dependencies
npm install
```

### Development Server

```bash
# Start development server with hot module replacement
npm run dev
```

The application will be available at `http://localhost:5173/cooking_helper/`

### Build

```bash
# Build for production
npm run build
```

The built files will be output to the `dist/` directory.

### Preview Production Build

```bash
# Preview the production build locally
npm run preview
```

### Linting

```bash
# Run ESLint
npm run lint
```

## 🌐 Deployment

This project is configured to automatically deploy to GitHub Pages when changes are pushed to the `main` branch.

### Setup GitHub Pages

1. Go to your repository settings
2. Navigate to "Pages" section
3. Set "Source" to "GitHub Actions"

### Manual Deployment

The deployment workflow (`.github/workflows/deploy.yml`) runs automatically on push to `main`. No manual intervention is required.

## 📁 Project Structure

```
cooking_helper/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow for deployment
├── public/                     # Static assets
├── src/
│   ├── pages/
│   │   └── Home.tsx           # Home page component
│   ├── App.tsx                # Main app component with routing
│   ├── main.tsx               # Application entry point
│   └── index.css              # Global styles with Tailwind directives
├── index.html                 # HTML template
├── vite.config.ts             # Vite configuration (with base path)
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Project dependencies and scripts
```

## 🔧 Configuration

### Vite Base Path

The Vite base path is configured in `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/cooking_helper/',
  // ...
})
```

This ensures assets are correctly referenced when deployed to GitHub Pages Project Pages.

### HashRouter

The project uses `HashRouter` instead of `BrowserRouter` to ensure proper routing on GitHub Pages without additional server configuration.

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (sm to lg)
- **Desktop**: > 1024px (lg)

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👤 Author

Built with ❤️ for the cooking community
