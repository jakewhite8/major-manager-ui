import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8081/api/v1/';


/* eslint class-methods-use-this: ["error", { "exceptMethods":
['getActiveTournaments'] }] */
class TournamentService {
  getActiveTournaments() {
    return axios.get(`${API_URL}active_tournaments`, { headers: authHeader() });
  }
}

export default new TournamentService();
