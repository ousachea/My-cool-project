<template>
  <div>Gold</div>
</template>

<script>
export default {
  data() {
    return {
      post: {},
    };
  },
  async fetch() {
    this.post = await this.$http.$get(
      `https://jsonplaceholder.typicode.com/posts/${this.$route.params.id}`
    );
  },
};
</script>
