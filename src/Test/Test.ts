import { Flow, FlowOptions, StepFunction } from "Flow/types";
import { test as playwrightTest } from "@playwright/test";
import { createContext } from "Context/Context";
import _ from "lodash";

export interface Test<
  Fields extends object = {},
  CustomOptions extends object = {},
  TestConfiguration extends object = {}
> {
  name: string;
  flow: Flow<Fields, CustomOptions, TestConfiguration>;
  fields: Fields;
  options?: FlowOptions<CustomOptions>;
  config?: TestConfiguration;
  after?: StepFunction;
}

export const LIBRARY_DEFAULT_TEST: Pick<Test, "name" | "fields" | "options"> & { config: {} } = {
  name: "DEFAULT_TEST",
  fields: {},
  options: {},
  config: {},
};

export function test<
  Fields extends object = {},
  CustomOptions extends object = {},
  TestConfiguration extends object = {}
>(test: Test<Fields, CustomOptions, TestConfiguration>) {
  const mergedTest = _.merge(LIBRARY_DEFAULT_TEST, test);
  playwrightTest(mergedTest.name, async ({ page, context: browserContext }) => {
    const context = createContext(page, browserContext, mergedTest.name, mergedTest.config);
    await mergedTest.flow.handler(page, mergedTest.fields, mergedTest.options ?? {}, context);

    if (mergedTest.after) {
      await mergedTest.after(page, mergedTest.fields, mergedTest.options, context);
    }
  });
}
