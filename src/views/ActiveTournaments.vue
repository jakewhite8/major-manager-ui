<template>
  <div class="container">
    <header class="jumbotron">
      <h3>{{content}}</h3>
    </header>
  </div>
</template>

<script>
import TournamentService from '../services/tournament.service';

export default {
  name: 'ActiveTournaments',
  data() {
    return {
      content: '',
    };
  },
  mounted() {
    TournamentService.getActiveTournaments().then(
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
};
</script>
