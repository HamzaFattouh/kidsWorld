describe('Example E2E', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should show the login screen upon first launch', async () => {
    await expect(element(by.id('login-screen'))).toBeVisible();
    await expect(element(by.text('Sign In'))).toBeVisible();
  });

  it('should display error when submitting empty fields', async () => {
    await element(by.text('Sign In')).tap();
    await expect(element(by.text('Email is required'))).toBeVisible();
  });
});
