// functions used to help http requests and responses

import axios from 'axios';
import server from './serverURL';

const API_URL = `${server.URL}api/auth`;

/* eslint class-methods-use-this: ["error", { "exceptMethods": ['login', 'logout', 'register'] }] */
class AuthService {
  login(user) {
    return axios
      .post(`${API_URL}/signin`, {
        email: user.email,
        password: user.password,
      })
      .then((response) => {
        if (response.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(user) {
    return axios.post(`${API_URL}/signup`, {
      team_name: user.team_name,
      email: user.email,
      password: user.password,
    });
  }
}

export default new AuthService();
