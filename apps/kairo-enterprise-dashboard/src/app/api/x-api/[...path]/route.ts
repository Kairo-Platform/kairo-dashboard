import { handleBffRequest, proxyXApiRequest } from "@/lib/bff/proxyRoute";

export async function GET(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return handleBffRequest(request, path, proxyXApiRequest);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return handleBffRequest(request, path, proxyXApiRequest);
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return handleBffRequest(request, path, proxyXApiRequest);
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return handleBffRequest(request, path, proxyXApiRequest);
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return handleBffRequest(request, path, proxyXApiRequest);
}
