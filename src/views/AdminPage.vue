<template>
  <div class="container">
    <PageTitle
      :title=content />
    <div class="card overflow-hidden">
      <div class="row no-gutters row-bordered row-border-light">
        <div class="col-md-3 pt-0">
          <div class="list-group list-group-flush account-settings-links settings-sidebar">
            <a class="list-group-item list-group-item-action active"
                data-toggle="list"
                href="#create-tournament">
              Create Tournament
            </a>
            <a class="list-group-item list-group-item-action"
                data-toggle="list"
                href="#add-players">
              Add Players
            </a>
            <a class="list-group-item list-group-item-action"
                data-toggle="list"
                href="#add-winner">
              Add Winning Team
            </a>
            <a class="list-group-item list-group-item-action"
                data-toggle="list"
                href="#reset-password">
              Reset Password
            </a>
          </div>
        </div>
        <div class="col-md-9">
          <div class="tab-content">
            <div class="tab-pane fade active show" id="create-tournament">
              <hr class="border-light m-0">
              <div class="card-body">
                <div class="form-group">
                  <label class="form-label" for="tournament_name">Tournament Name</label>
                  <input
                    v-model="newTournament.name"
                    type="text"
                    @change="checkForCreateTournamentErrors()"
                    class="form-control"
                    name="tournament_name">
                  <div v-if="submitted && tournamentNameError"
                        class="alert-danger alert-admin-page">
                    Name is required and needs to be between 3 and 40 characters
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label" for="tournament_date">Tournament Date</label>
                  <input
                    v-model="newTournament.start_date"
                    type="datetime-local"
                    @change="checkForCreateTournamentErrors()"
                    class="form-control"
                    name="tournament_date">
                  <div v-if="submitted && tournamentDateError"
                        class="alert-danger alert-admin-page">
                    Date is required
                  </div>
                </div>
                <div>
                  <button
                    type="button"
                    :disabled="loadingCreateTournament"
                    v-on:click="createTournament()"
                    class="btn btn-primary-dark-blue">
                    <span>Create Tournament</span>
                    <span v-show="loadingCreateTournament"
                        class="spinner-border spinner-border-sm">
                    </span>
                  </button>
                  <div
                    v-if="message"
                    :class="successful ? 'alert-success' : 'alert-danger'"
                    class="alert-admin-page">
                    {{this.message}}
                  </div>
                </div>
              </div>
            </div>
            <div class="tab-pane fade" id="add-players">
              <hr class="border-light m-0">
              <div class="card-body">
                <div class="form-group">
                  <div class="row tournament-select-row">
                    <div class="col-6">
                      <label class="form-label" for="select_tournament">Select Tournament</label>
                    </div>
                    <div class="col-6 text-right">
                      <button
                        type="button"
                        :disabled="loadingPlayerData"
                        v-on:click="updatePlayerData()"
                        class="btn btn-primary-dark-blue">
                        <span>Add Data</span>
                        <span v-show="loadingPlayerData" class="spinner-border spinner-border-sm">
                        </span>
                      </button>
                    </div>
                  </div>
                  <v-select
                    name="select_tournament"
                    :options="options"
                    label="name"
                    @input="checkForPlayerDataErrors"
                    v-model="selectedTournament"
                    ></v-select>
                    <div class="row select-tournament-error-style">
                      <div v-if="playerTournamentNameSectionError"
                            class="col-12 alert-danger alert-admin-page">
                        Select a Tournament
                      </div>
                    </div>
                </div>
                <div class="form-group">
                  <div class="row tournament-select-row">
                    <div class="col-6">
                      <label class="form-label" for="select_round">Round</label>
                    </div>
                    <div v-if="roundSectionError"
                        class="col-6 alert-danger alert-player-data-section">
                      Round data cannot be empty
                    </div>
                  </div>
                  <v-select
                    name="select_round"
                    :options="['0',1,2,3,4]"
                    label="select_round"
                    @input="checkForPlayerDataErrors"
                    v-model="selectedRound"
                    ></v-select>
                </div>
                <div class="form-group">
                  <div class="row">
                    <div class="col-6">
                      <label class="form-label" for="player_data">Player data</label>
                    </div>
                    <div class="col-6 text-right">
                      <div
                        v-if="playerDataMessage"
                        :class="playerDataSuccessful ? 'alert-success' : 'alert-danger'"
                        class="alert-player-data-section">
                        {{this.playerDataMessage}}
                      </div>
                      <div v-if="playerDataSectionError"
                            class="alert-danger alert-player-data-section">
                        Player data cannot be empty
                      </div>
                    </div>
                  </div>
                  <!-- eslint-disable max-len -->
                  <textarea
                    v-model="playerData"
                    class="form-control"
                    rows="150"
                    placeholder="Entries should be a JSON object for each player, seperated / by a comma, with the fields: 'first_name', 'last_name', 'score', 'tier' (optional), and 'position' (optional). No comma after the last player. "
                    @change="checkForPlayerDataErrors()"
                    name="player_data">
                  </textarea>
                  <!-- eslint-enable max-len -->
                </div>
              </div>
            </div>
            <div class="tab-pane fade" id="add-winner">
              <hr class="border-light m-0">
              <div class="card-body">
                <div class="form-group">
                  <div class="row tournament-select-row">
                    <div class="col-6">
                      <label class="form-label" for="select_winner_tournament">
                        Select Tournament
                      </label>
                    </div>
                    <div class="col-6 text-right">
                      <div
                        v-if="concludedTournamentMessage"
                        :class="!concludedTournamentMessage ? 'alert-success' : 'alert-danger'"
                        class="alert-player-data-section">
                        {{this.concludedTournamentMessage}}
                      </div>
                      <div v-if="playerDataSectionError"
                          class="alert-danger alert-player-data-section">
                        Player data cannot be empty
                      </div>
                    </div>
                  </div>
                  <v-select
                    name="select_winner_tournament"
                    :options="arrayOfConcludedTournaments"
                    label="name"
                    @input="addWinningTeamTournamentSelectOnChange"
                    v-model="selectedAddWinnerTournament"
                    >
                  </v-select>
                  <div class="row select-tournament-error-style">
                    <div v-if="winningTournamentSelectionError"
                          class="col-12 alert-danger alert-admin-page">
                      {{this.winningTournamentSelectionErrorMessage}}
                    </div>
                  </div>
                </div>
                <div v-if="selectedAddWinnerTournament">
                  <div class="form-group">
                    <div class="row tournament-select-row">
                      <div class="col-6">
                        <label class="form-label" for="select_winner_team">Select Team</label>
                      </div>
                    </div>
                    <v-select
                      name="select_winner_team"
                      :options="arrayOfTeamsInATournament"
                      label="team_name"
                      @input="addWinningTeamSelectOnChange"
                      v-model="selectedAddWinnerTeam"
                      >
                    </v-select>
                    <div class="row select-tournament-error-style">
                      <div v-if="winningTeamSelectionError"
                            class="col-12 alert-danger alert-admin-page">
                        {{this.winningTeamSelectionErrorMessage}}
                      </div>
                    </div>
                  </div>
                  <div>
                    <button
                      type="button"
                      :disabled="loadingAddWinningTeam"
                      v-on:click="addWinningTeam()"
                      class="btn btn-primary-dark-blue">
                      <span>Add Winning Team</span>
                      <span v-show="loadingAddWinningTeam"
                          class="spinner-border spinner-border-sm">
                      </span>
                    </button>
                    <div
                      v-if="messageWinningTeam"
                      :class="successfulWinningTeam ? 'alert-success' : 'alert-danger'"
                      class="alert-admin-page">
                      {{this.messageWinningTeam}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="tab-pane fade" id="reset-password">
              <hr class="border-light m-0">
              <div class="card-body">
                <div class="form-group">
                  <label class="form-label" for="user_email">User Email</label>
                  <input
                    v-model="changeUserPassword.email"
                    type="text"
                    class="form-control"
                    name="user_email">
                </div>
                <div class="form-group">
                  <label class="form-label" for="new_password">New Password</label>
                  <input
                    v-model="changeUserPassword.password"
                    type="text"
                    class="form-control"
                    name="new_password">
                </div>
                <div>
                  <button
                    type="button"
                    :disabled="loadingUpdatePassword"
                    v-on:click="updatePassword()"
                    class="btn btn-primary-dark-blue">
                    <span>Update Password</span>
                    <span v-show="loadingUpdatePassword"
                        class="spinner-border spinner-border-sm">
                    </span>
                  </button>
                  <div
                    v-if="messageUpdatePassword"
                    :class="successfulUpdatePassword ? 'alert-success' : 'alert-danger'"
                    class="alert-admin-page">
                    {{this.messageUpdatePassword}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from '../components/PageTitle.vue';
import UserService from '../services/user.service';
import TournamentService from '../services/tournament.service';
import Tournament from '../models/tournament';
import User from '../models/user';
import 'vue-select/dist/vue-select.css';

export default {
  name: 'Admin',
  data() {
    return {
      content: '',
      newTournament: new Tournament('', null, '', null),
      changeUserPassword: new User(null, null, null),
      tournamentNameError: false,
      tournamentDateError: false,
      submitted: false,
      successful: false,
      message: '',
      successfulWinningTeam: false,
      successfulUpdatePassword: false,
      messageWinningTeam: '',
      messageUpdatePassword: '',
      playerDataMessage: '',
      concludedTournamentMessage: '',
      loadingCreateTournament: false,
      loadingPlayerData: false,
      loadingAddWinningTeam: false,
      loadingUpdatePassword: false,
      playerData: '',
      options: [],
      arrayOfConcludedTournaments: [],
      arrayOfTeamsInATournament: [],
      selectedTournament: null,
      selectedRound: null,
      roundSectionError: false,
      selectedAddWinnerTournament: null,
      selectedAddWinnerTeam: null,
      playerTournamentNameSectionError: false,
      winningTeamSelectionError: false,
      winningTournamentSelectionError: false,
      winningTeamSelectionErrorMessage: '',
      winningTournamentSelectionErrorMessage: '',
      playerDataSectionError: false,
      playerDataSuccessful: false,
      submittedPlayerData: false,
    };
  },
  components: {
    PageTitle,
  },
  mounted() {
    UserService.getAdminPage().then(
      (response) => {
        this.content = response.data;
      },
      (error) => {
        this.content = (error.response && error.response.data)
          || error.message
          || error.toString();
      },
    );
    TournamentService.getActiveTournaments().then(
      (response) => {
        this.options = response.data;
      },
      (error) => {
        this.playerDataMessage = (error.response && error.response.data)
          || error.message
          || error.toString();
      },
    );
    TournamentService.getConcludedTournaments().then(
      (response) => {
        this.arrayOfConcludedTournaments = response.data;
      },
      (error) => {
        this.concludedTournamentMessage = (error.response && error.response.data)
          || error.message
          || error.toString();
      },
    );
  },
  methods: {
    checkForCreateTournamentErrors() {
      // Remove error or success message
      this.successful = false;
      this.message = '';
      if (this.newTournament.name.length < 3 || this.newTournament.name.length > 40) {
        this.tournamentNameError = true;
      } else {
        this.tournamentNameError = false;
      }
      const dateTimeRegex = RegExp('[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}');
      if (dateTimeRegex.test(this.newTournament.start_date)) {
        this.tournamentDateError = false;
      } else {
        this.tournamentDateError = true;
      }
    },
    createTournament() {
      this.loadingCreateTournament = true;
      this.submitted = true;
      this.checkForCreateTournamentErrors();

      if (!this.tournamentNameError && !this.tournamentDateError) {
        TournamentService.createTournament(this.newTournament).then(() => {
          this.newTournament = new Tournament('', null, '', null);
          this.message = 'Tournament Created';
          this.successful = true;
          this.submitted = false;
          this.loadingCreateTournament = false;
        }, (error) => {
          this.message = typeof error.message === 'string' ? error.message : 'Error Creating Team';
          this.successful = false;
          this.loadingCreateTournament = false;
        });
      }
      this.loadingCreateTournament = false;
    },
    checkForPlayerDataErrors() {
      // Remove error or success message
      this.playerDataMessage = '';
      // Make sure error messages are not being displayed
      // before the submit buttons has been selected
      if (this.submittedPlayerData) {
        if (!this.selectedTournament) {
          this.playerTournamentNameSectionError = true;
        } else {
          this.playerTournamentNameSectionError = false;
        }
        if (!this.playerData) {
          this.playerDataSectionError = true;
        } else {
          this.playerDataSectionError = false;
        }
        if (!this.selectedRound) {
          this.roundSectionError = true;
        } else {
          this.roundSectionError = false;
        }
      }
    },
    updatePlayerData() {
      this.submittedPlayerData = true;
      this.checkForPlayerDataErrors();
      this.loadingPlayerData = true;
      if (this.playerData && this.selectedTournament && this.selectedRound) {
        // create playerData JSON object needed by the server to update a Player's Data
        // {
        //   "playerData": [{
        //     "first_name": "Dustin",
        //     "last_name": "Johnson",
        //     "score": -4,
        //     "postion": 2,
        //     "tier": 2,
        //   },
        //   {
        //     "first_name": "Justin",
        //     "last_name": "Rose",
        //     "score": 12,
        //     "postion": "CUT",
        //     "tier": 2,
        //   }
        //   ]
        // }
        try {
          const playerDataRequest = JSON.parse(`{ "playerData": [ ${this.playerData} ] }`);

          UserService.updatePlayerData(
            this.selectedTournament.id,
            playerDataRequest,
            this.selectedRound,
          ).then(() => {
            this.playerDataSuccessful = true;
            this.playerDataMessage = 'Tournament Update Successful';
            this.submittedPlayerData = false;
            this.selectedTournament = null;
            this.selectedRound = null;
            this.playerData = '';
            this.loadingPlayerData = false;
          }, (error) => {
            this.playerDataSuccessful = false;
            this.playerDataMessage = typeof error.message === 'string'
              ? error.message : 'Tournament Failed to Update';
            this.loadingPlayerData = false;
          });
        } catch (error) {
          this.playerDataSuccessful = false;
          this.playerDataMessage = typeof error.message === 'string'
            ? error.message : 'Player Data Syntax May Be Incorrect';
          this.loadingPlayerData = false;
        }
      }
      this.loadingPlayerData = false;
    },
    addWinningTeamTournamentSelectOnChange() {
      // Remove error or success messages
      this.successfulWinningTeam = false;
      this.messageWinningTeam = '';
      this.winningTeamSelectionError = false;
      this.winningTournamentSelectionError = false;
      this.winningTournamentSelectionErrorMessage = '';
      // Make sure no TEAM is selected now that the tournament has been changed
      this.selectedAddWinnerTeam = '';

      // Tournament has been changed
      // Populate dropdown with teams that participated in tournament
      if (this.selectedAddWinnerTournament) {
        TournamentService.getTeamsInATournament(this.selectedAddWinnerTournament.id).then(
          (response) => {
            this.arrayOfTeamsInATournament = response.data;
          },
          (error) => {
            const errorMessage = (error.response && error.response.data)
              || error.message
              || error.toString()
              || 'Error Retrieving Tournament Information';
            this.winningTournamentSelectionErrorMessage = errorMessage;
            this.winningTournamentSelectionError = true;
          },
        );
      }
    },
    addWinningTeamSelectOnChange() {
      if (this.selectedAddWinnerTeam) {
        this.winningTeamSelectionError = false;
      }
    },
    addWinningTeam() {
      this.loadingAddWinningTeam = true;

      if (this.selectedAddWinnerTournament && this.selectedAddWinnerTournament.id
              && this.selectedAddWinnerTeam && this.selectedAddWinnerTeam.id) {
        UserService.addWinningTeamToTournament(this.selectedAddWinnerTournament.id,
          this.selectedAddWinnerTeam.id).then(
          () => {
            this.messageWinningTeam = 'Update Successful';
            this.successfulWinningTeam = true;

            this.loadingAddWinningTeam = false;
          }, (error) => {
            this.concludedTournamentMessage = typeof error.message === 'string'
              ? error.message : 'Winning Team Failed to be set';
            this.loadingAddWinningTeam = false;
          },
        );
      } else {
        // No Team selected
        if (!this.selectedAddWinnerTeam || !this.selectedAddWinnerTeam.id) {
          this.winningTeamSelectionError = true;
          this.winningTeamSelectionErrorMessage = 'Select A Team';
        }
        // No Tournament selected
        if (!this.selectedAddWinnerTournament || !this.selectedAddWinnerTournament.id) {
          this.winningTournamentSelectionError = true;
          this.winningTournamentSelectionErrorMessage = 'Select A Tournament';
        }
        this.loadingAddWinningTeam = false;
      }
    },
    updatePassword() {
      this.loadingUpdatePassword = true;

      const user = {
        email: this.changeUserPassword.email,
        password: this.changeUserPassword.password
      }
      UserService.updatePassword(user)
        .then(() => {
          this.messageUpdatePassword = 'Password Update Successful'
          this.successfulUpdatePassword = true;
          this.loadingUpdatePassword = false;
        }, (error) => {
          this.messageUpdatePassword = typeof error.message === 'string'
              ? error.message : 'Password Update Unsuccessful';
          this.successfulUpdatePassword = false;
          this.loadingUpdatePassword = false;
        })
    },
  },
};``
</script>
<style scoped>
  div.alert-admin-page {
    text-align: center;
    padding: 10px 0;
    margin: 10px 0;
  }
  div.tournament-select-row {
    margin-bottom: 10px
  }
  div.tournament-select-row div label {
    margin-bottom: 0px
  }
  div.alert-player-data-section {
    text-align: center;
  }
  div.select-tournament-error-style {
    margin: 0;
  }
  div#add-winner {
    height: 600px;
  }
  a.active {
    background-color: #343a40 !important;
    border-color: #343a40 !important;
    color: rgba(255,255,255,.75) !important;
    font-weight: bold !important;
  }
  a.active:hover {
    color: white !important;
  }
  button.btn-primary-dark-blue {
    background-color: #343a40;
    border-color: #343a40;
    color: rgba(255,255,255,.75);
  }
  button.btn-primary-dark-blue:hover {
    color: white;
  }

</style>
