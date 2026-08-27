# Mobile Architecture (React Native)

## 1. Core Stack
- **Framework:** React Native
- **Navigation:** React Navigation
- **State Management:** Redux Toolkit or Zustand + React Query for server state.
- **Networking:** Axios.

## 2. i18n & RTL Support
- Uses `i18next` and `react-i18next`.
- I18nManager from React Native to enforce RTL layout for Arabic. Upon language change, the app requires a bundle reload to properly switch LTR/RTL constraints.

## 3. Deep Linking
- Configured via React Navigation linking.
- Universal Links (iOS) and App Links (Android).
- Example: `nurseryapp://post/123` opens the app and navigates to the specific post.

## 4. Video Playback
- Uses `react-native-video` to handle HLS streams from the media server.
- Custom overlay controls for volume, full-screen, and connection status.

## 5. Offline Capabilities & Caching
- Critical data (schedules, recent messages) cached locally using AsyncStorage or MMKV.
- React Query handles caching API responses to ensure a snappy UI even on slow networks.
