import { BrowserContext } from "@playwright/test";

export interface PlaywrightConfiguration {
  name: string;
  context?: BrowserContext;
}

export interface Configuration<TestConfiguration extends object = {}> {
  playwright?: PlaywrightConfiguration;
  test: TestConfiguration;
}

export const LIBRARY_DEFAULT_CONFIGURATION: Configuration = {
  test: {},
};
