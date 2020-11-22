import Axios from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';
import './CSS/Main.css';
import axios from 'axios';
const SERVER_URL = 'http://localhost:3001'

class Main extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      name: "",
      email: "",
    }
    this.getUserInfo = this.getUserInfo.bind(this);
  }

  componentDidMount() {
    this.getUserInfo();
  }

  getUserInfo() {
    axios
      .get(SERVER_URL + '/userinfo', {
        headers: {
          'Auth-Token': sessionStorage.getItem('authToken')
        }
      })
      .then(res => {
        const { name, email } = res.data;
        this.setState({ name: name, email: email });
      })
      .catch(err => {
        console.log(err);
      })
  }

  render() {
    return (
      <div className="main-wrapper">
        <div className="main-text-container">
          <h1 className="intro-title-1">Welcome</h1>
          <h2 className="intro-title-2">Your Name: {this.state.name ? this.state.name : "GUEST"}</h2>
        </div>
        <div className="router-container">
          <Link className="main-list-link" to="/login">
            <span>Login</span>
          </Link>
          <Link className="main-list-link" to="/signup">
            <span>SignUp</span>
          </Link>
        </div>

      </div >
    );
  }
}

export default Main;