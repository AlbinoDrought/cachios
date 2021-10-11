import {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

import { 
  Options,
} from 'node-cache';

export type CacheIdentifier = (config: CachiosRequestConfig) => Partial<CachiosRequestConfig>;

export type ResponseCopier<T = never, R = AxiosResponse<T>> = (response: R) => Partial<R>;

export interface Cache {
  get<T>(key: string): T|undefined;
  set<T>(key: string, value: T, ttl: number): unknown;
}

export interface CachiosRequestConfig extends AxiosRequestConfig {
  ttl?: number;
  force?: boolean;
}

export interface CachiosInstance {
  axiosInstance: AxiosInstance;
  cache: Cache;

  getCacheIdentifier: CacheIdentifier;
  getResponseCopy: ResponseCopier;

  request<T = never, R = AxiosResponse<T>> (config: CachiosRequestConfig): Promise<R>;
  get<T = never, R = AxiosResponse<T>>(url: string, config?: CachiosRequestConfig): Promise<R>;
  delete<T = never, R = AxiosResponse<T>>(url: string, config?: CachiosRequestConfig): Promise<R>;
  head<T = never, R = AxiosResponse<T>>(url: string, config?: CachiosRequestConfig): Promise<R>;
  options<T = never, R = AxiosResponse<T>>(url: string, config?: CachiosRequestConfig): Promise<R>;
  post<T = never, R = AxiosResponse<T>>(url: string, data?: T, config?: CachiosRequestConfig): Promise<R>;
  put<T = never, R = AxiosResponse<T>>(url: string, data?: T, config?: CachiosRequestConfig): Promise<R>;
  patch<T = never, R = AxiosResponse<T>>(url: string, data?: T, config?: CachiosRequestConfig): Promise<R>;
}

export interface CachiosStatic extends CachiosInstance {
  create(axiosInstance: AxiosInstance, nodeCacheConf?: Options): CachiosInstance;
}

declare const cachios: CachiosStatic;

export default cachios;
