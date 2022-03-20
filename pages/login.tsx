import { connect } from "react-redux";
import { loginAuth } from "@/store/auth/action";
import LoginForm from "@/components/LoginForm";
import { AuthState, State } from "@/types";

type LoginProps = {
  authState: AuthState;
  loginAuth: (username: string, password: string) => void;
};

const Login = (props: LoginProps) => {
  return (
    <LoginForm
      authState={props.authState}
      loginAuth={props.loginAuth}
    ></LoginForm>
  );
};

const mapStateToProps = (state: State) => ({
  authState: state.authState,
});

const mapActionsToProps = {
  loginAuth,
};

export default connect(mapStateToProps, mapActionsToProps)(Login);
