/* eslint-disable */
import type { DefineMethods } from 'aspida';
import type * as Types from '../../@types';

export type Methods = DefineMethods<{
  /** Retrieve a list of all projects. */
  get: {
    query: {
      /** Maximum number of projects to return */
      limit: number;
      /** Number of projects to skip for pagination */
      offset: number;
    };

    status: 200;
    /** A list of projects. */
    resBody: Types.Project[];
  };

  /** Create a new project. */
  post: {
    status: 201;
    /** Project created successfully. */
    resBody: Types.Project;
    reqBody: Types.CreateProjectRequest;
  };
}>;
