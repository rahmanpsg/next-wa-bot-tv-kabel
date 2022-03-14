import React from "react";
import { loginPost } from "lib/auth";
import { Alert } from "./Alert";
import { FaSignInAlt, FaSpinner } from "react-icons/fa";

class LoginForm extends React.Component {
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

  handleChange = (e: { target: HTMLInputElement }) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  submitForm = async (e: any) => {
    e.preventDefault();
    this.setState({ loading: true });
    const { username, password } = this.state;
    try {
      const res = await loginPost(username, password);
      console.log(res);
      this.setState({ response: { show: true, ...res } });
    } catch (res: any) {
      console.log(res);
      this.setState({ response: { show: true, ...res } });
      this.setState({ loading: false });
    }
  };

  render() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 ">
        <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg w-96">
          {this.state.response.show && (
            <Alert
              error={this.state.response.error}
              message={this.state.response.message}
            />
          )}
          <h3 className="text-2xl font-bold text-center">Login</h3>
          <form onSubmit={this.submitForm}>
            <div className="mt-4">
              <label className="block">Username</label>
              <input
                name="username"
                type="text"
                placeholder="Username"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary-900"
                required
                onChange={this.handleChange}
              ></input>
            </div>
            <div className="mt-4">
              <label className="block">Password</label>
              <input
                name="password"
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary-900"
                required
                onChange={this.handleChange}
              ></input>
            </div>
            <div className="flex justify-between">
              <button className="inline-flex items-center px-6 py-2 mt-4  text-white transition-colors duration-150 bg-primary-900 rounded-lg hover:bg-primary-500">
                <div
                  className={`self-center inline flex-shrink-0 mr-3 ${
                    this.state.loading && "animate-spin"
                  }`}
                >
                  {this.state.loading ? <FaSpinner /> : <FaSignInAlt />}
                </div>
                <span>Login</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default LoginForm;
