<template>
  <div class="container">
    <header class="jumbotron">
      <h3>{{content}}</h3>
    </header>

    <div class="card overflow-hidden">
    <div class="row no-gutters row-bordered row-border-light">
      <div class="col-md-3 pt-0">
        <div class="list-group list-group-flush account-settings-links settings-sidebar">
          <a class="list-group-item list-group-item-action active" data-toggle="list" href="#create-tournament">Create Tournament</a>
          <a class="list-group-item list-group-item-action" data-toggle="list" href="#add-players">Add Players</a>
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
                  @change="checkForErrors()"
                  class="form-control"
                  name="tournament_name">
                <div v-if="submitted && tournamentNameError" class="alert-danger error-admin-page">
                  Name is required and needs to be between 3 and 40 characters
                </div>
              </div>
              <div class="form-group">
                <label class="form-label" for="tournament_date">Tournament Date</label>
                <input
                  v-model="newTournament.start_date"
                  type="datetime-local"
                  @change="checkForErrors()"
                  class="form-control"
                  name="tournament_date">
                <div v-if="submitted && tournamentDateError" class="alert-danger error-admin-page">
                  Date is required
                </div>
              </div>
              <div>
                <button
                  type="button"
                  :disabled="loading"
                  v-on:click="createTournament()"
                  class="btn btn-primary-dark-blue">
                  <span>Create Tournament</span>
                  <span v-show="loading" class="spinner-border spinner-border-sm"></span>
                </button>
                <div
                  v-if="message"
                  :class="successful ? 'alert-success' : 'alert-danger'"
                  class="error-admin-page">
                  {{this.message}}
                </div>
              </div>
            </div>
          </div>
          <div class="tab-pane fade" id="add-players">
            <hr class="border-light m-0">
            <div class="card-body">
              <div class="form-group">
                <div class="row player-data-row">
                  <div class="col-6">
                    <label class="form-label" for="player_data">Player data</label>
                  </div>
                  <div class="col-6 text-right">
                    <button
                      type="button"
                      :disabled="loading"
                      class="btn btn-primary-dark-blue">
                      <span>Add Data</span>
                      <span v-show="loading" class="spinner-border spinner-border-sm"></span>
                    </button>
                  </div>
                </div>
                <textarea
                  v-model="playerData"
                  class="form-control"
                  rows="150"
                  name="player_data">
                </textarea>
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
import UserService from '../services/user.service';
import TournamentService from '../services/tournament.service';
import Tournament from '../models/tournament';

export default {
  name: 'Admin',
  data() {
    return {
      content: '',
      newTournament: new Tournament('', null, ''),
      tournamentNameError: false,
      tournamentDateError: false,
      submitted: false,
      successful: false,
      message: '',
      loading: false,
      playerData: ''
    };
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
  },
  methods: {
    createTournament() {
      this.loading = true;
      this.submitted = true;
      this.checkForErrors();

      if(!this.tournamentNameError && !this.tournamentDateError) {
        TournamentService.createTournament(this.newTournament).then((response) => {
          this.newTournament = new Tournament('', null, '');
          this.message = 'Tournament Created';
          this.successful = true;
          this.submitted = false;
          this.loading = false;
        }, (error) => {
          this.message = typeof error.message == 'string' ? error.message : 'Error Creating Team' ;
          this.successful = false
          this.loading = false;
        });
      }
      this.loading = false;
    },
    checkForErrors() {
      this.successful = false;
      this.message = '';
      if (this.newTournament.name.length < 3 || this.newTournament.name.length > 40) {
        this.tournamentNameError = true;
      } else {
        this.tournamentNameError = false;
      }
      let dateTimeRegex = RegExp('[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}');
      if (dateTimeRegex.test(this.newTournament.start_date) ) {
        this.tournamentDateError = false;
      } else {
        this.tournamentDateError = true;
      }
    }
  }
};
</script>
<style>
  div.error-admin-page {
    text-align: center;
    padding: 10px 0;
    margin: 10px 0;
  }
  div.player-data-row {
    margin-bottom: 10px
  }
  div.player-data-row div label {
    margin-top: 8px
  }
</style>
