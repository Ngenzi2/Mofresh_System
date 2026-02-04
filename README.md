## 📁 Project Structure

```
mofresh/
├── src/
│   ├── assets/           # Images, logos, and static files
│   │   ├── Logo.jpeg
│   │   ├── header.jpg
│   │   ├── Hero.jpg
│   │   ├── AboutHarvest.jpg
│   │   ├── AbtHarvestInBox.jpeg
│   │   └── ...
│   ├── components/       # React components
│   │   ├── ui/          # Reusable UI components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── AboutPage.tsx
│   │   │   └── ...
│   │   ├── HeroSection.tsx
│   │   └── ...
│   ├── pages/           # Page components
│   │   ├── Home.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── routes/          # React Router configuration
│   │   └── AppRoutes.tsx
│   ├── store/           # State management (Redux/Zustand)
│   │   ├── authSlice.ts
│   │   ├── hooks.ts
│   │   └── store.ts
│   ├── styles/          # Global styles
│   │   ├── fonts.css
│   │   ├── index.css
│   │   ├── tailwind.css
│   │   └── theme.css
│   ├── App.tsx          # Main App component
│   └── main.tsx         # Application entry point
├── public/              # Public static files
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md

## 🎨 Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **State Management**: Redux Toolkit / Zustand
- **Routing**: React Router v6
- **Form Handling**: React Hook Form
- **Type Safety**: TypeScript