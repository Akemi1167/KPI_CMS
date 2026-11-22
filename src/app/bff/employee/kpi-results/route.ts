import {
  backendClient,
  backendErrorResponse,
  getRequestAuthorization,
  requireEmployeeUser,
  unauthorizedResponse,
} from "@/lib/api/serverBackend";

export async function GET(request: Request) {
  const employee = await requireEmployeeUser(request);
  const authorization = getRequestAuthorization(request);
  if (!employee || !authorization) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);
  const periodId = searchParams.get("periodId");

  try {
    const res = await backendClient.get("/me/kpi-results", {
      params: {
        page: searchParams.get("page") ?? "1",
        limit: searchParams.get("limit") ?? "20",
        ...(periodId ? { periodId } : {}),
      },
      headers: { Authorization: authorization },
    });

    return Response.json(res.data);
  } catch (error: unknown) {
    return backendErrorResponse(error, "Failed to load KPI results");
  }
}
