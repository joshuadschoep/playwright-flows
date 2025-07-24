import { Page } from "@playwright/test";
import { FlowContext } from "Context/Context";
import { FlowException } from "./const";

/**
 * ## FlowOptions
 *
 * Options should be used in a flow to change or halt standard flow processes.
 *
 * Examples would include
 * - failure tests that want to exit early from a standard flow
 * - handling of tasks outside the form and fields
 * - user-only: pausing execution using Playwright debug methods
 * - popup pages, new tabs, etc.
 */
export interface FlowOptions<Fields extends object = object, Context extends FlowContext = FlowContext> {
  preProcess?: Executer<Fields, FlowOptions, Context>;
  postProcess?: Executer<Fields, FlowOptions, Context>;
  debugBefore?: boolean;
  debugAfter?: boolean;
  stopParentBefore?: boolean;
  stopParentAfter?: boolean;
  createdPage?: boolean;
  removedPage?: boolean;
}

/**
 * ## FlowHandler
 *
 * A flow-style function meant to be a "leaf", by directly calling a set of Playwright
 * instructions and/or assertions.

 * Use this in custom code, or within a `createFlow` method to configure a lot of this information for you.
 *
 * #### Usage
 *
 * ##### _Basic Usage_
 * 
 * ```
 * const loginFlow: FlowHandler = (page, fields) => {
 *    page.getByLabel("Username").fill(fields.username);
 *    page.getByLabel("Password").fill(fields.password);
 * }
 * ```
 *
 * ##### _Type integration_
 * ```
 * interface LoginFields {
 *    username: string,
 *    password: string,
 * }
 * 
 * const loginFlow: FlowHandler<LoginFields> = (page, fields) => {
 *    page.getByLabel("Username").fill(fields.username); // string
 *    page.getByLabel("Password").fill(fields.password); // string
 * }
 * ```
 *
 * ##### _Custom options_
 * ```
 * interface LoginFields {
 *    username: string,
 *    password: string,
 * }
 * 
 * interface LoginOptions {
 *    login: boolean;
 * }
 * 
 * const loginFlow: FlowHandler<LoginFields, LoginOptions> = (page, fields, options) => {
 *    page.getByLabel("Username").fill(fields.username);
 *    page.getByLabel("Password").fill(fields.password);
 *    if (options.login) {
 *        page.getByText("Login").click();
 *    }
 * }
 * ```
 */
export type FlowHandler<
  Fields extends object = object,
  Options extends FlowOptions = FlowOptions,
  Context extends FlowContext = FlowContext,
> = (page: Page, fields: Fields, options: Options, context?: Context) => Promise<void>;

/**
 * ## CreateFlowParameters
 *
 * TODO: Make jsdoc
 */
export interface CreateFlowParameters<
  Fields extends object = object,
  Options extends FlowOptions = FlowOptions,
  Context extends FlowContext = FlowContext,
> {
  id?: string;
  handler: FlowHandler<Fields, Options, Context> | Array<Flow>;
  defaultFields?: Partial<Fields>;
  defaultOptions?: Partial<Options>;
}

/**
 * ### Executer
 *
 * _Internal_
 *
 * TODO: make jsdoc
 */
export type Executer<
  Fields extends object = object,
  Options extends FlowOptions = FlowOptions,
  Context extends FlowContext = FlowContext,
> = (page: Page, fields: Fields, options: Options, context?: Context) => Promise<Array<FlowException>>;

/**
 * ## Flow
 *
 * TODO: Make jsdoc
 */
export interface Flow<
  Fields extends object = object,
  Options extends FlowOptions = FlowOptions,
  Context extends FlowContext = FlowContext,
> {
  id?: string;
  execute: Executer<Fields, Options, Context>;
}
