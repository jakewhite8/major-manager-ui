// functions used to help http requests and responses

import axios from 'axios';

const API_URL = 'http://localhost:8081/api/auth';

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
          sessionStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    sessionStorage.removeItem('user');
  }

  register(user) {
    return axios.post(`${API_URL}/signup`, {
      username: user.username,
      email: user.email,
      password: user.password,
    });
  }
}

export default new AuthService();
