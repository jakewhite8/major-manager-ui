<template>
  <div class="container">
    <PageTitle
      :customField=user.team_name
      :title="`Active Teams`" />
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
      <h3>No tournaments found</h3>
      <router-link to="/active-tournaments" class="nav-link">
        <font-awesome-icon icon="user-plus" />Join Tournament
      </router-link>
    </div>
    <div v-if="message" class="alert alert-danger" role="alert">{{message}}</div>
  </div>
</template>

<script>
import ClickableRowTable from '../components/ClickableRowTable.vue';
import PageTitle from '../components/PageTitle.vue';
import TournamentService from '../services/tournament.service';
import User from '../models/user';

export default {
  name: 'ActiveTournaments',
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
    PageTitle,
  },
  methods: {
    onClickFunction(id, startDate) {
      const today = new Date().getTime();
      const tournamentStartDate = new Date(startDate).getTime();
      if (tournamentStartDate < today) {
        // If the tournament has started, take user to leaderboard
        this.$router.push(`/tournament/${id}/leaderboard`);
      } else {
        // If the tournament has not started, take user to a page to edit team
        this.$router.push(`/tournament/${id}/player-selection`);
      }
    },
  },
  mounted() {
    this.user = this.$store.state.auth.user;
    this.loading = true;
    TournamentService.getActiveTournamentsForAUser().then(
      (response) => {
        this.tournaments = response.data;
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
