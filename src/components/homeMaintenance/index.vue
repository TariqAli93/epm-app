<template>
  <v-data-table :items="items" :headers="headers">
    <template v-slot:top>
      <v-toolbar rounded dark color="primary">
        <h4>المشاريع التي تنتهي فترة الصيانة خلال 90 يوما</h4>
      </v-toolbar>
    </template>
  </v-data-table>
</template>

<script>
import momment from "moment";
export default {
  data() {
    return {
      headers: [
        {
          text: "رقم المشروع",
          value: "project_id",
          sortable: false,
          align: "start"
        },
        {
          text: "اسم المشروع",
          value: "project_name",
          sortable: false,
          align: "start"
        },
        {
          text: "تاريخ بداية الصيانة",
          value: "start_date",
          sortable: false,
          align: "start"
        },
        {
          text: "تاريخ نهاية الصيانة",
          value: "end_date",
          sortable: false,
          align: "start"
        }
      ],
      items: []
    };
  },

  methods: {
    formatDate(date) {
      return momment(date).format("DD/MM/YYYY");
    },

    async getMaintenance() {
      const response = await this.axios.get("projects");
      this.items = response.data;

      const ninetyDaysFromNow = momment().add(90, "days");
      this.items = this.items
        .filter((project) => {
          if (project.maintenance.length > 0) {
            return momment(project.maintenance[0].end_date).isBefore(ninetyDaysFromNow);
          } else false;
        })
        .map((project) => {
          if (project.maintenance.length > 0) {
            return {
              project_id: project.project_id,
              project_name: project.project_name,
              start_date: this.formatDate(project.maintenance[0].start_date),
              end_date: this.formatDate(project.maintenance[0].end_date)
            };
          }
        });
    }
  },

  created() {
    this.getMaintenance();
  }
};
</script>

<style></style>
