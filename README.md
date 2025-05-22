# Arc Data Compendium

A comprehensive web application for browsing and searching through game data for Arc, featuring items, workbenches, recipes, and valuables. This application serves as an interactive database and reference guide for players of the Arc game, providing detailed information about in-game items, crafting recipes, and workbench mechanics. With more coming soon.

## 🚀 Getting Started

### Prerequisites

-   Node.js 18.0.0 or later
-   npm, yarn, pnpm, or bun package manager

### Installation

1. Clone the repository

    ```bash
    git clone https://github.com/cranberriez/arc-data-compendium.git
    cd arc-data-compendium
    ```

2. Install dependencies

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

3. Start the development server

    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🏗 Project Structure

```
src/
├── app/                  # App router pages and layouts
│   ├── items/           # Item browser and details
│   ├── workbenches/     # Workbench interface
│   └── valuables/       # Valuable items browser
├── components/          # Reusable UI components
│   ├── dialog/         # Dialog components
│   ├── items/          # Item-related components
│   ├── workbench/      # Workbench UI components
│   └── ui/             # Base UI components (shadcn)
├── contexts/           # React context providers
├── data/               # Game data and types
│   ├── items/         # Item definitions and utilities
│   ├── recipes/       # Crafting recipes
│   ├── valuables/     # Valuable items
│   └── workbenches/   # Workbench configurations
├── lib/                # Utility functions and hooks
├── types/              # TypeScript type definitions
└── styles/             # Global styles and theme
```

## 🛠 Development

### Available Scripts

-   `npm run dev` - Start the development server
-   `npm run build` - Build the application for production
-   `npm start` - Start the production server
-   `npm run lint` - Run ESLint

### Code Style

This project uses:

-   TypeScript for type safety
-   ESLint for code linting
-   Prettier for code formatting
-   Tailwind CSS for styling

## 📚 Data Management

Game data is stored in the `src/data` directory, organized by category:

-   **Items** - All in-game items with their properties and metadata
-   **Recipes** - Crafting recipes and their requirements
-   **Workbenches** - Workbench configurations and upgrade paths
-   **Valuables** - Special items with unique properties

The application uses TypeScript interfaces to ensure type safety across the codebase, making it easier to maintain and extend. Data is structured to support efficient querying and filtering operations.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

-   [Next.js](https://nextjs.org/) - The React Framework for Production
-   [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
-   [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
-   [Lucide Icons](https://lucide.dev/) - Beautiful, consistent iconography
