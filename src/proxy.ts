import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Proxy for:
 * 1. Multi-domain routing (admin subdomain → dashboard routes)
 * 2. Auth session refresh
 * 3. Protected route redirection
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Check if the path needs locale redirection (only for root "/" and "/links" without prefix)
  const isRoot = pathname === "/";
  const isLinksWithoutLocale = pathname === "/links";

  if (isRoot || isLinksWithoutLocale) {
    const cookieLanguage = request.cookies.get("admin-language")?.value;
    let locale = "en";
    if (cookieLanguage === "en" || cookieLanguage === "id") {
      locale = cookieLanguage;
    } else {
      const acceptLanguage = request.headers.get("accept-language") || "";
      if (acceptLanguage.toLowerCase().includes("id")) {
        locale = "id";
      }
    }

    const redirectPathname = isRoot ? `/${locale}` : `/${locale}/links`;
    const url = request.nextUrl.clone();
    url.pathname = redirectPathname;
    return NextResponse.redirect(url);
  }

  const hostname = request.headers.get("host") || "";

  // Determine if this is the admin subdomain
  const isAdminHost =
    hostname.startsWith("admin.") || // Production: admin.fadil.bafagih.id
    pathname.startsWith("/admin"); // Local dev fallback: localhost:3000/admin

  // For local dev fallback, strip the /admin prefix to normalize paths
  let normalizedPath = pathname;
  if (!hostname.startsWith("admin.") && pathname.startsWith("/admin")) {
    normalizedPath = pathname.replace(/^\/admin/, "") || "/";
  }

  // Create a response object we can modify
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create Supabase client with cookie handling for session refresh
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh the session (important for server components)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Admin route protection
  // Protection should apply if it's an admin host OR if the path is /dashboard or /login
  const isDashboardRoute = normalizedPath.startsWith("/dashboard");
  const isLoginRoute = normalizedPath === "/login" || normalizedPath === "/";

  if (isAdminHost || isDashboardRoute || (user && isLoginRoute)) {
    // If user is not authenticated and trying to access dashboard
    if (!user && isDashboardRoute) {
      const loginUrl = new URL("/login", request.url);
      if (pathname.startsWith("/admin")) {
        loginUrl.pathname = "/admin/login";
      }
      return NextResponse.redirect(loginUrl);
    }

    // If user is authenticated and on login page, redirect to dashboard
    if (user && isLoginRoute) {
      const dashboardUrl = new URL("/dashboard", request.url);
      if (pathname.startsWith("/admin")) {
        dashboardUrl.pathname = "/admin/dashboard";
      }
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
