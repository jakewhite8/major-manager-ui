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
        />
      </div>
    </div>
    <div class="container leaderboard">
      <h5>
        Leaderboard
      </h5>
      <div>
        <div v-for="(team) in this.leaderboardArray"
          id="accordion"
          :key="team[0].team_name">
          <div class="card">
            <div class="card-header container" :id="'heading-'+team[0].team_name">
              <div
                data-toggle="collapse"
                :data-target="'#collapsing' + team[0].team_name.split(' ').join('')"
                aria-expanded="false"
                row="botton"
                :aria-controls="'collapsing' + team[0].team_name.split(' ').join('')"
                class="row">
                <div class="col-6">
                  {{ team[0].team_name }}
                </div>
                <div class="col-6 text-right">
                  {{ scores[team[0].team_name] }}
                </div>
              </div>
            </div>
            <div
              :id="'collapsing' + team[0].team_name.split(' ').join('')"
              class="collapse"
              :aria-labelledby="'heading-'+team[0].team_name"
              data-parent="#accordion">
              <div class="card-body container">
                <ClickableRowTable
                  :rowData=team
                  :headers=headers
                  :columns=columns
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
      tournament: new Tournament('', null, '', null),
      user: new User('', '', ''),
      currentUserTeam: [],
      leaderboardObject: {},
      leaderboardArray: [],
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
        this.tournament.name = response.data.tournament.name;
        this.tournament.round = response.data.tournament.round;
        // May be able to remove the leaderboardObject
        // in favor of the leaderboardArray
        this.leaderboardObject = response.data.leaderboard;
        this.scores = response.data.scoresByTeam;
        if (this.user && this.scores && this.scores.hasOwnProperty(this.user.team_name)) {
          this.currentUserTeam = this.leaderboardObject[this.user.team_name];
        }
        this.headers = ['Players', 'Cut', 'Score'];
        this.columns = ['last_name', 'cut', 'score'];

        // leaderboardArray is used to easily sort teams by score
        for (const team in this.leaderboardObject) {
          this.leaderboardArray.push(this.leaderboardObject[team]);
        }
        this.leaderboardArray.sort((a, b) => this.scores[a[0].team_name] - this.scores[b[0].team_name]);
      }, (error) => {
        this.message = (error.response && error.response.data)
          || error.message
          || error.toString();
      },
    );
  },
  computed: {
    teamName() {
      return this.user.team_name
        + (this.user.team_name.charAt(this.user.team_name.length - 1) === 's' ? '\'' : '\'s');
    },
  },
};
</script>
<style>
div.card-header:hover {
  cursor: pointer;
}
div.leaderboard {
  margin-bottom: 100px;
}
</style>
