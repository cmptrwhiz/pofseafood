import { NextResponse, type NextRequest } from "next/server";

const DASHBOARD_REALM = "Plenty of Fish Admin";

function unauthorized(message = "Authentication required.") {
  return new NextResponse(message, {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${DASHBOARD_REALM}", charset="UTF-8"`,
      "Cache-Control": "no-store",
    },
  });
}

function forbidden(message = "Dashboard access is not configured.") {
  return new NextResponse(message, {
    status: 403,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

function parseBasicAuth(header: string | null) {
  if (!header?.startsWith("Basic ")) {
    return null;
  }

  try {
    const decoded = atob(header.slice("Basic ".length));
    const separatorIndex = decoded.indexOf(":");
    if (separatorIndex === -1) {
      return null;
    }

    return {
      username: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1),
    };
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const password = process.env.DASHBOARD_PASSWORD;
  const username = process.env.DASHBOARD_USERNAME || "admin";

  if (!password) {
    return forbidden(
      "Set DASHBOARD_PASSWORD in the environment before using the dashboard."
    );
  }

  const credentials = parseBasicAuth(request.headers.get("authorization"));
  if (
    !credentials ||
    credentials.username !== username ||
    credentials.password !== password
  ) {
    return unauthorized();
  }

  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
