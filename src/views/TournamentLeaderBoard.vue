<template>
  <div class="container">
    <PageTitle
      :customField=tournament.name
      :title="`Leaderboard`" />
    <div v-if="currentUserTeam.length" class="container">
      <div class="row">
        <div class="col-6">
          <h5>
            {{ teamName }} Team
          </h5>
        </div>
        <div class="col-6 text-right">
          <h5>
            Total Score: {{ this.scores[this.user.team_name].score }}
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
            aria-expanded="false"
            v-on:click="showAllButton">
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
          :key="team[0].userId">
          <div class="card">
            <div class="card-header container card-border" :id="'heading-'+team[0].userId">
              <div
                data-toggle="collapse"
                :data-target="'#collapsing' + team[0].userId"
                aria-expanded="false"
                row="botton"
                :aria-controls="'collapsing' + team[0].userId"
                class="row align-items-center">
                <div class="col-9">
                  <div class="row mobile-row-height align-items-center">
                    <span
                      v-if="tournament.round > 0"
                      class="col-4 col-sm-3 col-md-2 col-lg-2 col-xl-1 text-right
                         ">
                      {{ scores[team[0].team_name].position }}
                    </span>
                    <span
                      class="col-8 col-sm-9 col-md-10 col-lg-10 col-xl-11  align-items-center-team-name"
                      :class="teamNameDivider">
                      {{ team[0].team_name }}
                    </span>
                  </div>
                </div>
                <div class="col-3 text-right">
                  {{ scores[team[0].team_name].score }}
                </div>
              </div>
            </div>
            <div
              :id="'collapsing' + team[0].userId"
              class="collapse multi-collapse dropdown-styles"
              :class="showAll"
              :aria-labelledby="'heading-'+team[0].userId"
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
import PageTitle from '../components/PageTitle.vue';
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
      showAll: false,
      teamNameDivider: 'team-name-divider-solid',
    };
  },
  components: {
    ClickableRowTable,
    PageTitle,
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
        this.leaderboardArray = response.data.leaderboardArray;
        this.scores = response.data.scoresByTeam;
        if (this.user && this.user.team_name && this.scores && this.scores[this.user.team_name]) {
          this.currentUserTeam = this.leaderboardObject[this.user.team_name];
        }
        // After the second round, display cut information
        if (this.tournament.round >= 2) {
          this.headers = ['Players', 'Cut', 'Score'];
          this.columns = ['last_name', 'cut', 'score'];
        } else {
          this.headers = ['Players', 'Score'];
          this.columns = ['last_name', 'score'];
        }
        this.teamNameDivider = 
          this.tournament.round > 0 ? 'team-name-divider-solid' : 'team-name-divider-none';
      }, (error) => {
        this.message = (error.response && error.response.data)
          || error.message
          || error.toString();
      },
    );
  },
  methods: {
    showAllButton() {
      this.hiddenStatus = !this.hiddenStatus;
      this.showAll = this.hiddenStatus ? '' : 'show';
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
<style scoped>
div.dropdown-styles {
  background-color: rgb(0, 0, 0, 0.03);
}
div.card-header:hover {
  cursor: pointer;
}
div.card-border {
  padding-top: 0;
  padding-bottom: 0;
  border-bottom: none;
}
span.team-name-divider-solid {
  border-left: solid rgba(0, 0, 0, 0.125);
}
span.team-name-divider-none {
  border-left: none;
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

@media (max-width: 600px) {
  .mobile-row-height {
    height: 70px
  }
  .align-items-center {
    align-items: center;
  }
  .align-items-center-team-name {
    display: flex;
    height: 100%;
    align-items: center;
  }
}
/*make these max-width:600*/
</style>
