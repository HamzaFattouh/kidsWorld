import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { useAuthStore } from '../store/authStore';

describe('Auth Flow & Role Switching Test', () => {
  beforeEach(() => {
    useAuthStore.setState({
      token: null,
      role: null,
      user: null,
      isAuthenticated: false,
      error: null,
    });
  });

  test('LoginScreen: renders inputs, handles quick role logins (Parent, Teacher, Admin)', async () => {
    const screen = await render(<LoginScreen />);

    // 1. Check title & inputs
    expect(screen.getByText('تسجيل الدخول')).toBeTruthy();
    expect(screen.getByPlaceholderText('Email / Username')).toBeTruthy();
    expect(screen.getByPlaceholderText('Password')).toBeTruthy();

    // 2. Type credentials
    const emailInput = screen.getByPlaceholderText('Email / Username');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.changeText(emailInput, 'teacher@kidsworld.ps');
    fireEvent.changeText(passwordInput, 'TeacherPass123!');

    // 3. Test Quick Role Selection Buttons
    const teacherBtn = screen.getByText('Teacher');
    await act(async () => {
      fireEvent.press(teacherBtn);
    });

    expect(useAuthStore.getState().role).toBe('TEACHER');
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    // Switch to Parent
    const parentBtn = screen.getByText('Parent');
    await act(async () => {
      fireEvent.press(parentBtn);
    });
    expect(useAuthStore.getState().role).toBe('PARENT');

    // Switch to Admin
    const adminBtn = screen.getByText('Admin');
    await act(async () => {
      fireEvent.press(adminBtn);
    });
    expect(useAuthStore.getState().role).toBe('ADMIN');
  });
});
