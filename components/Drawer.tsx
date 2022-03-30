import React from "react";
import { withRouter, NextRouter } from "next/router";

import Link from "next/link";
import {
  TiHomeOutline,
  TiGroupOutline,
  TiBook,
  TiTicket,
} from "react-icons/ti";

interface WithRouterProps {
  router: NextRouter;
}

interface MyComponentProps extends WithRouterProps {}

type MenuType = {
  path: string;
  text: string;
  icon: any;
};

class Drawer extends React.Component<MyComponentProps> {
  state = {
    menuActive: "/admin",
  };

  componentDidMount() {
    this.handleChange(this.props.router.asPath);
  }

  handleChange = (path: string) => {
    this.setState({ menuActive: path });
  };

  render() {
    const listMenu: MenuType[] = [
      {
        text: "Home",
        path: "/admin",
        icon: <TiHomeOutline />,
      },
      {
        text: "Data Pelanggan",
        path: "/admin/pelanggan",
        icon: <TiGroupOutline />,
      },
      {
        text: "Data Pengaduan",
        path: "/admin/pengaduan",
        icon: <TiBook />,
      },
      {
        text: "Data Pembayaran",
        path: "/admin/pembayaran",
        icon: <TiTicket />,
      },
    ];

    return (
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 overflow-y-auto lg:w-72 w-80 bg-primary text-base-content">
          {listMenu.map((menu: MenuType, index) => (
            <li key={index}>
              <Link href={menu.path}>
                <a
                  className={
                    this.state.menuActive == menu.path ? "bg-green-100" : ""
                  }
                  onClick={() => {
                    this.handleChange(menu.path);
                  }}
                >
                  {menu.icon}
                  {menu.text}
                  {/* {menu.path == "/admin/pengaduan" && (
                    <span className="indicator-item badge badge-secondary motion-safe:animate-bounce">
                      +1
                    </span>
                  )} */}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default withRouter(Drawer);
