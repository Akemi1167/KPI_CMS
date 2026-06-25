import {
  backendClient,
  forbiddenResponse,
  getServiceAccessToken,
  requireEmployeeUser,
  unauthorizedResponse,
} from "@/lib/api/serverBackend";

export async function GET(request: Request) {
  const employee = await requireEmployeeUser(request);
  if (!employee) return unauthorizedResponse();

  try {
    const serviceToken = await getServiceAccessToken();
    const res = await backendClient.get("/kpi-event-types", {
      params: { limit: 100 },
      headers: { Authorization: `Bearer ${serviceToken}` },
    });

    const data = res.data.data.filter(
      (item: { isActive: boolean }) => item.isActive,
    );

    return Response.json({ data, meta: res.data.meta });
  } catch (error: unknown) {
    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
      "Failed to load event types";
    return Response.json({ statusCode: 500, message }, { status: 500 });
  }
}
