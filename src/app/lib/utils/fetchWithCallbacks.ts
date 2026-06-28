import { showErrorNotification, hideNotification } from "./notifications";

const jsonContentTypeKey1 = "Content-Type";
const jsonContentTypeKey2 = "content-type";
const jsonContentTypeValue = "application/json";

type FallbackMessages = {
  success?: string;
  error?: string;
};

type FetchResponse = {
  headers: Record<string, string>;
  body: any;
  message: string;
  status: number;
  statusText: string;
};

type RequestParams = {
  url?: string;
  options?: RequestInit & { headers?: Record<string, string> };
  fallbackMessages?: FallbackMessages;
};

type Callbacks = {
  onSuccess?: (response: FetchResponse) => void;
  onError?: (error: any) => void;
  onComplete?: () => void;
};

const getResponseMessage = (resBody: any): string | undefined =>
  resBody?.message || resBody?.msg;

const isResponseJson = (resHeaders: Record<string, string> | undefined) => {
  return (
    !!resHeaders?.[jsonContentTypeKey1]?.includes(jsonContentTypeValue) ||
    !!resHeaders?.[jsonContentTypeKey2]?.includes(jsonContentTypeValue)
  );
};

export const fetchWithCallbacks = async (
  requestParams: RequestParams = {},
  callbacks: Callbacks = {},
  logoutFn: () => void = () => null,
): Promise<FetchResponse | null | void> => {
  const { url, options = {}, fallbackMessages } = requestParams || {};
  const { headers: initialHeaders = {} } = options || {};
  const headers: Record<string, string> = {
    [jsonContentTypeKey1]: jsonContentTypeValue, // default Content-Type = application/json
    ...(initialHeaders as Record<string, string>),
  };

  // Note: if you want to send formData, you must delete the Content-Type header
  if (headers["Content-Type"] === "multipart/form-data")
    delete headers["Content-Type"];

  if (!url) {
    const err = new Error("fetchWithCallbacks: url is required");
    if (callbacks?.onError) {
      callbacks.onError(err);
      if (callbacks?.onComplete) callbacks.onComplete();
      return;
    }
    return Promise.reject(err);
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    }).then((res) => {
      const resHeaders = Object.fromEntries(res.headers.entries()) as Record<
        string,
        string
      >;
      const getResBody: Promise<any> = isResponseJson(resHeaders)
        ? res.json()
        : res.text();

      return new Promise<FetchResponse>((resolve, reject) => {
        getResBody
          .then((resBody) => {
            const { success: successMessage, error: errorMessage } =
              fallbackMessages || {};

            // response = { headers: {...}, body: {...}, message: '', status = 200, statusText = '' }
            const finalSuccessMessage =
              getResponseMessage(resBody) || successMessage || res.statusText;
            const finalErrorMessage =
              getResponseMessage(resBody) || errorMessage || res.statusText;
            const responseObj: FetchResponse = {
              headers: resHeaders,
              body: resBody,
              message: res.ok ? finalSuccessMessage : finalErrorMessage,
              status: res.status,
              statusText: res.statusText,
            };

            if (!res.ok) return reject(responseObj);
            return resolve(responseObj);
          })
          .catch((err) => {
            // If body parsing fails, reject with a minimal response-like shape
            reject({
              headers: resHeaders,
              body: null,
              message: err?.message || res.statusText || "Failed to parse body",
              status: res.status,
              statusText: res.statusText,
            } as FetchResponse);
          });
      });
    });

    if (callbacks?.onSuccess) {
      callbacks.onSuccess(response);
    } else {
      return Promise.resolve(response);
    }
  } catch (error: any) {
    if (error?.status === 401) {
      logoutFn();
      const notificationId = "SESSION_EXPIRED";
      hideNotification(null, notificationId);
      showErrorNotification({
        message: "Session expired. Please login again.",
        id: notificationId,
      });
      return null;
    }
    if (error?.status === 403) {
      const notificationId = "ACCESS_DENIED";
      hideNotification(null, notificationId);
      showErrorNotification({
        message: "Unauthorized access",
        id: notificationId,
      });
      return null;
    }
    if (callbacks?.onError) {
      callbacks.onError(error);
    } else {
      return Promise.reject(error);
    }
  } finally {
    if (callbacks?.onComplete) callbacks.onComplete();
  }
};

export default fetchWithCallbacks;
