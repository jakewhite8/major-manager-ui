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
      <div class="row leaderboardTitleRow">
        <div class="col-4 leaderboardTitleContainer">
          <h5 class="leaderboardTitleHeader">
            Leaderboard
          </h5>
        </div>
        <div class="col-4 text-center">
          <button
            type="button"
            class="btn btn-link btn-sm accordionClass"
            data-toggle="collapse"
            data-target=".multi-collapse"
            aria-expanded="false"
            v-on:click="toggleButtonIcon">
              <font-awesome-icon
                v-if="this.hiddenStatus"
                icon="eye"/>
              <font-awesome-icon
                v-if="!this.hiddenStatus"
                icon="eye-slash"/>
          </button>
        </div>
        <div class="col-4 text-right leaderboardTitleContainer">
          <h5 class="leaderboardTitleHeader alignHeaderRight">
            Round: {{ tournament.round }}
          </h5>
        </div>
      </div>
      <div>
        <div v-for="(team) in this.leaderboardArray"
          id="accordion"
          class="accordionClass" 
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
              class="collapse multi-collapse"
              :aria-labelledby="'heading-'+team[0].team_name"
              data-parent=".accordionClass"
              >
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
      hiddenStatus: true,
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
        // After the second round, display cut information
        if (this.tournament.round >= 3){
          this.headers = ['Players', 'Cut', 'Score'];
          this.columns = ['last_name', 'cut', 'score'];
        } else {
          this.headers = ['Players', 'Score'];
          this.columns = ['last_name', 'score'];
        }

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
  methods: {
    toggleButtonIcon() {
      this.hiddenStatus = !this.hiddenStatus;
    },
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
div.leaderboardTitleRow {
  margin: 10px 0; 
}
div.leaderboardTitleRow div.leaderboardTitleContainer {
  position: relative;
}
div.leaderboardTitleRow div.leaderboardTitleContainer h5.leaderboardTitleHeader {
  margin: 0;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
}

h5.leaderboardTitleHeader.alignHeaderRight {
  right: 15px;
}
</style>
