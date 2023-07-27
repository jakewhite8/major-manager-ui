<template>
  <div class="container">
    <PageTitle
      :title="`Championship Leaderboard`" />
    <div class="text-center">
      <ShowAllButton
        :showAllButtonFunction=onClickShowAllToggle
        :hiddenStatus=hiddenStatus />
    </div>
    <div class="container container-margin">
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
    <div class="row container-margin">
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
        // Array of users with: team_name, array of tournaments won and userId
        this.teamArray = response.data.teamArray;
        this.teamLeaderboardHeaders = ['Tournament'];
        this.teamLeaderboardColumns = ['name'];

        this.pastTournamentloading = true;
        TournamentService.getConcludedTournaments().then(
          (response) => {
            this.pastTournamentsMessage = '';
            // Array of each tournament with: name, id, start_date and round
            this.pastTournaments = response.data;
            this.pastTournamentsHeaders = ['Tournaments', 'Start Date', 'Winning Team'];
            this.pastTournamentsColumns = ['name', 'start_date', 'winning_team'];
            this.pastTournamentsLoading = false;
            // Iterate through Users object and add the Tournaments they have won to the tournament winner object 
            let tournamentWinnersObject = {}
            for (let i = 0; i < this.teamArray.length; i++) {
              let selectedTeam = this.teamArray[i];
              for (let t = 0; t < selectedTeam.tournaments.length; t++) {
                let selectedTournament = selectedTeam.tournaments[t]
                if (!tournamentWinnersObject[selectedTournament.name]) {
                  tournamentWinnersObject[selectedTournament.name] = []
                }
                tournamentWinnersObject[selectedTournament.name].push(selectedTeam.team_name)
              }
            }
            // Use the tournament winner object to add the winning Teams to each Tournament
            for (let x = 0; x < this.pastTournaments.length; x++) {
              this.pastTournaments[x]['winning_team'] = tournamentWinnersObject[this.pastTournaments[x].name]
            }
          },
          (error) => {
            this.pastTournamentsMessage = (error.response && error.response.data)
              || error.message
              || error.toString();
            this.pastTournamentsLoading = false;
          },
        );
      }, (error) => {
        this.teamErrorMessage = (error.response && error.response.data)
          || error.message
          || error.toString();
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
<style scoped>
  .container-margin {
    margin-bottom: 47px;
  }
</style>