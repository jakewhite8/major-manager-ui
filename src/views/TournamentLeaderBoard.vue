<template>
  <div class="container">
    <header class="jumbotron">
      <h3>{{ tournament.name }} Leaderboard</h3>
      <div v-if="loggedIn">
        <h3 >{{ user.team_name }} Leaderboard</h3>
      </div>
    </header>
    <div v-if="loggedIn">
      <p>
        {{ this.user.team_name }}'s Team
      </p>
      <p>
        {{ this.currentUserTeam }}
      </p>
    </div>
    <div>
      <p>
        Leaderboard
      </p>
      <p>
        {{ this.leaderboard }}
      </p>
    </div>
    <div
      v-if="message != ''"
      class="alert alert-danger">
      {{ message }}
    </div>
  </div>
</template>

<script>
import TournamentService from '../services/tournament.service';
import Tournament from '../models/tournament';
import User from '../models/user';

export default {
  name: 'Home',
  data() {
    return {
      content: 'Leaderboard',
      tournament: new Tournament('', null),
      user: new User('', '', ''),
      currentUserTeam: [],
      loggedIn: false,
      leaderboard: {},
      message: '',
    };
  },
  mounted() {
    this.tournament.id = this.$route.params.id;
    if (this.$store.state.auth.user) {
      this.user = this.$store.state.auth.user;
      this.loggedIn = true;
    }

    TournamentService.getLeaderboardData(this.tournament.id).then(
      (response) => {
        this.tournament.name = response.data.tournamentName.name;
        this.leaderboard = response.data.leaderboard;
        if (this.loggedIn) {
          this.currentUserTeam = this.leaderboard[this.user.team_name];
        }
      }, (error) => {
        this.message = (error.response && error.response.data)
          || error.message
          || error.toString();
      },
    );
  },
};
</script>
