import {
  backendClient,
  getBackendErrorMessage,
  getServiceAccessToken,
  requireEmployeeUser,
  unauthorizedResponse,
} from "@/lib/api/serverBackend";

export async function GET(request: Request) {
  const employee = await requireEmployeeUser(request);
  if (!employee) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") ?? "1";
  const limit = searchParams.get("limit") ?? "20";
  const periodId = searchParams.get("periodId") ?? undefined;

  try {
    const serviceToken = await getServiceAccessToken();
    const res = await backendClient.get("/kpi-results", {
      params: {
        page,
        limit,
        userId: employee.id,
        periodId,
      },
      headers: { Authorization: `Bearer ${serviceToken}` },
    });

    return Response.json(res.data);
  } catch (error: unknown) {
    const message = getBackendErrorMessage(error, "Failed to load KPI results");
    return Response.json({ statusCode: 500, message }, { status: 500 });
  }
}
