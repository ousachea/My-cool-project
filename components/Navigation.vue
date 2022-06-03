<template>
  <a-tabs centered>
    <a-tab-pane key="1" tab="Temperature">
        <Temperature/>
    </a-tab-pane>
    <a-tab-pane key="2" tab="MPG Calculator">
        <MPGCalculator/>
    </a-tab-pane>
    <a-tab-pane key="3" tab="Tab 3">Content of Tab Pane 3</a-tab-pane>
  </a-tabs>
</template>
<script lang="ts">
import Temperature from "./Temperature.vue";
import MPGCalculator from "./MPG-calculator.vue";

export default ({
  setup() {
    return {
    };
  },
});
</script>

