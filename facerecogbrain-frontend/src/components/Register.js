import React from "react";

class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
    };
  }

  onNameChange = (event) => {
    this.setState({ name: event.target.value });
  };

  onEmailChange = (event) => {
    this.setState({ email: event.target.value });
  };

  onPasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  onSubmitRegister = async () => {
    try {
      const apiCall = await fetch("http://localhost:3000/register", {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: this.state.name,
          email: this.state.email,
          password: this.state.password,
        }),
      });
      const response = await apiCall.json();

      if (response.statusCode === 200) {
        this.props.onRouteChange("home");
        this.props.loadUser(response.data); // Update user data after registration
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  render() {
    return (
      <div>
        <article className="br2 ba dark-gray b--black-40 shadow-3 mv4 w-100 w-50-m w-25-l mw10 center">
          <main className="pa4 black-80">
            <div className="measure center">
              <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                <legend className="f4 fw6 ph0 mh0">Register</legend>
                <div className="mt3">
                  <label className="db fw6 lh-copy f6" htmlFor="name">
                    Name
                  </label>
                  <input
                    onChange={this.onNameChange}
                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                    type="text"
                    name="name"
                    id="name"
                  />
                </div>
                <div className="mt3">
                  <label className="db fw6 lh-copy f6" htmlFor="email-address">
                    Email
                  </label>
                  <input
                    onChange={this.onEmailChange}
                    className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                    type="email"
                    name="email-address"
                    id="email-address"
                  />
                </div>
                <div className="mv3">
                  <label className="db fw6 lh-copy f6" htmlFor="password">
                    Enter Password
                  </label>
                  <input
                    onChange={this.onPasswordChange}
                    className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                    type="password"
                    name="password"
                    id="password"
                  />
                </div>
              </fieldset>
              <div className="">
                <input
                  onClick={this.onSubmitRegister}
                  className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                  type="submit"
                  value="Register"
                />
              </div>
            </div>
          </main>
        </article>
      </div>
    );
  }
}

export default Register;
