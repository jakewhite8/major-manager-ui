import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8081/api/v1';


/* eslint class-methods-use-this: ["error", { "exceptMethods":
['getActiveTournaments', 'getTournamentAndPlayerData', 'setUsersTournamentPlayers'] }] */
class TournamentService {
  getActiveTournaments() {
    return axios.get(`${API_URL}/active_tournaments`, { headers: authHeader() });
  }

  getTournamentAndPlayerData(id) {
    return axios.get(`${API_URL}/tournament_player_data/${id}`, { headers: authHeader() });
  }

  setUsersTournamentPlayers(selectedPlayers, userId, tournamentId) {
    return axios.post(`${API_URL}/set_team`, {
      selectedPlayers, userId, tournamentId,
    }, { headers: authHeader() });
  }
}

export default new TournamentService();
