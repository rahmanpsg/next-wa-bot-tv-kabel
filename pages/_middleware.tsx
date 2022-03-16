import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";
import { NextURL } from "next/dist/server/web/next-url";

export function middleware(req: NextRequest) {
  const { jwt } = req.cookies;
  const url = req.nextUrl.clone();

  return redirectIfAuthenticated(jwt, url);
}

const redirectIfAuthenticated = (jwt: string, url: NextURL) => {
  const { pathname } = url;

  try {
    verify(jwt, process.env.TOKEN_KEY!);

    url.pathname = "/admin";

    // if (pathname == "/") return NextResponse.redirect(url);
    // else
    if (pathname != "/" && !pathname.includes("/admin").valueOf())
      return NextResponse.redirect(url);
  } catch (error) {
    if (pathname != "/" && url.pathname != "/login") {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
};
