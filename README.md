# Hello World UiPath App

A simple "Hello World" application built with React, TypeScript, and the UiPath SDK. This project demonstrates the basic setup and structure for creating UiPath Coded Web Applications.

[cloudflarebutton]

## Features

- 🚀 Modern React 18 with TypeScript
- 🎨 Tailwind CSS v4 for styling
- 🔐 OAuth authentication with UiPath
- ⚡ Vite for fast development and building
- 🌐 Ready for Cloudflare Pages deployment

## Technology Stack

- **Frontend Framework**: React 18.3.1
- **Language**: TypeScript 5.8
- **Build Tool**: Vite 6.3.1
- **Styling**: Tailwind CSS 4.0
- **Routing**: React Router DOM 6.30
- **UiPath Integration**: @uipath/uipath-typescript (latest)
- **Deployment**: Cloudflare Pages

## Prerequisites

- [Bun](https://bun.sh) runtime installed
- UiPath account with appropriate OAuth credentials
- Modern web browser

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:

```bash
bun install
```

3. Configure environment variables:

The `.env` file is already configured with default values. Update if needed:

```env
VITE_UIPATH_BASE_URL=https://staging.api.uipath.com
VITE_UIPATH_ORG_NAME=your-org-name
VITE_UIPATH_TENANT_NAME=your-tenant-name
VITE_UIPATH_CLIENT_ID=your-client-id
VITE_UIPATH_SCOPE=OR.Execution
```

## Development

Start the development server:

```bash
bun run dev
```

The application will be available at `http://localhost:3000`

### Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build locally
- `bun run lint` - Run ESLint

## Project Structure

```
├── src/
│   ├── hooks/
│   │   └── useAuth.tsx      # OAuth authentication hook
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── .env                     # Environment variables
├── uipath.json             # UiPath configuration
├── vite.config.ts          # Vite configuration
└── package.json            # Project dependencies
```

## Usage

### Authentication

The application uses OAuth PKCE flow for authentication. Users will be prompted to sign in with their UiPath credentials on first access.

```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { isAuthenticated, isLoading, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <button onClick={login}>Sign In</button>;
  }
  
  return <div>Welcome!</div>;
}
```

### Using the UiPath SDK

```typescript
import { useAuth } from '@/hooks/useAuth';
import { Assets } from '@uipath/uipath-typescript/assets';
import { useMemo } from 'react';

function MyComponent() {
  const { sdk } = useAuth();
  const assets = useMemo(() => new Assets(sdk), [sdk]);
  
  // Use the assets service...
}
```

## Building for Production

Build the application:

```bash
bun run build
```

The built files will be in the `dist/` directory.

Preview the production build:

```bash
bun run preview
```

## Deployment

### Cloudflare Pages

This project is configured for deployment to Cloudflare Pages.

[cloudflarebutton]

#### Manual Deployment

1. Build the project:

```bash
bun run build
```

2. Deploy using Wrangler:

```bash
bunx wrangler pages deploy dist
```

#### Configuration

The `wrangler.jsonc` file contains the deployment configuration:

```jsonc
{
  "name": "uipath-dashboard",
  "compatibility_date": "2025-01-01",
  "pages_build_output_dir": "dist"
}
```

### Environment Variables

Ensure the following environment variables are set in your Cloudflare Pages project settings:

- `VITE_UIPATH_BASE_URL`
- `VITE_UIPATH_ORG_NAME`
- `VITE_UIPATH_TENANT_NAME`
- `VITE_UIPATH_CLIENT_ID`
- `VITE_UIPATH_SCOPE`

## Key Concepts

### OAuth Configuration

The application uses PKCE (Proof Key for Code Exchange) OAuth flow. The `useAuth` hook handles:

- Token acquisition and refresh
- Session persistence
- OAuth callback handling
- React Strict Mode compatibility

### Base URL Handling

The application uses `getAppBase()` from the UiPath SDK to handle routing correctly in both local development and deployed environments.

### Service Instantiation

Always use constructor-based dependency injection:

```typescript
const service = useMemo(() => new ServiceClass(sdk), [sdk]);
```

Never use the deprecated dot-chain pattern.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

This project is private and proprietary.

## Support

For issues or questions, please contact your UiPath administrator or refer to the [UiPath Documentation](https://docs.uipath.com).