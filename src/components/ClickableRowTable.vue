<template>
  <div class="table-responsive">
    <table class="table table-sm table-bordered table-hover">
      <thead class="thead-dark">
        <tr>
          <th
            v-for="header in headers"
            :key="header">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="data in rowData"
          :key="data.id"
          v-on:click="onClickFunction(data.id, data['start_date'] ? data['start_date'] : false)"
          class="clickableRow"
          v-bind:class="[(data.selected) ? 'selectedBackground' : '']">
            <td v-for="column in columns" :key="column">
              <span v-if="column.indexOf('date') > -1">
                {{ new Date(data[column]).toString() }}
              </span>
              <span v-else>{{ data[column] }}</span>
            </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
module.exports = {
  props: {
    rowData: {
      required: true,
    },
    headers: {
      required: true,
    },
    columns: {
      required: true,
    },
    onClickFunction: {},
  },
};
</script>

<style>
tr.clickableRow:hover {
  cursor: pointer;
}
tr.selectedBackground {
  background-color: #343a40;
  color: rgba(255,255,255,.75);
}
</style>
