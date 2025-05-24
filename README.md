# 🎬 Mood Movies

A desktop-only web application that recommends exactly 3 personalized movies based on your mood, preferences, and platform access. Powered by OpenAI GPT-4 and presented in a visually rich, cinematic UI.

## Features

- Mood-based movie recommendations
- Platform availability checking
- Detailed movie information including ratings, cast, and crew
- Beautiful, responsive UI with smooth animations
- Desktop-optimized experience

## Prerequisites

- Node.js 16.x or later
- npm 7.x or later
- OpenAI API key

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd mood-movies
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Select your current mood from the dropdown menu
2. Choose your preferred genres (multiple selection allowed)
3. Select your preferred languages (multiple selection allowed)
4. Pick your preferred movie duration
5. Select your available streaming platforms
6. Click "Get Movie Recommendations"
7. Enter your OpenAI API key when prompted
8. View your personalized movie recommendations
9. Click on any movie card to see more details and watch the trailer

## Tech Stack

- React (Vite)
- TypeScript
- Tailwind CSS
- Framer Motion
- OpenAI GPT-4 API
- Headless UI

## Development

The project uses:
- Vite for fast development and building
- TypeScript for type safety
- Tailwind CSS for styling
- Framer Motion for animations
- Headless UI for accessible components

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_OPENAI_API_KEY=your_api_key_here
```

Note: For development, you can also enter the API key when prompted in the application.

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 