import type { AspidaClient, BasicHeaders } from 'aspida';
import { dataToURLString } from 'aspida';
import type { Methods as Methods_jivkqp } from './v1alpha1/health/liveness';
import type { Methods as Methods_1nbz74g } from './v1alpha1/health/readiness';
import type { Methods as Methods_4jdmpb } from './v1alpha1/projects';

const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? 'http://admin.example.com' : baseURL).replace(/\/$/, '');
  const PATH0 = '/v1alpha1/health/liveness';
  const PATH1 = '/v1alpha1/health/readiness';
  const PATH2 = '/v1alpha1/projects';
  const GET = 'GET';
  const POST = 'POST';

  return {
    v1alpha1: {
      health: {
        liveness: {
          /**
           * Check if the service is alive.
           * @returns Service is alive.
           */
          get: (option?: { config?: T | undefined } | undefined) =>
            fetch<Methods_jivkqp['get']['resBody'], BasicHeaders, Methods_jivkqp['get']['status']>(prefix, PATH0, GET, option).json(),
          /**
           * Check if the service is alive.
           * @returns Service is alive.
           */
          $get: (option?: { config?: T | undefined } | undefined) =>
            fetch<Methods_jivkqp['get']['resBody'], BasicHeaders, Methods_jivkqp['get']['status']>(prefix, PATH0, GET, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH0}`,
        },
        readiness: {
          /**
           * Check if the service is ready for receiving requests.
           * @returns Service is ready.
           */
          get: (option?: { config?: T | undefined } | undefined) =>
            fetch<Methods_1nbz74g['get']['resBody'], BasicHeaders, Methods_1nbz74g['get']['status']>(prefix, PATH1, GET, option).json(),
          /**
           * Check if the service is ready for receiving requests.
           * @returns Service is ready.
           */
          $get: (option?: { config?: T | undefined } | undefined) =>
            fetch<Methods_1nbz74g['get']['resBody'], BasicHeaders, Methods_1nbz74g['get']['status']>(prefix, PATH1, GET, option).json().then(r => r.body),
          $path: () => `${prefix}${PATH1}`,
        },
      },
      projects: {
        /**
         * Retrieve a list of all projects.
         * @returns A list of projects.
         */
        get: (option: { query: Methods_4jdmpb['get']['query'], config?: T | undefined }) =>
          fetch<Methods_4jdmpb['get']['resBody'], BasicHeaders, Methods_4jdmpb['get']['status']>(prefix, PATH2, GET, option).json(),
        /**
         * Retrieve a list of all projects.
         * @returns A list of projects.
         */
        $get: (option: { query: Methods_4jdmpb['get']['query'], config?: T | undefined }) =>
          fetch<Methods_4jdmpb['get']['resBody'], BasicHeaders, Methods_4jdmpb['get']['status']>(prefix, PATH2, GET, option).json().then(r => r.body),
        /**
         * Create a new project.
         * @returns Project created successfully.
         */
        post: (option: { body: Methods_4jdmpb['post']['reqBody'], config?: T | undefined }) =>
          fetch<Methods_4jdmpb['post']['resBody'], BasicHeaders, Methods_4jdmpb['post']['status']>(prefix, PATH2, POST, option).json(),
        /**
         * Create a new project.
         * @returns Project created successfully.
         */
        $post: (option: { body: Methods_4jdmpb['post']['reqBody'], config?: T | undefined }) =>
          fetch<Methods_4jdmpb['post']['resBody'], BasicHeaders, Methods_4jdmpb['post']['status']>(prefix, PATH2, POST, option).json().then(r => r.body),
        $path: (option?: { method?: 'get' | undefined; query: Methods_4jdmpb['get']['query'] } | undefined) =>
          `${prefix}${PATH2}${option && option.query ? `?${dataToURLString(option.query)}` : ''}`,
      },
    },
  };
};

export type ApiInstance = ReturnType<typeof api>;
export default api;
