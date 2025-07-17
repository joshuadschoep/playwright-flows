import { BrowserContext, Page } from "@playwright/test";
import { Configuration, LIBRARY_DEFAULT_CONFIGURATION } from "Context/Configuration/Configuration";
import { RootItemStack } from "Utility/Stack";
import _ from "lodash";

export interface Context<TestConfiguration extends object = {}> {
  pageStack: RootItemStack<Page>;
  config: Configuration<TestConfiguration>;
}

export const createContext = <TestConfiguration extends object = {}>(
  rootPage: Page,
  browserContext: BrowserContext,
  name: string,
  testConfig?: TestConfiguration
): Context<TestConfiguration> => ({
  pageStack: new RootItemStack(rootPage),
  config: _.merge(LIBRARY_DEFAULT_CONFIGURATION, {
    playwright: { context: browserContext, name },
    test: testConfig,
  }),
});
