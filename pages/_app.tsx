import "../styles/globals.css";

import Axios from "axios";
import { ReactElement, ReactNode } from "react";
import type { AppProps } from "next/app";
import { wrapper } from "../store/store";
import { NextPage } from "next";

Axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL + "/api";
Axios.defaults.withCredentials = true;

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
