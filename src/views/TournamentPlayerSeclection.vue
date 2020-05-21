<template>
  <div class="container">
    <header class="jumbotron">
      <h3>
        {{ tournament.name }} Player Selection
      </h3>
    </header>
  </div>
</template>

<script>

import TournamentService from '../services/tournament.service';

export default {
  name: 'TournamentPlayerSelection',
  data() {
    return {
      tournament: {
        name: '',
        id: null
      },
      players: []
    }
  },
  mounted() {
    this.tournament.id = this.$route.params.id
    TournamentService.getTournamentAndPlayerData(this.tournament.id).then(
      (response) => {
        this.tournament.name = response.data.tournamentName;
        this.players = response.data.playerData
      },
      (error) => {
        this.tournament.name = (error.response && error.response.data)
          || error.message
          || error.toString();
      }
    )
  }
};
</script>
