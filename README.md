<div align="center">
  <img src="public/logo.webp" alt="Erynthis API Client Logo" width="80" height="80">
  
  # Erynthis API Client
  
  A modern, cross-platform API testing client built with Tauri, React, and TypeScript.
  
  [![Tauri](https://img.shields.io/badge/Tauri-2.0-blue.svg)](https://tauri.app/)
  [![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)](https://www.typescriptlang.org/)
  [![Rust](https://img.shields.io/badge/Rust-1.70+-orange.svg)](https://www.rust-lang.org/)
</div>

## ✨ Features

- 🚀 **Fast & Lightweight** - Built with Tauri for optimal performance
- 🌐 **HTTP Methods Support** - GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS and custom methods
- 📝 **Multiple Body Types** - Text, JSON, XML, YAML, Form Data (URL-encoded & Multipart), Binary
- 🎨 **Modern UI** - Clean and intuitive interface built with React
- 🔒 **Secure** - Rust backend ensures memory safety and security
- 💾 **Cross-Platform** - Windows, macOS, and Linux support
- ⚡ **Real-time Response** - Instant request execution with response time tracking
- 📊 **Response Formatting** - Automatic JSON prettification and syntax highlighting

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript** - Modern UI framework with type safety
- **Vite 6** - Fast build tool and development server
- **Tailwind CSS 4** - Utility-first CSS framework
- **Zustand** - Lightweight state management
- **Lucide React** - Beautiful icon library
- **Shiki** - Syntax highlighting for code blocks
- **React Transition Group** - Smooth animations and transitions

### Backend
- **Rust** - Memory-safe systems programming language
- **Tauri 2.0** - Cross-platform desktop app framework
- **reqwest** - HTTP client with JSON and multipart support
- **Serde** - Serialization/deserialization framework
- **base64** - Base64 encoding/decoding
- **urlencoding** - URL encoding utilities
- **roxmltree** - XML parsing

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Rust](https://www.rust-lang.org/tools/install) (latest stable)
- [Tauri CLI](https://tauri.app/v1/guides/getting-started/prerequisites) (v2.0)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/erynthis-api-client.git
   cd erynthis-api-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run in development mode**
   ```bash
   npm run tauri dev
   ```

4. **Build for production**
   ```bash
   npm run tauri build
   ```

## 🎯 Usage

1. **Select HTTP Method** - Choose from GET, POST, PUT, DELETE, etc.
2. **Enter URL** - Input your API endpoint
3. **Set Headers** - Add custom headers as needed
4. **Configure Body** - Choose body type and format your data
5. **Send Request** - Click send and view the response

### Supported Body Types

- **None** - For GET requests or endpoints that don't require a body
- **Text** - Raw text, JSON, XML, YAML with syntax highlighting
- **Form Data** - URL-encoded or Multipart form data
- **Binary** - File uploads with automatic content-type detection
- **GraphQL** - GraphQL queries and mutations

## 🔧 Development

### Frontend Development
```bash
npm run dev          # Start Vite dev server
npm run build        # Build frontend (TypeScript compilation + Vite build)
npm run preview      # Preview production build
```

### Backend Development
```bash
npm run tauri dev    # Start Tauri in development mode
npm run tauri build  # Build production app for all platforms
```

### Code Quality
```bash
npm run check        # Run Biome linter and formatter with auto-fix
```

### Available Scripts
- `npm run dev` - Start Vite development server
- `npm run build` - TypeScript compilation + Vite build
- `npm run preview` - Preview production build
- `npm run tauri` - Access Tauri CLI commands
- `npm run check` - Code formatting and linting with Biome

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<div align="center">
  Made with ❤️ by Alexis G
</div>
