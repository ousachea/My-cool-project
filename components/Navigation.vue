<template>
  <a-tabs centered>
    <a-tab-pane key="1" tab="Temperature">
      <Temperature />
    </a-tab-pane>
    <a-tab-pane key="2" tab="MPG Calculator">
      <MPGCalculator />
    </a-tab-pane>
    <a-tab-pane key="3" tab="Password Generator"><Password /></a-tab-pane>
  </a-tabs>
</template>
<script>
import Password from "./Password.vue";
export default {
  setup() {
    return {};
  },
  components: { Password },
};
</script>
<style scoped>
.tab-pane {
  background-color: green;
}
</style>
