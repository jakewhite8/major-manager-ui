import axios from 'axios';
import authHeader from './auth-header';
import server from './serverURL';

const API_URL = `${server.URL}api/test/`;


/* eslint class-methods-use-this: [0, { "enforceForClassFields": false }] */
class UserService {
  getPublicContent() {
    return axios.get(`${API_URL}all`);
  }

  getUserPage() {
    return axios.get(`${API_URL}user`, { headers: authHeader() });
  }

  getModeratorPage() {
    return axios.get(`${API_URL}mod`, { headers: authHeader() });
  }

  getAdminPage() {
    return axios.get(`${API_URL}admin`, { headers: authHeader() });
  }

  updateUser(user) {
    return axios.put(`${server.URL}api/v1/update_user`, {
      team_name: user.team_name,
      email: user.email,
    }, { headers: authHeader() });
  }

  updatePlayerData(tournamentId, playerData) {
    return axios.post(`${server.URL}api/v1/upload_player_scores/${tournamentId}`,
      playerData, { headers: authHeader() });
  }

  addWinningTeamToTournament(tournamentId, userId) {
    return axios.post(`${server.URL}api/v1/add_winning_team`, {
      tournamentId,
      userId,
    }, { headers: authHeader() });
  }

  validateHuman(params) {
    return axios.post(`${server.URL}recaptcha/validate`, params);
  }
}

export default new UserService();
