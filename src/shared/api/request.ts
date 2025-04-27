import { createEffect } from 'effector';

import { sessionGetFx } from '.';
import { LocalStorageKeys } from '../types';

const API_URL = 'http://localhost:5000/api/';

interface Request {
  url: string;
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  data?: object;
  retryCount?: number;
}

export const requestFx = createEffect<Request, any>(
  async ({ method, url, data, retryCount = 1 }) => {
    try {
      const accessToken = localStorage.getItem(LocalStorageKeys.accessToken);
      const response = await fetch(API_URL + url, {
        method,
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401 && retryCount > 0) {
          try {
            const response = await sessionGetFx();
            localStorage.setItem(LocalStorageKeys.accessToken, response.accessToken);

            requestFx({ method, url, data, retryCount: 0 });
          } catch (response: any) {
            return Promise.reject(response);
          }
        } else {
          const fetchedData = await response.json();
          throw new Error(fetchedData?.message);
        }
      }
      return await response.json();
    } catch (response: any) {
      return Promise.reject(response);
    }
  },
);
