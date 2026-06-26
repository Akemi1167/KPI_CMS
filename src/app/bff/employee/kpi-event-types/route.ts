import {
  backendClient,
  getBackendErrorMessage,
  requireEmployeeUser,
  unauthorizedResponse,
} from "@/lib/api/serverBackend";

export async function GET(request: Request) {
  const employee = await requireEmployeeUser(request);
  if (!employee) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);
  const eventKind = searchParams.get("eventKind");

  try {
    const res = await backendClient.get("/public/kpi-event-types", {
      params: eventKind ? { eventKind } : undefined,
    });

    return Response.json(res.data);
  } catch (error: unknown) {
    const message = getBackendErrorMessage(error, "Failed to load event types");
    return Response.json({ statusCode: 500, message }, { status: 500 });
  }
}
