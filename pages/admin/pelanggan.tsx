import { connect } from "react-redux";
import Layout from "../../components/Layout";

import { logoutAuth } from "../../store/auth/action";
import { ReactElement } from "react";

const Home = (props: any) => {
  return (
    <div className="container">
      <h1>Pelanggan</h1>
    </div>
  );
};

const mapActionsToProps = {
  logoutAuth,
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default connect(null, mapActionsToProps)(Home);
