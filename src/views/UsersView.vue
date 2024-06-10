<template>
  <div class="user-page">
    <div class="box-body d-block">
      <div class="box-media">
        <v-data-table :headers="headers" :items="users" :search="search" item-key="user_id">
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>المستخدمين</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer />
              <v-text-field v-model="search" dense label="البحث عن مستخدم" outlined prepend-inner-icon="search" hide-details></v-text-field>

              <v-btn :disabled="$store.getters.user.role == 0" color="primary" depressed class="mr-3" @click="openCreateDialog">
                <v-icon>add</v-icon>
                <span>إضافة مستخدم</span>
              </v-btn>
            </v-toolbar>
            <v-divider />
          </template>

          <template #[`item.role`]="{ item }">
            <v-chip color="primary" small>{{ item.role == 0 ? `محرر` : `صلاحيات كاملة` }}</v-chip>
          </template>

          <template #[`item.actions`]="{ item }">
            <v-btn :disabled="$store.getters.user.role == 0" icon color="error" @click="deleteUser(item)">
              <v-icon>delete</v-icon>
            </v-btn>

            <v-btn :disabled="$store.getters.user.role == 0" icon color="primary" @click="openEditUsersDialog(item)">
              <v-icon>settings</v-icon>
            </v-btn>
          </template>
        </v-data-table>

        <v-dialog v-model="edit_dialog" max-width="500px">
          <v-card>
            <v-card-title class="mb-5">
              <v-toolbar rounded color="primary" dark>
                <v-toolbar-title>تعديل المستخدم</v-toolbar-title>
              </v-toolbar>
            </v-card-title>
            <v-card-text>
              <v-text-field v-model="user.user_name" label="اسم المستخدم" outlined></v-text-field>
              <v-text-field v-model="user.password" label="كلمة المرور" :type="showPassword ? `text` : `password`" :append-icon="showPassword ? `visibility_off` : `visibility`" @click:append="showPassword = !showPassword" outlined></v-text-field>
              <v-select
                label="الصلاحيات"
                :items="[
                  {
                    text: 'محرر',
                    value: 0
                  },
                  {
                    text: 'صلاحيات كاملة',
                    value: 1
                  }
                ]"
                v-model="user.role"
                outlined
              ></v-select>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-btn color="primary" @click="updateUser" depressed>حفظ</v-btn>
              <v-btn color="error" depressed @click="closeEditDialog">إلغاء</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog v-model="create_dialog" max-width="500px">
          <v-card>
            <v-card-title class="mb-5">
              <v-toolbar rounded color="primary" dark>
                <v-toolbar-title>اضافة مستخدم</v-toolbar-title>
              </v-toolbar>
            </v-card-title>
            <v-card-text>
              <v-text-field v-model="user.user_name" label="اسم المستخدم" outlined></v-text-field>
              <v-text-field v-model="user.password" label="كلمة المرور" :type="showPassword ? `text` : `password`" :append-icon="showPassword ? `visibility_off` : `visibility`" @click:append="showPassword = !showPassword" outlined></v-text-field>
              <v-select
                label="الصلاحيات"
                :items="[
                  {
                    text: 'محرر',
                    value: 0
                  },
                  {
                    text: 'صلاحيات كاملة',
                    value: 1
                  }
                ]"
                v-model="user.role"
                outlined
              ></v-select>
            </v-card-text>
            <v-divider />
            <v-card-actions>
              <v-btn color="primary" @click="createUser" depressed>حفظ</v-btn>
              <v-btn color="error" depressed @click="closeCreateDialog">إلغاء</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [],
      search: "",
      dialog: false,
      edit_dialog: false,
      create_dialog: false,
      showPassword: false,
      user: {
        user_id: "",
        user_name: "",
        role: "",
        password: ""
      },
      headers: [
        { text: "#", value: "user_id" },
        { text: "اسم المستخدم", value: "user_name" },
        { text: "الصلاحيات", value: "role" },
        { text: "العمليات", value: "actions", sortable: false }
      ]
    };
  },

  methods: {
    async fetchUsers() {
      try {
        const response = await this.axios.get("/users");
        this.users = response.data;
        console.log(response);
      } catch (error) {
        console.error(error);
      }
    },

    openEditUsersDialog(user) {
      this.edit_dialog = true;
      this.user = user;
    },

    closeEditDialog() {
      this.edit_dialog = false;
      this.user = { user_id: "", user_name: "", role: "", password: "" };
    },

    openCreateDialog() {
      this.user = { user_id: "", user_name: "", role: "", password: "" };
      this.create_dialog = true;
    },
    closeCreateDialog() {
      this.create_dialog = false;
      this.user = { user_id: "", user_name: "", role: "", password: "" };
    },
    async createUser() {
      const { user_name, role, password } = this.user;
      try {
        await this.axios.post("/users", { user_name, role, password });
        this.create_dialog = false;
        this.user = { user_id: "", user_name: "", role: "", password: "" };
        this.$toasted.success("تم اضافة المستخدم بنجاح", {
          duration: 3000,
          position: "top-center"
        });
      } catch (error) {
        console.error(error);
      } finally {
        this.fetchUsers();
      }
    },

    async deleteUser(item) {
      console.log();
      if (this.$store.getters.user.role === 0) {
        this.$toasted.error("لا يمكن حذف المستخدم لا تملك الصلاحيات الكافية", {
          duration: 3000,
          position: "top-center"
        });
        return;
      }
      try {
        await this.axios.delete(`/users/${item.user_id}`);
        this.$toasted.success("تم حذف المستخدم بنجاح", {
          duration: 3000,
          position: "top-center"
        });
      } catch (error) {
        console.error(error);
      } finally {
        this.fetchUsers();
      }
    },

    async updateUser() {
      const { user_id, user_name, role, password } = this.user;
      try {
        await this.axios.put(`/users/${user_id}`, { user_name, role, password });
        this.edit_dialog = false;
        this.user = { user_id: "", user_name: "", role: "", password: "" };
        this.$toasted.success("تم تعديل المستخدم بنجاح", {
          duration: 3000,
          position: "top-center"
        });
      } catch (error) {
        console.error(error);
      } finally {
        this.fetchUsers();
      }
    }
  },

  created() {
    this.fetchUsers();
  }
};
</script>

<style></style>
