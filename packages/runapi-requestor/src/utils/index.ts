import { compile } from "path-to-regexp";

export function isAbsoluteUrl(url: string) {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}

export function combineUrl(baseUrl: string, relativeUrl: string) {
  return relativeUrl ? baseUrl.replace(/\/+$/, "") + "/" + relativeUrl.replace(/^\/+/, "") : baseUrl;
}

export function combinePath(basePath: string, path: string) {
  return path.indexOf("/") === 0 ? path : combineUrl(basePath, path);
}

export function buildUrl(baseUrl: string, relativeUrl: string) {
  if (!isAbsoluteUrl(relativeUrl)) return combineUrl(baseUrl, relativeUrl);
  return relativeUrl;
}

export function compilePath(path: string, params?: object) {
  return params ? compile(path)(params) : path;
}

export function objectToQueryString(object?: Record<string, any>) {
  if (!object) return;
  const qs = Object.keys(object)
    .map((key) => "".concat(encodeURIComponent(key), "=").concat(encodeURIComponent(object[key])))
    .join("&");
  return qs && `?${qs}`;
}

export async function waitDone(callBack: () => boolean, delay: number) {
  return new Promise<boolean>((resolve) => {
    if (callBack()) {
      const timer = setTimeout(() => {
        if (!callBack()) {
          resolve(true);
          clearTimeout(timer);
        }
      }, 300);
    }
    resolve(true);
  });
}
