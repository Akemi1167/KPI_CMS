import {
  backendClient,
  backendErrorResponse,
  getRequestAuthorization,
  requireEmployeeUser,
  unauthorizedResponse,
} from "@/lib/api/serverBackend";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const employee = await requireEmployeeUser(request);
  const authorization = getRequestAuthorization(request);
  if (!employee || !authorization) return unauthorizedResponse();

  const { id } = await params;

  try {
    const res = await backendClient.get(`/me/kpi-results/${id}/breakdown`, {
      headers: { Authorization: authorization },
    });

    return Response.json(res.data);
  } catch (error: unknown) {
    return backendErrorResponse(error, "Failed to load breakdown");
  }
}
