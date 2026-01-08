import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
// import { getSession } from "next-auth/react";

export class HttpClient {
  private instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      timeout: 600000, // 10 minutes
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const res = await this.instance.get<T>(url, config);;
    return res.data;
  }

  // It might be used later
  // public async getNullable<T>(
  //   url: string,
  //   config: AxiosRequestConfig & { defaultGlobalToast?: boolean } = { defaultGlobalToast: false },
  // ): Promise<T | null> {
  //   const res = await this.instance.get<T>(url, config);;
  //   return res.status === 204 ? null : res.data;
  // }


  public async post<T, U = unknown>(
    url: string,
    data?: U,
    config?: AxiosRequestConfig ,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.post(url, data, config);
    return response.data;
  }

  public async put<T, U = unknown>(
    url: string,
    data?: U,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.put(url, data, config);
    return response.data;
  }

  public async delete<T>(
    url: string,
    config: AxiosRequestConfig & { defaultGlobalToast?: boolean } = { defaultGlobalToast: false },
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.delete(url, config);
    return response.data;
  }

  public async patch<T, U = unknown>(
    url: string,
    data?: U,
    config: AxiosRequestConfig & { defaultGlobalToast?: boolean } = { defaultGlobalToast: false },
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.instance.patch(url, data, config);
    return response.data;
  }
}

export function createHttpClient(baseURL: string): HttpClient {
  return new HttpClient(baseURL);
}
