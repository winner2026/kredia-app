export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/cards/:path*",
    "/simulator/:path*",
    // NO agregar /login ni /register; son rutas publicas
  ],
};
