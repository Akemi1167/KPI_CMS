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

  const periodId = new URL(request.url).searchParams.get("periodId");
  if (!periodId) {
    return Response.json(
      { statusCode: 400, message: "periodId is required" },
      { status: 400 },
    );
  }

  try {
    const res = await backendClient.get("/me/kpi-results/breakdown", {
      params: { periodId },
      headers: { Authorization: authorization },
    });

    return Response.json(res.data);
  } catch (error: unknown) {
    return backendErrorResponse(error, "Failed to load breakdown");
  }
}
