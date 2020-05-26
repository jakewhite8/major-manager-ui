import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8081/api/v1';


/* eslint class-methods-use-this: ["error", { "exceptMethods":
['getActiveTournaments', 'getTournamentAndPlayerData',
'setUsersTournamentPlayers', 'getActiveTournamentsForAUser'] }] */
class TournamentService {
  getActiveTournaments() {
    return axios.get(`${API_URL}/active_tournaments`);
  }

  getTournamentAndPlayerData(id) {
    return axios.get(`${API_URL}/tournament_player_data/${id}`);
  }

  setUsersTournamentPlayers(selectedPlayers, tournamentId) {
    return axios.post(`${API_URL}/set_team`, {
      selectedPlayers, tournamentId,
    }, { headers: authHeader() });
  }

  // Returns tournaments that a user is signed up for that have not occured yet
  getActiveTournamentsForAUser() {
    return axios.get(`${API_URL}/active_tournament_user_data`, { headers: authHeader() });
  }
}

export default new TournamentService();
