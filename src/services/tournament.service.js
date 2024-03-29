import axios from 'axios';
import authHeader from './auth-header';
import server from './serverURL';

const API_URL = `${server.URL}api/v1`;

/* eslint class-methods-use-this: [0, { "enforceForClassFields": false }] */
class TournamentService {
  // Return tournaments that have not started yet
  getUpcomingTournaments() {
    return axios.get(`${API_URL}/upcoming_tournaments`);
  }

  // Return tournaments that have not ended yet
  getActiveTournaments() {
    return axios.get(`${API_URL}/active_tournaments`);
  }

  // Return tournaments that have ended
  getConcludedTournaments() {
    return axios.get(`${API_URL}/concluded_tournaments`);
  }

  // Get information regarding a Tournament and the Players in
  // it. A Users team if they have one will be returned here as well.
  // Used to Edit and Create a Team
  // Takes the Tournament id as an argument
  getTournamentAndPlayerData(id) {
    return axios.get(`${API_URL}/tournament_player_data/${id}`, { headers: authHeader() });
  }

  // Get the User, Team, and Player data needed to display a leaderboard for a particular tournament
  getLeaderboardData(id) {
    return axios.get(`${API_URL}/tournament_leaderboard_data/${id}`, { headers: authHeader() });
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

  getPastTournamentsForAUser(id) {
    return axios.get(`${API_URL}/past_tournament_user_data/${id}`);
  }

  createTournament(tournament) {
    return axios.post(`${API_URL}/create_tournament`, tournament, { headers: authHeader() });
  }

  // Returns all the Teams that participated in a given Tournament
  getTeamsInATournament(id) {
    return axios.get(`${API_URL}/tournament_team_data/${id}`, { headers: authHeader() });
  }

  // Get an array of past Tournaments and the Team that one them
  getLeagueLeaderboard() {
    return axios.get(`${API_URL}/league_leaderboard`, { headers: authHeader() });
  }
}

export default new TournamentService();
