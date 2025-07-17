import { Flow, FlowException, FlowOptions, StepFunction } from "./types";
import _ from "lodash";
import { LIBRARY_DEFAULT_OPTIONS } from "./const";

export function createFlow<
  Fields extends object = {},
  CustomOptions extends object = {},
  TestConfiguration extends object = {}
>(
  id: string,
  steps: StepFunction<Fields, CustomOptions> | Array<Flow>,
  defaultFields: Fields,
  defaultOptions: FlowOptions<CustomOptions>
): Flow<Fields, CustomOptions, TestConfiguration> {
  return {
    id,
    handler: async (page, fields, options, context) => {
      const mergedFields: any = _.merge({}, defaultFields, fields);
      const mergedOptions: any = _.merge({}, LIBRARY_DEFAULT_OPTIONS, defaultOptions, options);
      if (mergedOptions.preProcess) {
        await mergedOptions.preProcess(page, id, mergedOptions, context);
      }

      if (mergedOptions.exceptions.includes(FlowException.DebugBefore)) {
        await page.pause();
      }

      if (Array.isArray(steps)) {
        let currentPage = page;
        for (let i = 0; i < steps.length; i++) {
          const step = steps[i];
          const childFields = mergedFields[step.id];
          const childOptions = mergedOptions[step.id];
          const exceptions = await step.handler(currentPage, childFields, childOptions, context);

          if (exceptions.includes(FlowException.StopParentAfter)) {
            break;
          }
          if (exceptions.includes(FlowException.UseNewPageOnStack)) {
            const newPage = context?.pageStack.peek();
            if (newPage) {
              currentPage = newPage;
            }
          }
        }
      } else {
        await steps(page, mergedFields, mergedOptions.custom, context);
      }

      if (mergedOptions.exceptions.includes(FlowException.DebugAfter)) {
        await page.pause();
      }

      if (mergedOptions.postProcess) {
        await mergedOptions.postProcess(page, id, mergedOptions, context);
      }

      return mergedOptions.exceptions;
    },
  };
}
