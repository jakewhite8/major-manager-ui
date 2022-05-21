<template>
  <div class="container">
    <header class="jumbotron">
      <h3>Active Tournaments</h3>
    </header>
    <span v-show="loading" class="spinner-border spinner-border-sm"></span>
    <div v-if="loading || tournaments && tournaments.length">
      <ClickableRowTable
        :rowData=tournaments
        :headers=headers
        :columns=columns
        :onClickFunction=onClickFunction
      />
    </div>
    <div v-else>
      <h3>No Tournaments Available</h3>
    </div>
  </div>
</template>

<script>
import ClickableRowTable from '../components/ClickableRowTable.vue';
import TournamentService from '../services/tournament.service';

export default {
  name: 'ActiveTournaments',
  data() {
    return {
      tournaments: null,
      headers: null,
      columns: null,
      loading: false,
    };
  },
  components: {
    ClickableRowTable,
  },
  methods: {
    onClickFunction(id) {
      this.$router.push(`/tournament/${id}/player-selection`);
    },
  },
  mounted() {
    this.loading = true;
    TournamentService.getUpcomingTournaments().then(
      (response) => {
        this.tournaments = response.data;
        this.headers = ['Tournaments', 'Start Date'];
        this.columns = ['name', 'start_date'];
        this.loading = false;
      },
      (error) => {
        this.tournaments = (error.response && error.response.data)
          || error.message
          || error.toString();
        this.loading = false;
      },
    );
  },
};
</script>
