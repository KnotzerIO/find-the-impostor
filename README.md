<div align="center">

# 🕵️ Find the Impostor

  <a href="https://impostor.knotzer.io">
    <img src="./public/images/impostor-logo-rounded.png" alt="Find the Impostor Logo" width="200">
  </a>

[![Next.js](https://img.shields.io/badge/Next.js-15.3-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=flat-square&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**A local-first party game PWA where players guess the secret word while impostors try to blend in**

[🎮 Play Demo 🎮](https://impostor.knotzer.io)

</div>

---

> [!NOTE]
> The AI demo is currently running on a personal budget, which has now been used up, so you might notice some errors or fallback words.
> If you enjoy the project and feel generous, you can [buy me a coffee](https://buymeacoffee.com/knotzer) or [sponsor me on GitHub](https://github.com/sponsors/knotzerio).  


## 🎮 How to Play

### 📋 **Game Setup**

1. **Configure Players**: Set up 3-10 players with custom names
2. **Choose Categories**: Select word categories (animals, food, movies, etc.) or create your own
3. **Set Impostors**: Decide how many players will be impostors (1-3 recommended)
4. **Optional Hints**: Enable hints to help impostors blend in

### 🎭 **Role Assignment**

- **👥 Regular Players**: Know the secret word and must work together to find impostors
- **🕵️ Impostors**: Don't know the secret word but can see optional hints to help them guess

### 📱 **Word Reveal Phase**

- Players take turns looking at their phone/device privately
- **Regular players** see the exact secret word (e.g., "Pizza")
- **Impostors** see only category hints (e.g., "Food item, often round, has toppings")

### 💬 **Discussion Rounds**

1.  Each player says **one word** related to the secret word

- Regular players try to give clues without being too obvious
- Impostors try to guess and blend in based on others' words

2. **Final Discussion**: After 2 Rounds open a discussion about who might be the impostor

### 🗳️ **Voting & Results**

- All players vote for who they think is the impostor
- Reveal roles and see who won:
  - **Regular Players Win**: If they correctly identify all impostors
  - **Impostors Win**: If they avoid detection or correctly guess the secret word

### 🎯 **Strategy Tips**

- **For Regular Players**: Give specific but not obvious clues, watch for players who seem unsure
- **For Impostors**: Listen carefully to others' clues, ask strategic questions, don't be too vague or too specific

---

## ✨ Features

### 🎯 **Core Gameplay**

- **Impostor Mechanics**: One or more players don't know the secret word and must bluff their way through
- **Flexible Configuration**: Customize player count (3-10), impostor count, categories, and difficulty
- **Multi-Language Support**: Available in English and German with `next-intl`
- **Hint System**: Optional hints for impostors to level the playing field

### 🌐 **Progressive Web App**

- **📱 Installable**: Add to home screen on any device
- **🔌 Offline First**: Play without internet connection
- **📊 Local Data**: All game data stored locally with IndexedDB

### 🛠️ **Developer Experience**

- **🎨 Modern UI**: Built with Shadcn and Tailwind CSS
- **⚡ Type Safety**: Full TypeScript coverage
- **🔄 State Management**: Persistent game state with Zustand
- **🚀 Performance**: Next.js 15 with Turbopack for fast development

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or later
- **npm**, **yarn**, or **pnpm**

### Installation

```bash
# Clone the repository
git clone https://github.com/KnotzerIO/find-the-impostor.git
cd find-the-impostor

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Development

```bash
# Start development server with Turbopack
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
# Build the application
npm run build

# Start production server
npm run start
```

---

## 🏗️ Tech Stack

### **Frontend Framework**

- **[Next.js 15.3](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://reactjs.org/)** - UI library with latest features
- **[TypeScript 5](https://www.typescriptlang.org/)** - Type-safe JavaScript

### **UI & Styling**

- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible UI components
- **[Lucide React](https://lucide.dev/)** - Beautiful & consistent icons
- **[class-variance-authority](https://cva.style/)** - Component variant management

### **State & Data Management**

- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[Dexie.js](https://dexie.org/)** - IndexedDB wrapper for local storage
- **[next-intl](https://next-intl-docs.vercel.app/)** - Internationalization

### **Analytics & Monitoring**

- **[Umami](https://umami.is/)** - Privacy-focused web analytics
- **[Sentry](https://sentry.io/)** - Error tracking and performance monitoring

### **Development Tools**

- **[ESLint](https://eslint.org/)** - Code linting
- **[Turbopack](https://turbo.build/pack)** - Fast development builds
