import AuthService from "@/services/auth";
import Router from "next/router";
import { GrLogout } from "react-icons/gr";
import { TiThLargeOutline } from "react-icons/ti";

const Header = () => {
  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.log(error);
    }
    Router.replace("/");
  };

  return (
    <div className="navbar bg-primary">
      <div className="flex-none">
        <label
          htmlFor="my-drawer"
          className="btn btn-ghost drawer-button swap swap-rotate"
        >
          <input type="checkbox" />

          <TiThLargeOutline size={18} />
        </label>
      </div>
      <div className="flex-1">
        <a className="normal-case text-xl">Whatsapp Bot - TV Kabel</a>
      </div>
      <div className="flex-none">
        <button className="btn btn-ghost" onClick={logout}>
          <div className="self-center inline flex-shrink-0">
            <GrLogout size={18} />
          </div>
        </button>
      </div>
    </div>
  );
};

export default Header;
