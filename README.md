# Nigerian News Social Platform

A modern news aggregation platform with social features, built for Nigerian audiences.

## Features

- 📰 News aggregation from multiple sources (Nigerian news, crypto, entertainment, stocks)
- 💚 Instagram-style infinite scroll feed
- 👍 Like and comment on articles
- 🔄 Real-time updates
- 🌓 Dark/light mode
- 📱 Mobile-first responsive design
- 🇳🇬 Nigerian color palette (green #008751, amber #F59E0B)

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS, Framer Motion
- **Backend:** Firebase (Firestore, Authentication, Storage)
- **State:** TanStack Query, Zustand
- **Forms:** React Hook Form + Zod

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase project created

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.local.example` to `.env.local` and add your Firebase credentials

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

### Troubleshooting

Having issues? Check these resources:

- **[QUICK-TROUBLESHOOTING.md](./QUICK-TROUBLESHOOTING.md)** - Fast fixes for common issues
- **[ISSUES-AND-FIXES.md](./ISSUES-AND-FIXES.md)** - Complete database of known issues and solutions
- **[FIRESTORE_SETUP.md](./FIRESTORE_SETUP.md)** - Firebase/Firestore configuration guide

**Most Common Issues:**
- 500 API errors → Use client-side Firebase (see ISSUES-AND-FIXES.md)
- "Query requires index" → Click the link in the error message
- Wrong initial state → Initialize state with prop value, not default



## Project Structure

```
├── app/                 # Next.js App Router pages
├── components/          # React components
├── lib/                 # Utilities and configurations
├── hooks/               # Custom React hooks
├── types/               # TypeScript type definitions
└── .kiro/specs/         # Project specifications
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT
