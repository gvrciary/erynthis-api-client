<div align="center">
  <img src="public/screenshot.png" alt="Erynthis API Client Logo" width="80" height="80">
  
  # Erynthis API Client
  
  A modern, cross-platform API testing client built with Tauri, React, and TypeScript.
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
   
   
## 📂 Project Structure

```
erynthis-api-client/
├── public/                     # Static assets
│   ├── logo.webp              # Application logo
│   └── screenshot.png          # Demo screenshot
├── src/                        # Frontend source code (React/TypeScript)
│   ├── components/             # React components
│   │   ├── environments/       # Environment management components
│   │   ├── panels/             # UI panel components
│   │   ├── tabs/               # Tab navigation components
│   │   ├── ui/                 # Reusable UI components
│   │   ├── syntax-highlighter.tsx  # Code syntax highlighting
│   │   └── welcome.tsx         # Welcome screen component
│   ├── constants/              # Application constants
│   ├── hooks/                  # Custom React hooks
│   ├── services/               # API and external service integrations
│   ├── store/                  # State management (Zustand stores)
│   │   ├── environmentStore.ts # Environment variables store
│   │   ├── httpStore.ts        # HTTP request state store
│   │   ├── shikiStore.ts       # Syntax highlighting store
│   │   └── uiStore.ts          # UI state store
│   ├── styles/                 # Global styles and Tailwind config
│   ├── types/                  # TypeScript type definitions
│   │   ├── data.ts             # General data types
│   │   └── http.ts             # HTTP-related types
│   ├── utils/                  # Utility functions
│   ├── App.tsx                 # Main application component
│   ├── main.tsx                # Application entry point
│   └── vite-env.d.ts           # Vite environment types
├── src-tauri/                  # Backend source code (Rust/Tauri)
│   ├── capabilities/           # Tauri capability definitions
│   ├── gen/                    # Generated files
│   ├── icons/                  # Application icons
│   ├── src/                    # Rust source code
│   │   ├── commands.rs         # Tauri command definitions
│   │   ├── http.rs             # HTTP client implementation
│   │   ├── lib.rs              # Library entry point
│   │   ├── main.rs             # Application entry point
│   │   └── state.rs            # Application state management
│   ├── target/                 # Rust build artifacts
│   ├── Cargo.toml              # Rust dependencies
│   ├── Cargo.lock              # Dependency lock file
│   ├── build.rs                # Build script
│   └── tauri.conf.json         # Tauri configuration
├── node_modules/               # Node.js dependencies
├── .gitignore                  # Git ignore rules
├── LICENSE                     # MIT license
├── README.md                   # Project documentation
├── biome.json                  # Biome linter configuration
├── index.html                  # HTML entry point
├── package.json                # Node.js dependencies and scripts
├── package-lock.json           # Node.js dependency lock file
├── tsconfig.json               # TypeScript configuration
├── tsconfig.node.json          # TypeScript Node.js configuration
└── vite.config.ts              # Vite build configuration
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

<div align="center">
  Made with ❤️ by Alexis G
</div>
