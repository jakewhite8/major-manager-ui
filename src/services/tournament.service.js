import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8081/api/v1';


/* eslint class-methods-use-this: ["error", { "exceptMethods":
['getActiveTournaments', 'getTournamentAndPlayerData',
'setTeam', 'getActiveTournamentsForAUser', 'getPastTournamentsForAUser'] }] */
class TournamentService {
  getActiveTournaments() {
    return axios.get(`${API_URL}/active_tournaments`);
  }

  // Get information regarding a Tournament and the Players in
  // it. A Users team if they have one will be returned here as well
  getTournamentAndPlayerData(id) {
    return axios.get(`${API_URL}/tournament_player_data/${id}`, { headers: authHeader() });
  }

  // A Users team for a particular Tournament is created or updated
  setTeam(selectedPlayers, tournamentId) {
    return axios.post(`${API_URL}/set_team`, {
      selectedPlayers, tournamentId,
    }, { headers: authHeader() });
  }

  // Returns Tournaments that a User is signed up for that have not occured yet
  getActiveTournamentsForAUser() {
    return axios.get(`${API_URL}/active_tournament_user_data`, { headers: authHeader() });
  }

  getPastTournamentsForAUser() {
    return axios.get(`${API_URL}/past_tournament_user_data`, { headers: authHeader() });
  }
}

export default new TournamentService();
