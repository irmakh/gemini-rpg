<img src="https://github.githubassets.com/favicons/favicon.png" width="20" height="20" /> <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png" width="20" height="20" />
# Gemini RPG

Gemini RPG is a dynamic top-down RPG built with React. The game features turn-based combat mechanics and utilizes Gemini AI to procedurally generate dungeons, monsters, and items for a unique gameplay experience.

## Features

- **Procedurally Generated Content**: Leveraging Gemini AI, the game creates unique dungeons, monsters, and loot items, ensuring each playthrough is different.
- **Turn-Based Combat**: Engage in strategic battles with monsters using a turn-based combat system.
- **Character Progression**: Level up your character, acquire new abilities, and equip powerful gear.
- **Quest System**: Complete quests to gain experience and uncover the story.
- **Vendor Interaction**: Trade with vendors to buy and sell items.

## Getting Started

### Prerequisites

- Node.js

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/gemini-rpg.git
   cd gemini-rpg
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment:
   - Create a `.env.local` file in the root directory.
   - Add your Gemini API key to the file:
     ```
     GEMINI_API_KEY=your_api_key_here
     ```

### Running the App

To start the development server, run:
```bash
npm run dev
```

This will launch the app and you can view it in your browser at `http://localhost:3000`.

## Project Structure

- **components/**: React components for the UI.
- **services/**: Contains services for interacting with Gemini AI.
- **types/**: TypeScript types and interfaces.
- **utils/**: Utility functions for various tasks.
- **index.html**: Entry point for the web application.
- **App.tsx**: Main app component that ties everything together.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or feedback, please contact [your email here].
