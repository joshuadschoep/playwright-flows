import { BrowserContext, Page } from "@playwright/test";
import { RootItemStack } from "Utility/Stack";

export interface FlowContext {
  name: string;
  pages: RootItemStack<Page>;
  context: BrowserContext;
}

export const createContext = <Context extends FlowContext = FlowContext>(
  name: string,
  rootPage: Page,
  browserContext: BrowserContext,
  custom: Record<string, any>,
): Context =>
  ({
    pages: new RootItemStack(rootPage),
    context: browserContext,
    name,
    ...custom,
  }) as Context;
