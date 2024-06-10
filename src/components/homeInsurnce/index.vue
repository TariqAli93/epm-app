<template>
  <v-data-table :items="items" :headers="headers">
    <template v-slot:top>
      <v-toolbar rounded dark color="primary">
        <h4>المشاريع التي ينتهي تأمينها الهندسي خلال 90 يوما</h4>
      </v-toolbar>
    </template>
  </v-data-table>
</template>

<script>
import moment from "moment";
export default {
  data: () => ({
    headers: [
      {
        text: "رقم التامين",
        align: "start",
        sortable: false,
        value: "insurance_number"
      },
      {
        text: "تاريخ البداية",
        align: "start",
        sortable: false,
        value: "start_date"
      },
      {
        text: "تاريخ النهاية",
        align: "start",
        sortable: false,
        value: "end_date"
      },
      {
        text: "المشروع",
        align: "start",
        sortable: false,
        value: "project_name"
      }
    ],
    items: []
  }),

  methods: {
    async fetchProjects() {
      const response = await this.axios.get("projects");
      this.items = response.data;

      const ninetyDaysFromNow = moment().add(90, "days");

      this.items = this.items
        .filter((project) => {
          if (project.insurance.length > 0) {
            return moment(project.insurance[0].end_date).isBefore(ninetyDaysFromNow);
          } else false;
        })
        .map((project) => {
          if (project.insurance.length > 0) {
            return {
              insurance_number: project.insurance[0].insurance_number,
              start_date: project.insurance[0].start_date,
              end_date: project.insurance[0].end_date,
              project_name: project.project_name
            };
          }
        });
    }
  },

  mounted() {
    this.fetchProjects();
  }
};
</script>

<style></style>
