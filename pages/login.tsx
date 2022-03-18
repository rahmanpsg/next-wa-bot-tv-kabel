import { connect } from "react-redux";
import { loginAuth } from "../store/auth/action";
import LoginForm from "../components/LoginForm";

const Login = (props: any) => {
  return <LoginForm auth={props.auth} loginAuth={props.loginAuth}></LoginForm>;
};

const mapStateToProps = (state: any) => ({
  auth: state.auth,
});

const mapActionsToProps = {
  loginAuth,
};

export default connect(mapStateToProps, mapActionsToProps)(Login);
