<script setup lang='ts' name="HomeView"></script>
<template>
  <div class="home_view">
    <div class="container">
      <h1>Home</h1>
    </div>
  </div>
</template>
<style scoped lang='less'>
.home_view {
  background: black;
  min-height: calc(100vh);

  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>