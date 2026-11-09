import '@testing-library/jest-native/extend-expect';
import { cleanup } from '@testing-library/react-native';

afterEach(() => {
  cleanup();
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SafeAreaProvider: ({ children }) => children,
    SafeAreaView: ({ children, style }) => React.createElement(View, { style }, children),
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock expo-secure-store
jest.mock('expo-secure-store', () => {
  const store = {};
  return {
    getItemAsync: jest.fn(async (key) => store[key] || null),
    setItemAsync: jest.fn(async (key, val) => {
      store[key] = val;
    }),
    deleteItemAsync: jest.fn(async (key) => {
      delete store[key];
    }),
  };
});

// Mock api service to prevent remote network timeouts in tests
jest.mock('../services/api', () => {
  const mockAxiosInstance = {
    get: jest.fn(() => Promise.resolve({ data: { data: [] } })),
    post: jest.fn(() => Promise.resolve({ data: { data: {} } })),
    put: jest.fn(() => Promise.resolve({ data: { data: {} } })),
    delete: jest.fn(() => Promise.resolve({ data: { data: {} } })),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  };
  return {
    __esModule: true,
    default: mockAxiosInstance,
    api: mockAxiosInstance,
    API_URL: 'https://mock.kidsworld.ps/api/v1',
  };
});

// Mock Modal cleanly with __esModule and default export
jest.mock('react-native/Libraries/Modal/Modal', () => {
  const React = require('react');
  const MockModal = ({ visible, children }) => {
    return visible ? React.createElement(React.Fragment, null, children) : null;
  };
  return {
    __esModule: true,
    default: MockModal,
  };
});
