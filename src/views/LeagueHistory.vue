<template>
  <div class="container">
    <PageTitle
      :title="`First Place Finishes`" />
    <div class="text-center">
      <ShowAllButton
        :showAllButtonFunction=onClickShowAllToggle
        :hiddenStatus=hiddenStatus />
    </div>
    <div class="container" style="margin-bottom: 47px;">
      <div v-if="!teamErrorMessage">
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
                  {{ team.tournaments.length }}
                </div>
              </div>
            </div>
            <div
              :id="'collapsing' + team.team_name.split(' ').join('')"
              class="collapse"
              :class="showAll"
              :aria-labelledby="'heading-'+team.team_name"
              data-parent="#accordion">
              <div class="card-body container">
                <ClickableRowTable
                  :rowData=team.tournaments
                  :headers=teamLeaderboardHeaders
                  :columns=teamLeaderboardColumns
                  :onClickFunction=navigateToLeaderboard
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="alert-danger">
        {{ teamErrorMessage }}
      </div>
    </div>
    <PageTitle
      :title="`League Tournament History`" />
    <div class="row" style="margin-bottom: 47px;">
      <PastTournamentsTable
        :tournaments=pastTournaments
        :loading=pastTournamentsLoading
        :headers=pastTournamentsHeaders
        :columns=pastTournamentsColumns
        :message=pastTournamentsMessage />
    </div>
  </div>
</template>

<script>
import TournamentService from '../services/tournament.service';
import ClickableRowTable from '../components/ClickableRowTable.vue';
import PageTitle from '../components/PageTitle.vue';
import ShowAllButton from '../components/ShowAllButton.vue';
import PastTournamentsTable from '../components/PastTournamentsTable.vue';

export default {
  name: 'LeagueHistory',
  data() {
    return {
      teamErrorMessage: '',
      teamArray: [],
      teamLeaderboardHeaders: null,
      teamLeaderboardColumns: null,
      showAll: false,
      hiddenStatus: true,
      pastTournamentsLoading: false,
      pastTournaments: [],
      pastTournamentsHeaders: [],
      pastTournamentsColumns: [],
      pastTournamentsMessage: '',
    };
  },
  components: {
    ClickableRowTable,
    PageTitle,
    ShowAllButton,
    PastTournamentsTable,
  },
  mounted() {
    // Get Tournament Winners Data
    TournamentService.getLeagueLeaderboard().then(
      (response) => {
        this.teamErrorMessage = '';
        this.teamArray = response.data.teamArray;
        this.teamLeaderboardHeaders = ['Tournament'];
        this.teamLeaderboardColumns = ['name'];
      }, (error) => {
        this.teamErrorMessage = (error.response && error.response.data)
          || error.message
          || error.toString();
      },
    );
    this.pastTournamentloading = true;
    TournamentService.getConcludedTournaments().then(
      (response) => {
        this.pastTournamentsMessage = '';
        this.pastTournaments = response.data;
        this.pastTournamentsHeaders = ['Tournaments', 'Start Date'];
        this.pastTournamentsColumns = ['name', 'start_date'];
        this.pastTournamentsLoading = false;
      },
      (error) => {
        this.pastTournamentsMessage = (error.response && error.response.data)
          || error.message
          || error.toString();
        this.pastTournamentsLoading = false;
      },
    );
  },
  methods: {
    navigateToLeaderboard(id) {
      if (id) {
        this.$router.push(`/tournament/${id}/leaderboard`);
      }
    },
    onClickShowAllToggle(){
      this.hiddenStatus = !this.hiddenStatus;
      this.showAll = this.hiddenStatus ? '' : 'show';
    },
  },
};
</script>
