<template>
  <div class="container">
    <PageTitle
      :customField=user.team_name
      :title="`Past Teams`" />
    <PastTournamentsTable
        :tournaments=tournaments
        :loading=loading
        :headers=headers
        :columns=columns
        :message=message
        :user=user />
  </div>
</template>

<script>
import PageTitle from '../components/PageTitle.vue';
import PastTournamentsTable from '../components/PastTournamentsTable.vue';
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
    PageTitle,
    PastTournamentsTable
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
