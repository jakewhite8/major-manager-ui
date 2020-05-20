<template>
  <div class="container">
    <header class="jumbotron">
      <h3>Active Tournaments</h3>
    </header>
    <div class="table-responsive">
      <table class="table table-striped table-sm table-bordered table-hover">
        <thead class="thead-dark">
          <tr>
            <th>Tournament</th>
            <th>Start Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(tournament) in tournaments" :key="tournament.id">
            <td>{{ tournament.name }}</td>
            <td>{{ new Date(tournament.start_date).toString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import TournamentService from '../services/tournament.service';

export default {
  name: 'ActiveTournaments',
  data() {
    return {
      tournaments: '',
    };
  },
  mounted() {
    TournamentService.getActiveTournaments().then(
      (response) => {
        this.tournaments = response.data;
      },
      (error) => {
        this.tournaments = (error.response && error.response.data)
          || error.message
          || error.toString();
      },
    );
  },
};
</script>
