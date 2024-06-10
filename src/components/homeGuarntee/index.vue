<template>
  <v-data-table :items="items" :headers="headers">
    <template v-slot:top>
      <v-toolbar rounded dark color="primary">
        <h4>المشاريع التي تنتهي ضماناتها خلال 90 يوما</h4>
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
        text: "رقم الخطاب",
        align: "start",
        sortable: false,
        value: "guarantee_number"
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
          if (project.guarantee.length > 0) {
            return moment(project.guarantee[0].end_date).isBefore(ninetyDaysFromNow);
          } else false;
        })
        .map((project) => {
          if (project.guarantee.length > 0) {
            return {
              guarantee_number: project.guarantee[0].guarantee_number,
              start_date: project.guarantee[0].start_date,
              end_date: project.guarantee[0].end_date,
              project_name: project.project_name
            };
          } else false;
        });

      console.log(this.items);
    }
  },

  mounted() {
    this.fetchProjects();
  }
};
</script>

<style></style>
