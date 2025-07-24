import { Flow, FlowHandler, FlowOptions } from "Flow/types";
import { test as playwrightTest } from "@playwright/test";
import { createContext, FlowContext } from "Context/Context";
import _ from "lodash";

/**
 * ### Test
 *
 * Full set of parameters for a Flow test run.
 *
 * Takes fields, options, etc.
 *
 * Importantly, takes a `flow` object that will be the initial {@link Flow} ran.
 *
 * Also takes an `after` parameter that can be used to handle assertions, end-checks, or shutdown.
 */
export interface Test<
  Fields extends object = Record<string, any>,
  Options extends FlowOptions = FlowOptions,
  Context extends FlowContext = FlowContext
> {
  name: string;
  flow: Flow<Fields, Options, Context>;
  fields: Fields;
  options?: Options;
  context?: Context;
  after?: FlowHandler<Fields, Options, Context>;
}

/**
 * ### LIBRARY_DEFAULT_TEST
 *
 * _Internal Constant_
 *
 * Default instance of a Test object. Should be merged/overwritten with actual values.
 */
export const LIBRARY_DEFAULT_TEST: Pick<Test, "name" | "fields" | "options"> & { context: object } = {
  name: "DEFAULT_TEST",
  fields: {},
  options: {},
  context: {},
};

/**
 * ### CreateTestParameters
 *
 * Initialization parameters for a Flows test wrapper.
 *
 * Subset of {@link Test}.
 */
export type CreateTestParameters<
  Fields extends object = Record<string, any>,
  Options extends FlowOptions = FlowOptions,
  Context extends FlowContext = FlowContext
> = Omit<Test<Fields, Options, Context>, "context"> & { context: Omit<Context, keyof FlowContext> };

type PlaywrightTestParameters = Parameters<Parameters<typeof playwrightTest>[2]>[0];

/**
 * ## createTest
 *
 * This method creates a Playwright style test while handling initial configuration and context creation for playwright-flows.
 *
 * Can be configured using a {@link Test} object.
 * Related, takes a {@link CreateTestParameters} to create, which is a subset of {@link Test}
 *
 * ### Usage
 *
 * _Playwright will detect one test with name "should log-in user", and then playwright-flows will take over with the Login flow._
 * ```
 * import { test } from '@playwright/test';
 *
 * const flowsConfig: CreateTestParameters = {
 *    name: "should log-in user",
 *    flow: ApplicationTests.Login,
 *    //...
 * }
 *
 * test(...createTest(flowsConfig));
 * ```
 */
export function createTest<
  Fields extends object = Record<string, any>,
  Options extends FlowOptions = FlowOptions,
  Context extends FlowContext = FlowContext
>(testConfig: CreateTestParameters<Fields, Options, Context>) {
  const mergedTest = _.merge({}, LIBRARY_DEFAULT_TEST, testConfig) as Test<Fields, Options, Context>;
  return [
    mergedTest.name,
    async ({ page, context: browserContext }: PlaywrightTestParameters) => {
      const context = createContext(mergedTest.name, page, browserContext, mergedTest.context ?? {});
      // @ts-expect-error Check back later once I'm better at typescript
      await mergedTest.flow.execute(page, mergedTest.fields, mergedTest.options, context);

      if (mergedTest.after) {
        // @ts-expect-error Check back later once I'm better at typescript
        await mergedTest.after(page, mergedTest.fields, mergedTest.options, context);
      }
    },
  ];
}
