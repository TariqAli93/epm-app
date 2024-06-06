<template>
  <v-data-table :items="items" :headers="headers">
    <template v-slot:top>
      <v-toolbar flat outlined rounded>
        <h4>الصيانة</h4>
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
    }
  }
};
</script>

<style></style>
