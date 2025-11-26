import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ✔ Definimos el tipo localmente (solo para el frontend)
type UserRole =
  | "Admin"
  | "Seller"
  | "Warehouse"
  | "DeliveryDriver"
  | "Client"
  | "Support"
  | "Supplier";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  // Rutas públicas
  const publicRoutes = ["/login", "/signup", "/startPage", "/home", "/"];

  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  // Si no tiene token → login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    const expired = payload.exp * 1000 < Date.now();
    if (expired) {
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.delete("token");
      return res;
    }

    const role = payload.role as UserRole;

    // Rutas permitidas por rol
    const roleRoutes: Record<UserRole, string[]> = {
      Admin: ["/admin"],
      Seller: ["/seller"],
      Warehouse: ["/warehouse"],
      DeliveryDriver: ["/delivery"],
      Client: ["/user", "/home", "/product"],
      Support: ["/support"],
      Supplier: ["/supplier"],
    };

    const allowedPrefixes = roleRoutes[role] || [];

    const isAllowed = allowedPrefixes.some((prefix) =>
      path.startsWith(prefix)
    );

    if (!isAllowed) {
      if (role === "Admin")
        return NextResponse.redirect(new URL("/admin", req.url));
      if (role === "Client")
        return NextResponse.redirect(new URL("/home", req.url));

      return NextResponse.redirect(new URL("/", req.url));
    }
  } catch (error) {
    console.log("Token error:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/user/:path*",
    "/seller/:path*",
    "/warehouse/:path*",
    "/delivery/:path*",
    "/product/:path*",
    "/services/:path*",
    "/support/:path*",
    "/supplier/:path*",
    "/sellings/:path*",
  ],
};
