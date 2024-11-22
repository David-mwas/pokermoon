# Pokermoon Memory Game 🎮✨

Pokermoon is a memory-based game built using **React Native** with **Expo**, designed to test your ability to avoid clicking the same Pokémon twice! As you progress, the game gets more challenging with additional Pokémon at each level.

---

<div align="center">
<img src="assets/img/WhatsApp Image 2024-11-22 at 12.38.44 PM.jpeg" width="250"/>
<img src="assets/img/WhatsApp Image 2024-11-22 at 12.38.42 PM.jpeg" width="250"/>
<img src="assets/img/WhatsApp Image 2024-11-22 at 12.38.45 PM.jpeg" width="250"/>

  <img src="assets/img/WhatsApp Image 2024-11-22 at 12.38.43 PM.jpeg" width="250"/>
  <img src="assets/img/WhatsApp Image 2024-11-22 at 12.38.46 PM.jpeg" width="250"/>
  <img src="assets/img/WhatsApp Image 2024-11-22 at 12.38.47 PM.jpeg" width="250"/>
  
</div>

## Features 🚀

- **Interactive Gameplay:** Click unique Pokémon to score points, but don't repeat clicks, or it's game over!
- **Level Progression:** Unlock new levels with more Pokémon as you succeed.
- **Audio Feedback:** Enjoy immersive sound effects for clicks, wins, and losses.
- **Haptics Integration:** Feel the game with subtle vibrations for every interaction.
- **Dynamic Content:** Pokémon images and names are fetched in real-time from the [PokéAPI](https://pokeapi.co/).
- **Confetti Effects:** Celebrate your victories with confetti blasts!
- **Adaptive Layout:** Responsive design for various screen sizes.

---

## Technologies Used 🛠

- **Framework:** [React Native](https://reactnative.dev/)
- **Tooling:** [Expo](https://expo.dev/)
- **Animations:** [react-native-confetti-cannon](https://github.com/VoronchukIgor/react-native-confetti-cannon)
- **Haptics:** [Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)
- **Audio:** [Expo Audio](https://docs.expo.dev/versions/latest/sdk/av/)
- **API:** [PokéAPI](https://pokeapi.co/)

---

## Setup & Installation 🛠

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/David-mwas/pokermoon.git
   cd pokermoon
   ```

2. **Install Dependancies:**

   ```bash
   npm install
   npm start
   ```

## Project sructure

## Project Structure 🗂

```plaintext
pokermoon-memory-game/
├── app/                 # File-based routing using Expo Router
│   ├── index.tsx        # Home screen
│   ├── tabOne.tsx       # Tab One screen (game)
│   ├── tabTwo.tsx       # Tab Two screen (e.g., About/Settings)
│   └── _layout.tsx      # Layout for tab navigation
├── assets/              # Static assets like sounds and images
├── components/          # Reusable UI components
├── package.json         # Project dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── app.config.js        # Expo project configuration
└── README.md            # Project documentation

```
