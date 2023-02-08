<template>
  <div class="container">
    <PageTitle
      :title=content />
  </div>
</template>

<script>
import UserService from '../services/user.service';
import PageTitle from '../components/PageTitle.vue';

export default {
  name: 'Moderator',
  data() {
    return {
      content: '',
    };
  },
  components: {
    PageTitle,
  },
  mounted() {
    UserService.getModeratorPage().then(
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
