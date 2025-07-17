import { Page } from "@playwright/test";
import { Context } from "Context/Context";

export enum FlowException {
  StopParentAfter,
  UseNewPageOnStack,
  DebugBefore,
  DebugAfter,
}

/**
 * ### FlowOptions
 *
 * These are the default options for a created flow, whether grouped or stepped.
 *
 * Most will use Playwright's internal functionality to perform their named task.
 */
export interface FlowOptions<CustomOptions extends object = {}, TestConfiguration extends object = {}> {
  exceptions?: Array<FlowException>;
  preProcess?: ProcessHandler<CustomOptions, TestConfiguration>;
  postProcess?: ProcessHandler<CustomOptions, TestConfiguration>;
  custom?: CustomOptions;
}

/**
 * ### StepFunction
 *
 * A flow-style function meant to be a "leaf", by directly calling a set of Playwright
 * instructions and/or assertions.
 *
 * @param {import('@playwright/test').Page} page - The current Playwright page.
 * @param {FlowFields} fields - A list of fields in this Flow Function. If using Playwright Flows's `createTest`, this will be automatically configured.
 * @param {FlowOptions} options - A list of current options for the Flow Function.
 *
 * Use this in custom code, or within a `createFlow` method to configure a lot of this information for you.
 *
 * ```
 * const loginFlow: StepFunction = (page, fields, options) => {
 *    page.getByLabel("Username").fill(fields.username);
 *    page.getByLabel("Password").fill(fields.password);
 *    if (options.login) {
 *        page.getByText("Login").click();
 *    }
 * }
 */
export type StepFunction<
  Fields extends object = {},
  CustomOptions extends object = {},
  TestConfiguration extends object = {}
> = (page: Page, fields: Fields, options?: CustomOptions, context?: Context<TestConfiguration>) => Promise<void>;

export type ProcessHandler<CustomOptions extends object = {}, TestConfiguration extends object = {}> = (
  page: Page,
  id: string,
  options?: CustomOptions,
  context?: Context<TestConfiguration>
) => Promise<void>;

export type StepHandler<
  Fields extends object = {},
  CustomOptions extends object = {},
  TestConfiguration extends object = {}
> = (
  page: Page,
  fields: Fields,
  options: FlowOptions<CustomOptions, TestConfiguration>,
  context?: Context<TestConfiguration>
) => Promise<Array<FlowException>>;

export interface Flow<
  Fields extends object = {},
  CustomOptions extends object = {},
  TestConfiguration extends object = {}
> {
  id: string;
  handler: StepHandler<Fields, CustomOptions, TestConfiguration>;
}

// export type StepFlowFactory<Fields extends object = {}, CustomOptions extends object = {}> = (
//   steps: StepFunction<Fields, CustomOptions>,
//   defaultFields: Fields,
//   defaultOptions: FlowOptions<CustomOptions, TestConfiguration>
// ) => StepHandler<Fields, CustomOptions>;
