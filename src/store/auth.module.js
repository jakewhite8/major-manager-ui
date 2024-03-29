// create separate auth state store
import AuthService from '../services/auth.service';
import UserService from '../services/user.service';

const activeUser = JSON.parse(localStorage.getItem('user'));
const initialState = activeUser
  ? { status: { loggedIn: true }, user: activeUser }
  : { status: { loggedIn: false }, user: null };

const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    login({ commit }, user) {
      return AuthService.login(user).then((res) => {
        commit('loginSuccess', res);
        return Promise.resolve(res);
      }, (error) => {
        commit('loginFailure');
        return Promise.reject(error);
      });
    },
    logout({ commit }) {
      AuthService.logout();
      commit('logout');
    },
    register({ commit }, user) {
      return AuthService.register(user).then((response) => {
        commit('registerSuccess');
        return Promise.resolve(response.data);
      }, (error) => {
        commit('registerFailure');
        return Promise.reject(error);
      });
    },
    updateUserInfo({ commit }, user) {
      return UserService.updateUser(user).then((res) => {
        commit('updateSuccess', res.data);
        return Promise.resolve(res);
      }, (error) => Promise.reject(error));
    },
  },
  mutations: {
    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    registerSuccess(state) {
      state.status.loggedIn = false;
    },
    registerFailure(state) {
      state.status.loggedIn = false;
    },
    updateSuccess(state, user) {
      state.user.email = user.email;
      state.user.team_name = user.team_name;
    },
  },
};

export default auth;
