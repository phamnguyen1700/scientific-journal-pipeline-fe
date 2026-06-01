import https from "node:https";

import { NextRequest, NextResponse } from "next/server";

const backendApiBaseUrl =
  process.env.BACKEND_API_BASE_URL ?? "https://157.66.101.190:8443/api";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, context);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, context);
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, context);
}

async function proxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const target = new URL(`${backendApiBaseUrl}/${path.join("/")}`);
  target.search = request.nextUrl.search;

  const requestBody =
    request.method === "GET" || request.method === "HEAD"
      ? undefined
      : Buffer.from(await request.arrayBuffer());

  try {
    const response = await sendRequest(target, request, requestBody);

    return new NextResponse(new Uint8Array(response.body), {
      status: response.status,
      headers: response.headers,
    });
  } catch {
    return NextResponse.json(
      {
        succeeded: false,
        result: null,
        errors: ["Unable to connect to the backend API."],
      },
      { status: 502 }
    );
  }
}

function sendRequest(
  target: URL,
  request: NextRequest,
  body?: Buffer
): Promise<{ body: Buffer; headers: Headers; status: number }> {
  return new Promise((resolve, reject) => {
    const headers = new Headers();
    const authorization = request.headers.get("authorization");
    const contentType = request.headers.get("content-type");

    if (authorization) headers.set("authorization", authorization);
    if (contentType) headers.set("content-type", contentType);
    if (body) headers.set("content-length", String(body.byteLength));

    const proxyRequest = https.request(
      target,
      {
        method: request.method,
        headers: Object.fromEntries(headers.entries()),
        rejectUnauthorized: false,
      },
      (proxyResponse) => {
        const chunks: Buffer[] = [];

        proxyResponse.on("data", (chunk: Buffer) => chunks.push(chunk));
        proxyResponse.on("end", () => {
          const responseHeaders = new Headers();
          const responseContentType = proxyResponse.headers["content-type"];

          if (responseContentType) {
            responseHeaders.set("content-type", responseContentType);
          }

          resolve({
            body: Buffer.concat(chunks),
            headers: responseHeaders,
            status: proxyResponse.statusCode ?? 502,
          });
        });
      }
    );

    proxyRequest.on("error", reject);
    if (body) proxyRequest.write(body);
    proxyRequest.end();
  });
}
