/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as dietLogs from "../dietLogs.js";
import type * as dietPlans from "../dietPlans.js";
import type * as seed from "../seed.js";
import type * as todos from "../todos.js";
import type * as trainingPlans from "../trainingPlans.js";
import type * as users from "../users.js";
import type * as weightLogs from "../weightLogs.js";
import type * as workoutLogs from "../workoutLogs.js";
import type * as workouts from "../workouts.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  dietLogs: typeof dietLogs;
  dietPlans: typeof dietPlans;
  seed: typeof seed;
  todos: typeof todos;
  trainingPlans: typeof trainingPlans;
  users: typeof users;
  weightLogs: typeof weightLogs;
  workoutLogs: typeof workoutLogs;
  workouts: typeof workouts;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
