import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  if (process.env.NODE_ENV == "production") {
    const { pathname } = url;

    try {
      const baseURL = process.env.baseURL;

      const { jwt } = req.cookies;

      if (jwt == undefined) throw "Belum login";

      const res = await fetch(baseURL + "api/auth", {
        headers: {
          Cookie: `jwt=${jwt}`,
        },
      });
      const json = await res.json();

      if (!json.error) {
        url.pathname = "/admin";

        if (pathname != "/" && !pathname.includes("/admin").valueOf())
          return NextResponse.redirect(url);
      } else if (pathname != "/" && url.pathname != "/login") {
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }
    } catch (error) {
      console.log(error);

      if (pathname != "/" && url.pathname != "/login") {
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }
    }
  }

  return NextResponse.next();
}
