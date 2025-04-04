# Applert

Applert is a mobile application built with Expo and React Native, designed to provide real-time alerts and notifications for emergencies and other critical events. The app features user authentication, location-based alerts, and an intuitive interface for managing notifications.

## Features

- 🔐 **User Authentication**: Secure login and session management using Zustand and async storage.
- 🚨 **Alert System**: Receive and manage emergency alerts in real time.
- 📍 **Location Services**: Uses Expo Location API to determine user location for relevant alerts.
- 📢 **Push Notifications**: Integrates with Expo Notifications for timely updates.
- 🌙 **Dark Mode Support**: Optimized UI for both light and dark modes.

## Tech Stack

- **Frontend**: React Native (Expo)
- **State Management**: Zustand
- **Navigation**: Expo Router
- **Storage**: AsyncStorage (persisted auth state)
- **Icons**: Lucide React Native
- **Styling**: NativeWind (Tailwind for React Native)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/fbrusatti/applert.git
   cd applert
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   expo start
   ```

## Running on a Simulator

For iOS:
```sh
npx expo run:ios
```
For Android:
```sh
npx expo run:android
```

## App Structure
![App Diagram](assets/diagram.png)

## Contributing

Pull requests are welcome! Feel free to open an issue if you find a bug or have a feature request.

## License

MIT License © 2025 Franco Brusatti


