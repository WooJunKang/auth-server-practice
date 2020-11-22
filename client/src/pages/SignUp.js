import React from "react";
import './CSS/form.css';
import axios from 'axios'

const SERVER_URL = 'http://localhost:3001'

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
      errMsg: ""
    };

    this.handleInput = this.handleInput.bind(this);
    this.userValidCheck = this.userValidCheck.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleSignUpErr = this.handleSignUpErr.bind(this);

  }

  handleInput(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  userValidCheck() {

    const { name, email, password, passwordConfirm } = this.state;

    if (!name || !email || !password || !passwordConfirm) {
      this.setState({ errMsg: "Incorrect email or password" })
      return false
    } else if (password !== passwordConfirm) {
      this.setState({ errMsg: "Please check your password" })
      return false
    } else {
      return true
    }
  }

  handleSignUpErr() {

    return (
      <div className="err-msg-container">
        <p>{this.state.errMsg}</p>
      </div>
    )
  }


  handleSignUp(e) {
    e.preventDefault()
    if (this.userValidCheck()) {
      axios
        .post(SERVER_URL + '/signup', {
          name: this.state.name,
          email: this.state.email,
          password: this.state.password
        })
        .then(res => {
          this.props.history.push('/login')
        })
        .catch(err => {
          if (err.response) {
            if (err.response.status === 409) {
              this.setState({ errMsg: err.response.data })
            }
          } else {
            console.log('Err Msg: ', err.message);
          }
        })
    }

  }

  render() {
    return (
      <div className="sign-up form-wrapper">
        {/* sign-up form */}
        <div className="sign-up form-container">
          <div className="sign-up form-title-container">
            <h1>Sign Up</h1>
          </div>
          {this.state.errMsg && (this.handleSignUpErr())}
          <form className="sign-up-form" autoComplete="off" onSubmit={this.handleSignUp} >
            <div className="sign-up form-group">
              <label type="name">Name:</label>
              <input type="name" id="name-input" name="name" value={this.state.name} onChange={this.handleInput} />
            </div>
            <div className="sign-up form-group">
              <label type="email">Email:</label>
              <input type="email" id="email-input" name="email" value={this.state.email} onChange={this.handleInput} />
            </div>
            <div className="sign-up form-group">
              <label type="password">Password:</label>
              <input type="password" id="password-input" name="password" value={this.state.password} onChange={this.handleInput} />
            </div>
            <div className="sign-up form-group">
              <label type="password">Password Confirm:</label>
              <input type="password" id="password-confirm-input" name="passwordConfirm" value={this.state.passwordConfirm} onChange={this.handleInput} />
            </div>
            <input type="submit" value="sign-up" id="sign-up-submit" />
          </form>
        </div>
      </div>
    )
  }
}

export default Signup;