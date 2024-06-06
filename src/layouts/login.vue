<template>
  <v-app>
    <title-bar />
    <div id="login-page">
      <v-card class="pa-4" color="white" elevation="0" max-width="600px">
        <v-toolbar color="primary" rounded dark>
          <v-toolbar-title>يرجى ادخال اسم المستخدم و كلمة المرور</v-toolbar-title>
        </v-toolbar>
        <v-form ref="login" lazy-validation @submit.prevent="login">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field label="اسم المستخدم" prepend-icon="person" :rules="rules" color="primary" v-model="username" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="كلمة المرور" prepend-icon="lock" :rules="rules" color="primary" v-model="password" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-btn color="primary" depressed type="submit">تسجيل الدخول</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card>
    </div>
  </v-app>
</template>

<script>
import { ipcRenderer, remote } from "electron";
import TitleBar from "@/components/title/appTitle.vue";
import jwt from "jsonwebtoken";
export default {
  name: "App",
  data: () => ({
    username: "",
    password: "",
    rules: [(v) => !!v || "هذا الحقل مطلوب"]
  }),
  components: {
    TitleBar
  },

  methods: {
    quitApp() {
      ipcRenderer.send("quit");
    },

    async login() {
      if (this.$refs.login.validate()) {
        try {
          const login_user = await this.axios.post("/login", {
            username: this.username,
            password: this.password
          });

          const user = login_user.data;

          this.$store.dispatch("login", {
            user: user.user,
            token: user.token
          });

          this.$toasted.success("تم تسجيل الدخول بنجاح", {
            duration: 3000,
            position: "top-center"
          });
          return;
        } catch (error) {
          this.$toasted.error("خطأ في اسم المستخدم او كلمة المرور", {
            position: "top-center",
            duration: 5000
          });

          console.error(error);
          return;
        }
      }
    }
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

#login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: whitesmoke;
}
</style>
