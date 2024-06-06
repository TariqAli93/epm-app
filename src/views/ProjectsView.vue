<template>
  <div id="projects-page">
    <div class="box-body d-flex w-100">
      <div class="box-media w-100 d-flex align-center justify-center">
        <v-btn color="primary" depressed @click="dialog = true">انشاء مشروع جديد</v-btn>
        <v-spacer />
        <v-text-field v-model="search" label="البحث عن مشروع" outlined prepend-inner-icon="search" hide-details></v-text-field>
      </div>
    </div>
    <div class="box-body d-block">
      <div class="box-media">
        <v-data-table :headers="headers" :items="projects" :search="search" ref="project_table">
          <template #[`item.project_progress`]="{ item }">
            <v-edit-dialog :return-value.sync="item.project_progress" @save="saveEdit($event, item)">
              <v-progress-circular :size="50" :width="5" :value="item.project_progress * 1" color="primary"> {{ item.project_progress }}% </v-progress-circular>

              <template v-slot:input>
                <v-text-field v-model="item.project_progress" label="الانجاز" type="number" outlined></v-text-field>
              </template>
            </v-edit-dialog>
          </template>

          <template #[`item.project_status`]="{ item }">
            <v-chip v-if="item.project_status == 0" color="primary" text-color="white" class="mr-2">قيد الانجاز</v-chip>
            <v-chip v-else-if="item.project_status == 1" color="error" text-color="white" class="mr-2">متوقف</v-chip>
            <v-chip v-else-if="item.project_status == 2" color="warning" text-color="white" class="mr-2">منجز</v-chip>
          </template>

          <template #[`item.project_amount_text`]="{ item }">
            {{ tafqeet_number(item.project_amount) }}
          </template>

          <template #[`item.project_start_date`]="{ item }">
            {{ format_date(item.project_start_date) }}
          </template>

          <template #[`item.project_end_date`]="{ item }">
            {{ format_date(item.project_end_date) }}
          </template>

          <template #[`item.project_remaining_time`]="{ item }">
            {{ time_remaining(item.project_end_date) }}
          </template>

          <template #[`item.project_time`]="{ item }">
            {{ count_days(item.project_end_date, item.project_start_date) }}
          </template>

          <template #[`item.actions`]="{ item }">
            <div class="d-flex">
              <v-divider vertical class="ml-3" />
              <!-- <v-btn color="primary" depressed icon>
                <v-icon>edit</v-icon>
              </v-btn> -->
              <v-btn color="error" depressed icon @click="delete_project(item)">
                <v-icon>delete</v-icon>
              </v-btn>
              <v-btn color="primary" depressed icon>
                <v-icon>print</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>
      </div>
    </div>

    <!-- create new project v-dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span>مشروع جديد</span>
          <v-spacer />
          <v-btn icon @click="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="py-5">
          <v-form ref="project_form" @submit.prevent="create_project" lazy-validation>
            <v-text-field v-model="project.project_name" :rules="rules" outlined label="اسم المشروع"></v-text-field>
            <v-text-field v-model="project.project_amount" :rules="rules" outlined label="مبلغ المشروع"></v-text-field>
            <v-text-field v-model="project.project_company" :rules="rules" outlined label="اسم الشركة"></v-text-field>
            <v-menu ref="menu" v-model="start_date_menu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field v-model="project.project_start_date" :rules="rules" outlined label="تاريخ بداية المشروع" readonly v-bind="attrs" v-on="on"></v-text-field>
              </template>
              <v-date-picker v-model="project.project_start_date" min="1950-01-01" @change="save"></v-date-picker>
            </v-menu>
            <v-menu ref="menu" v-model="end_date_menu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field v-model="project.project_end_date" :rules="rules" outlined label="تاريخ نهاية المشروع" readonly v-bind="attrs" v-on="on"></v-text-field>
              </template>
              <v-date-picker v-model="project.project_end_date" min="1950-01-01" @change="save"></v-date-picker>
            </v-menu>

            <v-divider class="mb-5" />

            <v-btn type="submit" depressed color="primary"> انشاء المشروع </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import tafqeet from "@/plugins/tafqeet.js";
import moment from "moment";
import { EventBus } from "@/plugins/eventBus";
export default {
  data() {
    return {
      dialog: false,
      project: {
        project_name: "",
        project_amount: "",
        project_company: "",
        project_start_date: "",
        project_end_date: ""
      },
      start_date_menu: null,
      end_date_menu: null,
      headers: [
        {
          text: "#",
          align: "start",
          sortable: false,
          value: "project_id"
        },
        {
          text: "اسم المشروع",
          align: "start",
          sortable: false,
          value: "project_name"
        },
        {
          text: "المبلغ رقما",
          align: "start",
          sortable: false,
          value: "project_amount"
        },
        {
          text: "المبلغ كتابة",
          align: "start",
          sortable: false,
          value: "project_amount_text"
        },
        {
          text: "الشركة",
          align: "start",
          sortable: false,
          value: "project_company"
        },
        {
          text: "تاريخ البداية",
          align: "start",
          sortable: false,
          value: "project_start_date"
        },
        {
          text: "تاريخ الانتهاء",
          align: "start",
          sortable: false,
          value: "project_end_date"
        },

        {
          text: "مدة المشروع",
          align: "start",
          sortable: false,
          value: "project_time"
        },
        {
          text: "الوقت المتبقي",
          align: "start",
          sortable: false,
          value: "project_remaining_time"
        },
        {
          text: "الانجاز",
          align: "start",
          sortable: false,
          value: "project_progress"
        },
        {
          text: "التوقفات",
          align: "start",
          sortable: false,
          value: "project_stops"
        },
        {
          text: "الحالة",
          align: "start",
          sortable: false,
          value: "project_status"
        },
        {
          text: "العمليات",
          align: "start",
          sortable: false,
          value: "actions"
        }
      ],
      projects: [],
      search: "",
      rules: [(v) => !!v || "حقل مطلوب"]
    };
  },

  methods: {
    async create_project() {
      if (this.$refs.project_form.validate()) {
        try {
          const response = await this.axios.post("/projects", {
            project_name: this.project.project_name,
            project_amount: this.project.project_amount,
            project_company: this.project.project_company,
            project_start_date: this.project.project_start_date,
            project_end_date: this.project.project_end_date
          });

          if (response.status == 201) {
            this.$toasted.success("تم انشاء المشروع بنجاح", {
              duration: 3000,
              position: "top-center"
            });
            this.dialog = false;
            this.fetchProjects();
            EventBus.$emit("refetch_projects");
          }
        } catch (error) {
          console.log(error);
          this.$toasted.error("حدث خطأ ما", {
            duration: 3000,
            position: "top-center"
          });
        }
      }
    },

    async saveEdit(value, item) {
      // try {
      //   const response = await this.axios.put(`/projects/${item.project_id}`, {
      //     project_progress: value.project_progress
      //   });
      // } catch (error) {
      //   console.error(error);
      // }

      console.log(value, item);
    },

    async delete_project(item) {
      try {
        const response = await this.axios.delete(`/projects/${item.project_id}`);
        if (response.status == 200) {
          this.$toasted.success("تم حذف المشروع بنجاح", {
            duration: 3000,
            position: "top-center"
          });
          this.fetchProjects();
          EventBus.$emit("refetch_projects");
        }
      } catch (error) {
        console.log(error);
        this.$toasted.error("حدث خطأ ما", {
          duration: 3000,
          position: "top-center"
        });
      }
    },

    async fetchProjects() {
      try {
        const response = await this.axios.get("/projects");
        this.projects = response.data;
      } catch (error) {
        console.log(error);
      }
    },

    tafqeet_number(amount) {
      return tafqeet(amount);
    },

    format_date(date) {
      return moment(date).format("YYYY-MM-DD");
    },

    // time remaining in days from the beginning to this day
    time_remaining(date) {
      return Math.floor(moment.duration(moment(date).diff(moment())).asDays()) + " يوم";
    },

    count_days(end_date, start_date) {
      return Math.floor(moment.duration(moment(end_date).diff(moment(start_date))).asDays()) + " يوم";
    },

    print_project(item) {
      console.log(item);
      const pdf_body = `
      <v-card>
        <v-card-title>
          <span>اسم المشروع:</span>
          <v-spacer />
          ${item.project_name}
          </v-card-title>
        </v-card>
      `;

      document.querySelector(".appended").innerHTML = pdf_body;
    },

    save(date) {
      this.$refs.menu.save(date);
    }
  },

  mounted() {
    this.fetchProjects();
  },

  computed: {}
};
</script>

<style></style>
