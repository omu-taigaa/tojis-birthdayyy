import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Only look for unit tests under tests/unit/
    include: ['unit/**/*.spec.{js,ts}'],

    // jsdom so DOM-related code can run if needed
    environment: 'jsdom',
  },
});
