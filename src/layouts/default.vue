<template>
  <v-app>
    <title-bar />

    <v-navigation-drawer right app class="pt-6" permanent stateless v-model="navigation_drawer" :mini-variant="navigation_drawer_mini" expand-on-hover>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="text-h6"> مرحبا بكـ {{ $store.getters.user.user_name }} </v-list-item-title>
          <v-list-item-subtitle> {{ $store.getters.user.role === 0 ? "محرر" : "صلاحيات كاملة" }} </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item link to="/">
          <v-list-item-icon>
            <v-icon>dashboard</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>الرئيسية</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/projects">
          <v-list-item-icon>
            <v-icon>category</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>المشاريع</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item link to="/users">
          <v-list-item-icon>
            <v-icon>people</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>المستخدمين</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider />

        <v-list-item v-for="item in links" :key="item.path" link @click.prevent="goRoute(item)">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.section_name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <v-divider />
        <v-list-item link>
          <v-list-item-icon>
            <v-icon>logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title @click="logout">تسجيل الخروج</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid>
        <div class="pt-10">
          <router-view />
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { ipcRenderer, remote } from "electron";
import TitleBar from "@/components/title/appTitle.vue";
import { EventBus } from "@/plugins/eventBus";
export default {
  name: "App",
  data: () => ({
    disabled_links: true,
    links: [],
    navigation_drawer: true,
    navigation_drawer_mini: true
  }),

  components: {
    TitleBar
  },

  methods: {
    quitApp() {
      ipcRenderer.send("quit");
    },

    logout() {
      this.$store.dispatch("logout");
      localStorage.clear();
      this.$router.push("/");
    },

    goRoute(event) {
      this.$router.push({ path: event.path, query: { event }, params: { project_id: event } });
    }
  },

  mounted() {
    EventBus.$on("change_project", (event) => {
      this.links = event.sections;
    });
  }
};
</script>

<style lang="scss">
@import url("../assets/fonts/style.css");
@import url("../assets/material-design-icons-iconfont/dist/material-design-icons.css");
@import url("../../node_modules/@vscode/codicons/dist/codicon.css");
/* ===== Scrollbar CSS ===== */
/* Firefox */

html,
body,
.v-application {
  font-family: "Cairo Regular" !important;
  font-weight: normal;
}

.v-application .elevation-1 {
  box-shadow: none !important;
  border: 1px solid rgba(0, 0, 0, 0.12) !important;
}
</style>
<style lang="scss" scoped>
.loading {
  position: fixed;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  top: 0;
  left: 0;
}
</style>
