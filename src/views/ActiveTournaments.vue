<template>
  <div class="container">
    <header class="jumbotron">
      <h3>Active Tournaments</h3>
    </header>
    <ClickableRowTable
      :rowData=tournaments
      :headers=headers
      :columns=columns
      :onClickFunction=onClickFunction
    />
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
    };
  },
  components: {
    ClickableRowTable,
  },
  methods: {
    onClickFunction(id) {
      console.log(`id: ${id}`);
      this.$router.push('/home');
    },
  },
  mounted() {
    TournamentService.getActiveTournaments().then(
      (response) => {
        this.tournaments = response.data;
        this.headers = ['Tournaments', 'Start Date'];
        this.columns = ['name', 'start_date'];
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
