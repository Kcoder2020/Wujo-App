<template>
  <!-- Import and use the unified TabBar component -->
  <TabBar />
</template>

<script setup lang="ts">
import TabBar from "./TabBar.vue";

// The unified TabBar component handles everything:
// - Role detection via useRoleAccess()
// - Tab configuration from tabConfigs.ts
// - Badge support for notifications
// - Navigation and active state management
// - Wujo UI/UX styling
</script>

<style scoped>
/* No custom styles needed - all styling in TabBar.vue */
</style>
