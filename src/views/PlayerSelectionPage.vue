<template>
  <div class="container">
    <header class="jumbotron">
      <h3>
        {{ tournament.name }} Player Selection
      </h3>
    </header>
    <form @submit.prevent="handlePlayerSubmit">
      <div class="table-responsive container" v-for="(tier, index) in players" :key="index">
        <table class="table table-sm table-bordered table-hover">
          <thead class="thead-dark">
            <tr class="row">
              <th class="col-1">
              </th>
              <th class="col-11">
                Tier {{ tier[0].tier }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="player in tier" :key="player.id" class="row">
              <td class="col-1">
                <input
                  type="radio"
                  :id="player.id"
                  :value="player.id"
                  :name="'tier-' + player.tier"
                  v-model="submitPlayerDataObject[`tier-${player.tier}`]"
                  v-validate="'required'">
              </td>
              <td class="col-11">
                <label :for="player.id">
                  {{ player.first_name }} {{ player.last_name }}
                </label>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="form-group">
        <button class="btn btn-primary btn-block" :disabled="loading">
          <span v-show="loading" class="spinner-border spinner-border-sm"></span>
          <span>Submit</span>
        </button>
      </div>
      <div class="form-group">
        <div
          v-if="submitted && errors.items.length > 1 || message"
          class="alert alert-danger"
          role="alert">
          {{ message || 'Select one Player from each section'}}
        </div>
      </div>
    </form>
  </div>
</template>

<script>

import TournamentService from '../services/tournament.service';

export default {
  name: 'PlayerSelectionPage',
  data() {
    return {
      tournament: {
        name: '',
        id: null,
      },
      players: [],
      message: '',
      loading: false,
      submitPlayerDataObject: {},
      submitted: false,
    };
  },
  methods: {
    handlePlayerSubmit() {
      this.loading = true;
      this.submitted = true;
      // Validate all fields
      this.$validator.validate().then((isValid) => {
        if (isValid) {
          TournamentService
            .setTeam(this.submitPlayerDataObject, this.tournament.id).then(
              (res) => {
                if (res && res.data && res.data.message && res.data.message.indexOf('Error') > -1) {
                  this.message = res.data.message;
                  return;
                }
                this.$router.push('/active-teams');
              }, (err) => {
                this.message = (err.response && err.response.data)
                || err.message
                || err.toString();
              },
            );
        }
        this.loading = false;
      });
    },
  },
  mounted() {
    this.tournament.id = this.$route.params.id;
    TournamentService.getTournamentAndPlayerData(this.tournament.id).then(
      (response) => {
        this.tournament.name = response.data.tournamentName;
        this.players = response.data.playerData;
        this.submitPlayerDataObject = {};
        for (let i = 0; i < this.players.length; i += 1) {
          this.submitPlayerDataObject[`tier-${i + 1}`] = null;
        }
      },
      (error) => {
        this.message = (error.response && error.response.data)
          || error.message
          || error.toString();
      },
    );
  },
};
</script>
