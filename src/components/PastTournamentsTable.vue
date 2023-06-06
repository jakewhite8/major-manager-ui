<template>
  <div class="container">
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
      <h3 v-if="user">No past Tournaments found for {{user.team_name}}</h3>
      <h3 v-else>No Tournaments found</h3>
      <router-link to="/active-tournaments" class="nav-link">
        <font-awesome-icon icon="user-plus" />Join Tournament
      </router-link>
    </div>
    <div v-if="message" class="alert alert-danger" role="alert">{{message}}</div>
  </div>
</template>
<script>
import ClickableRowTable from '../components/ClickableRowTable.vue';

export default {
  props: {
    tournaments: {
      required: false,
    },
    loading: {
      required: false,
    },
    headers: {
      required: false,
    },
    columns: {
      required: false,
    },
    message: {
      required: false,
    },
    user: {
      required: false,
    },
  },
  components: {
    ClickableRowTable
  },
  methods: {
    onClickFunction(id) {
      this.$router.push(`/tournament/${id}/leaderboard`);
    },
  },
};
</script>