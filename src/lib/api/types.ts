interface Request<T = unknown> {
  url: string;
  method: "POST" | "GET";
  headers: Map<string, string>;
  body?: T;
}

interface Response<T = string> {
  status: number;
  body: T;
}

const downloadRequest = (
  server: string,
  dataSource: string,
  path?: string,
  cookies?: string
): Request<{
  dataSource: string;
  path?: string;
  cookies?: string;
}> => {
  return {
    url: `${server}/api/v1/download`,
    method: "POST",
    headers: new Map(),
    body: {
      dataSource,
      path,
      cookies,
    },
  };
};

const healthzRequest = (server: string): Request => {
  return {
    url: `${server}/healthz`,
    method: "GET",
    headers: new Map(),
  };
};

const refreshRequest = (): Request => {
  return {
    url: "/api/v1/refresh",
    method: "POST",
    headers: new Map(),
    body: {},
  };
};

export { downloadRequest, healthzRequest, refreshRequest };
export type { Request, Response };
