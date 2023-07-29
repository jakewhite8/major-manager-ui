<template>
  <div class="container">
    <PageTitle
      :title="`Champions Leaderboard`" />
    <div class="text-center">
      <ShowAllButton
        :showAllButtonFunction=onClickShowAllToggle
        :hiddenStatus=hiddenStatus />
    </div>
    <div class="container container-margin">
      <div v-if="!userErrorMessage">
        <div v-for="(team) in this.userArray"
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
                  :headers=userLeaderboardHeaders
                  :columns=userLeaderboardColumns
                  :onClickFunction=navigateToLeaderboard
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="alert alert-danger">
        {{ userErrorMessage }}
      </div>
    </div>
    <PageTitle
      :title="`Tournament History`" />
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
      userErrorMessage: '',
      userArray: [],
      userLeaderboardHeaders: null,
      userLeaderboardColumns: null,
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
    this.pastTournamentsLoading = true;
    // Get Tournament winners (User) data
    const getLeagueLeaderboard = TournamentService.getLeagueLeaderboard().catch((error) => {
      this.userErrorMessage = error.message;
    });
    // Get past Tournaments
    const getConcludedTournaments = TournamentService.getConcludedTournaments().catch((error) => {
      this.pastTournamentsMessage = error.message;
      this.pastTournamentsLoading = false;
    });

    Promise.allSettled([getLeagueLeaderboard, getConcludedTournaments]).then((response)=> {
      const getLeagueLeaderboardSuccess = response[0].value && response[0].value.data;
      const getConcludedTournamentsSuccess = response[1].value && response[1].value.data;
      if (getLeagueLeaderboardSuccess) {
        // userArray - Array of users with: team_name, array of tournaments won and userId
        this.userArray = response[0].value.data.teamArray;
        this.userLeaderboardHeaders = ['Tournament'];
        this.userLeaderboardColumns = ['name'];
        this.userErrorMessage = '';
      }
      if (getConcludedTournamentsSuccess) {
        // pastTournaments - Array of each tournament with: name, id, start_date and round
        this.pastTournaments = response[1].value.data;
        this.pastTournamentsHeaders = ['Tournaments', 'Start Date'];
        this.pastTournamentsColumns = ['name', 'start_date'];
        this.pastTournamentsMessage = '';
      }
      // If the User and the Tournament data resolved succesfully, connect the winning Users with
      // the Tournaments they won (for the Tournament History table)
      if (getLeagueLeaderboardSuccess && getConcludedTournamentsSuccess) {
        // Add column to Tournament History table
        this.pastTournamentsHeaders.push('Winning Team');
        this.pastTournamentsColumns.push('winning_team');
        // Iterate through Users object and add the Tournaments they have
        // won to the tournamentWinnersObject
        let tournamentWinnersObject = {}
        for (let i = 0; i < this.userArray.length; i++) {
          let selectedTeam = this.userArray[i];
          for (let t = 0; t < selectedTeam.tournaments.length; t++) {
            let selectedTournament = selectedTeam.tournaments[t]
            if (!tournamentWinnersObject[selectedTournament.name]) {
              tournamentWinnersObject[selectedTournament.name] = []
            }
            tournamentWinnersObject[selectedTournament.name].push(selectedTeam.team_name)
          }
        }
        // Use the tournamentWinnersObject to add the winning Users to each Tournament
        for (let x = 0; x < this.pastTournaments.length; x++) {
          this.pastTournaments[x]['winning_team'] = tournamentWinnersObject[this.pastTournaments[x].name]
        }
      }
      this.pastTournamentsLoading = false;
    }).catch((error) => {
      console.error(error)
    })

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