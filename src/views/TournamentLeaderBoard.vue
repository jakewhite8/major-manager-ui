<template>
  <div class="container">
    <header class="jumbotron">
      <h3>{{ tournament.name }} Leaderboard</h3>
    </header>
    <div v-if="currentUserTeam.length" class="container">
      <div class="row">
        <div class="col-6">
          <h5>
            {{ teamName }} Team
          </h5>
        </div>
        <div class="col-6 text-right">
          <h5>
            Total Score: {{ this.scores[this.user.team_name] }}
          </h5>
        </div>
      </div>
      <div>
        <ClickableRowTable
          :rowData=currentUserTeam
          :headers=headers
          :columns=columns
          :onClickFunction=onClickFunction
        />
      </div>
    </div>
    <div class="container">
      <h5>
        Leaderboard
      </h5>
      <div>
        <div v-for="(playerArray, team_name ) in this.leaderboard"
          id="accordion"
          :key="team_name">
          <div class="card">
            <div class="card-header container" :id="'heading-'+team_name">
              <div
                data-toggle="collapse"
                :data-target="'#collapsing' + team_name.split(' ').join('')"
                aria-expanded="false"
                row="botton"
                :aria-controls="'collapsing' + team_name.split(' ').join('')"
                class="row">
                <div class="col-6">
                  {{ team_name }}
                </div>
                <div class="col-6 text-right">
                  {{ scores[team_name] }}
                </div>
              </div>
            </div>
            <div
              :id="'collapsing' + team_name.split(' ').join('')"
              class="collapse"
              :aria-labelledby="'heading-'+team_name"
              data-parent="#accordion">
              <div class="card-body container">
                <ClickableRowTable
                  :rowData=playerArray
                  :headers=headers
                  :columns=columns
                  :onClickFunction=onClickFunction
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="message != ''"
      class="alert alert-danger">
      {{ message }}
    </div>
  </div>
</template>

<script>
import ClickableRowTable from '../components/ClickableRowTable.vue';
import TournamentService from '../services/tournament.service';
import Tournament from '../models/tournament';
import User from '../models/user';

export default {
  name: 'TournamentLeaderBoard',
  data() {
    return {
      content: 'Leaderboard',
      tournament: new Tournament('', null),
      user: new User('', '', ''),
      currentUserTeam: [],
      leaderboard: {},
      message: '',
      scores: {},
      headers: null,
      columns: null,
    };
  },
  components: {
    ClickableRowTable,
  },
  mounted() {
    this.tournament.id = this.$route.params.id;
    if (this.$store.state.auth.user) {
      this.user = this.$store.state.auth.user;
    }

    TournamentService.getLeaderboardData(this.tournament.id).then(
      (response) => {
        this.tournament.name = response.data.tournamentName.name;
        this.leaderboard = response.data.leaderboard;
        this.scores = response.data.scoresByTeam;
        if (this.user && this.scores && this.scores[this.user.team_name]) {
          this.currentUserTeam = this.leaderboard[this.user.team_name];
        }
        this.headers = ['Players', 'Score'];
        this.columns = ['last_name', 'score'];
      }, (error) => {
        this.message = (error.response && error.response.data)
          || error.message
          || error.toString();
      },
    );
  },
  computed: {
    teamName() {
      return this.user.team_name + (this.user.team_name.charAt(this.user.team_name.length - 1) === 's' ? '\'' : '\'s');
    },
  },
  methods: {
    onClickFunction(id) {
      console.log(id);
    },
  },
};
</script>
<style>
div.card-header:hover {
  cursor: pointer;
}
</style>
