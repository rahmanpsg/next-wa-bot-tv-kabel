import "../styles/globals.css";

import { ReactElement, ReactNode } from "react";
import type { AppProps } from "next/app";
import { wrapper } from "../store/store";
import { NextPage } from "next";

// function MyApp({ Component, pageProps }: AppProps) {
//   return <Component {...pageProps} />;
// }

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const WrappedApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(<Component {...pageProps} />);
};

export default wrapper.withRedux(WrappedApp);
