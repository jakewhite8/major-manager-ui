<template>
  <div class="container">
    <PageTitle
      :title="`Rules`" />
    <header class="jumbotron">
      <ul>
        <li>
          <h4>Choose one player from each tier</h4>
        </li>
        <li>
          <h4>A Team's final score is the aggregate of their four lowest scores</h4>
        </li>
        <li>
          <h4>Players that fail to make the cut have eight strokes added to their score</h4>
        </li>
      </ul>
    </header>
  </div>
</template>

<script>
import PageTitle from '../components/PageTitle.vue';

export default {
  name: 'Rules',
  components: {
    PageTitle
  }
};
</script>
