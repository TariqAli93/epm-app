<template>
  <v-data-table :items="items" :headers="headers">
    <template v-slot:top>
      <v-toolbar flat outlined rounded>
        <h4>خطابات الضمان</h4>
      </v-toolbar>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data: () => ({
    headers: [
      {
        text: "رقم الخطاب",
        align: "start",
        sortable: false,
        value: "id"
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
  })
};
</script>

<style></style>
