import {
  backendClient,
  forbiddenResponse,
  getServiceAccessToken,
  requireEmployeeUser,
  unauthorizedResponse,
} from "@/lib/api/serverBackend";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const employee = await requireEmployeeUser(request);
  if (!employee) return unauthorizedResponse();

  const { id } = await params;

  try {
    const serviceToken = await getServiceAccessToken();
    const res = await backendClient.get(`/kpi-results/${id}/breakdown`, {
      headers: { Authorization: `Bearer ${serviceToken}` },
    });

    if (res.data.data.user.id !== employee.id) {
      return forbiddenResponse("You cannot view this KPI result");
    }

    return Response.json(res.data);
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data?.message ??
      "Failed to load breakdown";

    return Response.json({ statusCode: status ?? 500, message }, { status: status ?? 500 });
  }
}
