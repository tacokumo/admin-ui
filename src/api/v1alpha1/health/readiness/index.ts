/* eslint-disable */
import type { DefineMethods } from 'aspida';
import type * as Types from '../../../@types';

export type Methods = DefineMethods<{
  /** Check if the service is ready for receiving requests. */
  get: {
    status: 200;
    /** Service is ready. */
    resBody: Types.HealthResponse;
  };
}>;
