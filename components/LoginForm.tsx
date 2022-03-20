import React, { ChangeEvent, FormEvent } from "react";
import Alert from "./Alert";
import { FaSignInAlt } from "react-icons/fa";
import { AuthState } from "types";
import Router from "next/router";

type LoginFormProps = {
  authState: AuthState;
  loginAuth: (username: string, password: string) => void;
};

class LoginForm extends React.Component<LoginFormProps> {
  state = {
    loading: false,
    username: "",
    password: "",
    response: {
      show: false,
      error: false,
      message: "",
    },
  };

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submitForm = async (e: FormEvent) => {
    e.preventDefault();
    this.setState({ loading: true });
    const { username, password } = this.state;
    try {
      await this.props.loginAuth(username, password);

      this.setState({ response: { show: true, ...this.props.authState } });

      setTimeout(() => {
        Router.replace("/admin");
      }, 2000);
    } catch (res: any) {
      this.setState({ response: { show: true, ...res } });
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <section className="h-screen">
        <div className="px-6 h-full text-gray-800">
          <div className="flex xl:justify-center lg:justify-between justify-center items-center flex-wrap h-full g-6">
            <div className="grow-0 shrink-1 md:shrink-0 basis-auto xl:w-6/12 lg:w-6/12 md:w-9/12 mb-12 md:mb-0">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                className="w-full"
                alt="Sample image"
              />
            </div>
            <div className="xl:ml-20 xl:w-5/12 lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
              {this.state.response.show && (
                <Alert
                  error={this.state.response.error}
                  message={this.state.response.message}
                />
              )}

              <form onSubmit={this.submitForm}>
                <div className="flex flex-row items-center justify-center lg:justify-start">
                  <p className="text-lg mb-0 mr-4">
                    Aplikasi Whatsapp Bot TV Kabel
                  </p>
                </div>

                <div className="flex items-center my-4 before:flex-1 before:border-t before:border-primary-300 before:mt-0.5 after:flex-1 after:border-t after:border-primary-300 after:mt-0.5"></div>

                <div className="mb-6">
                  <input
                    type="text"
                    className="form-control block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-primary-300 rounded transition ease-in-out m-0 focus:text-gray-500 focus:bg-white focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Username"
                    name="username"
                    onChange={this.handleChange}
                    required
                  />
                </div>

                <div className="mb-6">
                  <input
                    type="password"
                    className="form-control input input-bordered  block w-full px-4 py-2 text-xl font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-500 focus:bg-white focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Password"
                    name="password"
                    onChange={this.handleChange}
                    required
                  />
                </div>
                <div className="flex justify-between">
                  {this.state.loading ? (
                    <button className="btn btn-outline btn-primary loading">
                      loading
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={this.state.loading}
                      className="btn btn-outline btn-primary gap-2"
                    >
                      <div className="self-center inline flex-shrink-0 mr-3">
                        <FaSignInAlt />
                      </div>
                      <span>Login</span>
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default LoginForm;
