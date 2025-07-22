import { Err, Ok, Result } from "oxide.ts";

export class FetchError extends Error {
  constructor(public readonly status: number, public readonly text: string) {
    super(text);
  }

}

export class HttpHandler {
  constructor(private dest: string) {
    if (dest.charCodeAt(dest.length - 1) == '/'.charCodeAt(0)) this.dest = dest.slice(0, dest.length - 1);
  }

  private async make_req<B, T>(
    route: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: B,
    headers?: Record<string, string>
  ): Promise<any> {
    try {
      const res = await fetch(this.dest + (route[0] == '/' ? route : '/' + route), {
        method,
        credentials: 'include',
        headers: body ? Object.assign({ 'Content-Type': 'application/json' }, headers) : undefined,
        body: (method == 'GET' || method == void 0) && body == void 0 ? void 0 : JSON.stringify(body)
      });
      if (res.ok) return Ok(await res.json());
      else return Err(new FetchError(res.status, res.statusText));
    } catch (e: any) {
      return Err(e);
    }
  }
  /** Makes a GET request to the client on the given `route` including credentials */
  async get<T>(route: string): Promise<Result<T, Error>> {
    return await this.make_req<undefined, T>(route);
  }

  async post<B extends any, T>(route: string, body: B, headers?: Record<string, string>): Promise<Result<T, Error>> {
    return await this.make_req<B, T>(route, 'POST', body, headers);
  }

  async put<B extends any, T>(route: string, body: B, headers?:Record<string,string>): Promise<Result<T, Error>> {
    return await this.make_req<B,T>(route, 'PUT', body, headers)
  }
}

export const AppHttp = new HttpHandler(import.meta.env.VITE_API_URL!);
