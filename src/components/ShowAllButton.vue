<template>
  <button
    type="button"
    class="btn btn-link btn-sm accordionClass mb-3"
    aria-expanded="false"
    v-on:click="showAllButtonFunction">
      <font-awesome-icon
        v-if="this.hiddenStatus"
        icon="eye"/>
      <font-awesome-icon
        v-else
        icon="eye-slash"/>
  </button>
</template>
<script>
module.exports = {
  props: {
    showAllButtonFunction: {
      required: true,
    },
    hiddenStatus: {
      required: true,
    },
  },
};
</script>
