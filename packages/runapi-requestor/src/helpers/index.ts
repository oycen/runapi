import { compile } from "path-to-regexp";

export function isAbsoluteUrl(url: string) {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}

export function isLocalUrl(hostname: string) {
  return /(127.0.0.1)|(0.0.0.0)|(localhost)/g.test(hostname);
}

export function isDomainUrl(hostname: string) {
  return !/((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g.test(hostname);
}

export function splitHostnameByHyphen(hostname: string) {
  return hostname.includes("-") ? hostname.split("-") : [];
}

export function combineUrl(baseUrl: string, relativeUrl: string) {
  return relativeUrl ? baseUrl.replace(/\/+$/, "") + "/" + relativeUrl.replace(/^\/+/, "") : baseUrl;
}

export function buildUrl(baseUrl: string, relativeUrl: string) {
  if (baseUrl && !isAbsoluteUrl(relativeUrl)) return combineUrl(baseUrl, relativeUrl);
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

export function getApplicationClient() {
  if (window) return "browser";
  return "wechatminiapp";
}
