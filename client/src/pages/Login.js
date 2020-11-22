/*eslint-disable*/
import React from 'react';
import './CSS/form.css';
import axios from 'axios';

const SERVER_URL = 'http://localhost:3001'

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      errMsg: ""
    }

    this.handleInput = this.handleInput.bind(this);
    this.userValidCheck = this.userValidCheck.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLoginErr = this.handleLoginErr.bind(this);
  }

  handleInput(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  userValidCheck() {
    const { email, password } = this.state;
    if (!email || !password) {
      this.setState({ errMsg: "Incorrect email or password" })
      return false;
    } else {
      return true;
    }
  }

  handleLoginErr() {
    return (
      <div className="err-msg-container">
        <p>{this.state.errMsg}</p>
      </div>
    )
  }

  handleLogin(e) {
    e.preventDefault();

    if (this.userValidCheck()) {
      axios
        .post(SERVER_URL + "/login", {
          email: this.state.email,
          password: this.state.password
        })
        .then(res => {
          const { name, email, authToken } = res.data;
          sessionStorage.setItem('authToken', authToken)
          this.props.history.push('/');
        })
        .catch(err => {
          if (err.response) {
            if (err.response.status === 409) {
              this.setState({ errMsg: err.response.data })
            }
          } else {
            console.log("err msg: ", err.message);
          }
        })
    }
  }

  render() {
    return (
      <div className="login form-wrapper">
        {/* login form */}
        <div className="login form-container">
          <div className="login form-title-container">
            <h1>LOGIN</h1>
          </div>
          {this.state.errMsg && (this.handleLoginErr())}
          <form className="login-form" autoComplete="off" onSubmit={this.handleLogin}>
            <div className="login form-group">
              <label type="email">Email:</label>
              <input type="email" id="email-input" name="email" value={this.state.email} onChange={this.handleInput} />
            </div>
            <div className="login form-group">
              <label type="password">Password:</label>
              <input type="password" id="password-input" name="password" value={this.state.password} onChange={this.handleInput} />
            </div>
            <input type="submit" value="Login" id="login-submit" />
          </form>
        </div>
      </div>
    )
  }
}

export default Login;