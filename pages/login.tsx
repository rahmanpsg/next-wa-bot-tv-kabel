import { useEffect } from "react";
import { connect } from "react-redux";
import { loginAuth } from "../store/auth/action";
import LoginForm from "../components/LoginForm";
import Router from "next/router";

const Login = (props: any) => {
  // useEffect(() => {
  //   if (!props.authenticated) {
  //     Router.replace("/login");
  //   }
  // }, [props]);

  return <LoginForm auth={props.auth} loginAuth={props.loginAuth}></LoginForm>;
};

const mapStateToProps = (state: any) => ({
  auth: state.auth,
});

const mapActionsToProps = {
  loginAuth,
};

export default connect(mapStateToProps, mapActionsToProps)(Login);
