<template>
  <div class="container">
    <PageTitle
      :title="`Total First Place Finishes`" />
    <div class="container">
      <div v-if="!errorMessage">
        <div v-for="(team) in this.teamArray"
          id="accordion"
          :key="team.team_name">
          <div class="card">
            <div class="card-header container" :id="'heading-'+team.team_name">
              <div
                data-toggle="collapse"
                :data-target="'#collapsing' + team.team_name.split(' ').join('')"
                aria-expanded="false"
                row="botton"
                :aria-controls="'collapsing' + team.team_name.split(' ').join('')"
                class="row">
                <div class="col-6">
                  {{ team.team_name }}
                </div>
                <div class="col-6 text-right">
                  {{ totalWinsObject[team.team_name] }}
                </div>
              </div>
            </div>
            <div
              :id="'collapsing' + team.team_name.split(' ').join('')"
              class="collapse"
              :aria-labelledby="'heading-'+team.team_name"
              data-parent="#accordion">
              <div class="card-body container">
                <ClickableRowTable
                  :rowData=team.tournaments
                  :headers=headers
                  :columns=columns
                  :onClickFunction=onClickFunction
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="alert-danger">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import TournamentService from '../services/tournament.service';
import ClickableRowTable from '../components/ClickableRowTable.vue';
import PageTitle from '../components/PageTitle.vue';

export default {
  name: 'LeagueLeaderboard',
  data() {
    return {
      errorMessage: '',
      teamArray: [],
      totalWinsObject: {},
      headers: null,
      columns: null,
    };
  },
  components: {
    ClickableRowTable,
    PageTitle,
  },
  mounted() {
    // Get Tournament Winners Data
    TournamentService.getLeagueLeaderboard().then(
      (response) => {
        this.errorMessage = '';
        this.teamArray = response.data.teamArray;
        this.totalWinsObject = response.data.tournamentWinCount;
        this.headers = ['Tournament'];
        this.columns = ['name'];
      }, (error) => {
        this.errorMessage = (error.response && error.response.data)
          || error.message
          || error.toString();
      },
    );
  },
  methods: {
    onClickFunction(id) {
      if (id) {
        this.$router.push(`/tournament/${id}/leaderboard`);
      }
    },
  },
};
</script>
