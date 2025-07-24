import { CreateFlowParameters, Flow, FlowOptions } from "./types";
import _ from "lodash";
import { FlowException, LIBRARY_DEFAULT_OPTIONS } from "./const";
import { FlowContext } from "Context/Context";

export function createFlow<
  Fields extends object = Record<string, any>,
  Options extends FlowOptions = FlowOptions,
  Context extends FlowContext = FlowContext,
>({
  id,
  handler,
  defaultFields,
  defaultOptions,
}: CreateFlowParameters<Fields, Options, Context>): Flow<Fields, Options, Context> {
  return {
    id,
    execute: async (page, fields, options, context) => {
      const mergedFields: Fields = _.merge({}, defaultFields, fields);
      const mergedOptions: Options = _.merge({}, LIBRARY_DEFAULT_OPTIONS, defaultOptions, options);
      const defaultExceptions = [] as Array<FlowException>;
      if (mergedOptions.stopParentBefore) {
        return defaultExceptions;
      }

      if (mergedOptions.preProcess) {
        await mergedOptions.preProcess(page, mergedFields, mergedOptions, context);
      }

      if (mergedOptions.debugBefore) {
        await page.pause();
      }

      if (Array.isArray(handler)) {
        let currentPage = page;
        for (let i = 0; i < handler.length; i++) {
          const step = handler[i];
          let childFields = mergedFields;
          let childOptions = {};
          if (step?.id) {
            if (step.id in mergedFields) {
              childFields = (mergedFields as Record<string, Fields>)[step.id] as Fields;
            }
            if (step.id in mergedOptions) {
              // @ts-expect-error I think typescript is dumb for not figuring this one out
              childOptions = mergedOptions[step.id] as FlowOptions;
            }
          }
          const exceptions = await step.execute(currentPage, childFields, childOptions, context);

          if (exceptions.includes(FlowException.StopParent)) {
            break;
          }
          if (exceptions.includes(FlowException.UseNewPageOnStack)) {
            defaultExceptions.push(FlowException.UseNewPageOnStack);
            const newPage = context?.pages.peek();
            if (newPage) {
              currentPage = newPage;
            }
          }
        }
      } else {
        await handler(page, mergedFields, mergedOptions, context);
      }

      if (mergedOptions.debugAfter) {
        await page.pause();
      }

      if (mergedOptions.postProcess) {
        await mergedOptions.postProcess(page, mergedFields, mergedOptions, context);
      }

      return defaultExceptions;
    },
  };
}
