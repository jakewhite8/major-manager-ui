<template>
  <div class="container">
    <header class="jumbotron">
      <h3>{{content}}</h3>
    </header>
    <div>
      <h3>Create Tournament</h3>
    </div>
    <div class="form-group">
      <label class="form-label" for="tournament_name">Tournament Name</label>
      <input
        v-model="newTournament.tournament_name"
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
        v-model="newTournament.tournament_date"
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
      <div v-if="submittedError && message" class="alert-danger error-admin-page">
        {{this.message}}
      </div>
      <div v-if="submittedSuccessful && message" class="alert-success error-admin-page">
        {{this.message}}
      </div>
    </div>
  </div>
</template>

<script>
import UserService from '../services/user.service';
import TournamentService from '../services/tournament.service';

export default {
  name: 'Admin',
  data() {
    return {
      content: '',
      newTournament: {
        tournament_name: '',
        tournament_date: null
      },
      tournamentNameError: false,
      tournamentDateError: false,
      submitted: false,
      submittedSuccessful: false,
      submittedError: false,
      message: '',
      loading: false
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
          this.newTournament = {
            tournament_name: '',
            tournament_date: null
          };
          this.message = 'Tournament Created';
          this.submittedSuccessful = true;
          this.submittedError = false;
          this.submitted = false;
          this.loading = false;
        }, (error) => {
          this.message = typeof error.message == 'string' ? error.message : 'Error Creating Team' ;
          this.submittedSuccessful = false;
          this.submittedError = true;
          this.loading = false;
        });
      }
      this.loading = false;
    },
    checkForErrors() {
      this.submittedSuccessful = false;
      this.submittedError = false;
      if (this.newTournament.tournament_name.length < 3 || this.newTournament.tournament_name.length > 40) {
        this.tournamentNameError = true;
      } else {
        this.tournamentNameError = false;
      }
      let dateTimeRegex = RegExp('[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}');
      if (dateTimeRegex.test(this.newTournament.tournament_date) ) {
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
</style>
