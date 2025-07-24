import { FlowOptions } from "./types";

/**
 * ### FlowException
 *
 * _Internal_
 *
 * TODO: Make jsdoc
 */
export enum FlowException {
  StopParent,
  UseNewPageOnStack,
}

/**
 * ### LIBRARY_DEFAULT_OPTIONS
 *
 * _Internal Constant_
 */
export const LIBRARY_DEFAULT_OPTIONS: FlowOptions = {
  postProcess: undefined,
  preProcess: undefined,
  debugBefore: false,
  debugAfter: false,
  stopParentBefore: false,
  stopParentAfter: false,
  createdPage: false,
  removedPage: false,
};
