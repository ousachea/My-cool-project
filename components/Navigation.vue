<template>
  <div class="navigation">
    <NuxtLink to="/gold"> Gold </NuxtLink>
    <NuxtLink to="/mpg"> MPG </NuxtLink>
    <NuxtLink to="/temperature"> Temperature </NuxtLink>
  </div>
</template>
<script></script>
<style scoped>
.navigation {
  display: flex;
  flex-direction: row;
  padding: 40px;
  gap: 40px;
  border-bottom: solid black 2px;
  margin-bottom: 40px;
}
.navigation a {
  color: black;
  font-size: 18px;
  transition: all ease-in-out 0.4s;
}
.navigation a:hover {
  color: green;
}

.nuxt-link-active,
.nuxt-link-exact-active {
  font-weight: bold;
  color: green;
}
</style>
