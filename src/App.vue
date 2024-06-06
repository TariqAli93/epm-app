<template>
  <v-app>
    <default-layout v-if="$store.getters.isLoggedIn" />
    <login-layout v-else />
  </v-app>
</template>

<script>
import defaultLayout from "@/layouts/default.vue";
import loginLayout from "@/layouts/login.vue";
export default {
  components: {
    loginLayout,
    defaultLayout
  }
};
</script>

<style></style>
