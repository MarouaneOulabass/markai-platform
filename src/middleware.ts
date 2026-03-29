export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: ["/dashboard/:path*", "/api/clients/:path*", "/api/campaigns/:path*", "/api/runs/:path*", "/api/tokens/:path*", "/api/services/execute/:path*", "/api/user/:path*"],
};
