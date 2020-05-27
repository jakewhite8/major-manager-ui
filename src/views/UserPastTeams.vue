<template>
  <div class="container">
    <header class="jumbotron">
      <h3>{{ user.team_name }} - Past Teams</h3>
    </header>
    <span v-show="loading" class="spinner-border spinner-border-sm"></span>
    <div v-if="tournaments && tournaments.length">
      <ClickableRowTable
        :rowData=tournaments
        :headers=headers
        :columns=columns
        :onClickFunction=onClickFunction
      />
    </div>
    <div v-else>
      <h3>No past Tournaments found for {{user.team_name}}</h3>
      <router-link to="/active-tournaments" class="nav-link">
        <font-awesome-icon icon="user-plus" />Join Tournament
      </router-link>
    </div>
    <div v-if="message" class="alert alert-danger" role="alert">{{message}}</div>
  </div>
</template>

<script>
import ClickableRowTable from '../components/ClickableRowTable.vue';
import TournamentService from '../services/tournament.service';
import User from '../models/user';

export default {
  name: 'UserPastTeamsPage',
  data() {
    return {
      user: new User('', '', ''),
      tournaments: null,
      headers: null,
      columns: null,
      message: '',
      loading: false,
    };
  },
  components: {
    ClickableRowTable,
  },
  methods: {
    onClickFunction(id) {
      // Take user to a page to view Tournament results
      this.$router.push(`/tournament/${id}/leaderboard`);
    },
  },
  mounted() {
    this.user = this.$store.state.auth.user;
    this.loading = true;
    TournamentService.getPastTournamentsForAUser().then(
      (response) => {
        this.tournaments = response.data;
        // Instead of displaying start date, display the result
        this.headers = ['Tournaments', 'Start Date'];
        this.columns = ['name', 'start_date'];
        this.loading = false;
      },
      (error) => {
        this.message = (error.response && error.response.data)
          || error.message
          || error.toString();
        this.loading = false;
      },
    );
  },
};
</script>
