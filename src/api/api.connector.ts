import type { AxiosError, GenericAbortSignal } from 'axios';
import axios from 'axios';

import i18next from '@/i18n';

export type CustomAxiosError = AxiosError<{
  message?: string | { message: string };
  statusCode: number;
}>;

export class ApiConnector {
  async call<Request, Response>({
    path,
    method = 'get',
    body,
    params,
    abortSignal
  }: {
    path: string;
    method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
    body?: Request;
    params?: Request;
    abortSignal?: GenericAbortSignal | undefined;
  }): Promise<Response> {
    const clonedParams = structuredClone(params);
    for (const param in clonedParams) {
      if (clonedParams[param] === undefined || !String(clonedParams[param]))
        delete clonedParams[param];
    }

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      const { data } = await axios(`${process.env.PUBLIC_API_URL}/` + path, {
        method,
        data: body,
        params: clonedParams,
        headers,
        signal: abortSignal,
        withCredentials: true
      });
      return data;
    } catch (e: unknown) {
      const error = e as CustomAxiosError;

      const statusCode =
        error?.response?.data?.statusCode || error?.response?.status;
      let message = i18next.t('error.base-1');
      if (statusCode && statusCode !== 404 && statusCode < 500) {
        message =
          (typeof error?.response?.data?.message === 'string'
            ? error?.response?.data?.message
            : Array.isArray(error?.response?.data?.message)
              ? error?.response?.data?.message.join('\n')
              : error?.response?.data?.message?.message) || message;
      }

      throw {
        message,
        statusCode,
        isCancelled: axios.isCancel(e)
      };
    }
  }
}

export const apiConnector = new ApiConnector();
