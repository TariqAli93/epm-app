<template>
  <div id="planning-page">
    <v-form ref="libraryForm" @submit.prevent="upload_files" lazy-validation>
      <v-row>
        <v-col cols="6">
          <v-file-input label="يرجى اختيار الملف" :rules="[(v) => !!v || 'حقل مطلوب']" outlined @change="saveFile({ file: $event, query: $route.query.event })"> </v-file-input>
        </v-col>
        <v-col cols="6">
          <v-text-field v-model="uploaded_file_name" :rules="[(v) => !!v || 'حقل مطلوب']" label="اسم الملف" outlined></v-text-field>
        </v-col>
      </v-row>

      <v-btn type="submit" color="primary">رفع الملفات</v-btn>
    </v-form>

    <div class="box-body d-block">
      <div class="box-media">
        <v-toolbar color="primary" dark rounded>
          <span> ملفات القانونية </span>
        </v-toolbar>
        <v-list nav>
          <v-list-item v-for="(item, index) in files" :key="index">
            <v-list-item-content>
              <v-list-item-title>{{ item.file_name }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.file_start_date }} - {{ item.file_end_date }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <div>
                <v-btn icon class="mx-2" @click="viewFile(item)">
                  <v-icon>open_in_new</v-icon>
                </v-btn>

                <v-divider vertical />

                <v-btn icon class="mx-2" @click="deleteFile(item)">
                  <v-icon>delete</v-icon>
                </v-btn>
              </div>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "PlanningPage",
  data() {
    return {
      fileOne: null,
      files: [],
      uploaded_file_name: "",
      query: null
    };
  },
  methods: {
    saveFile(event) {
      const formData = new FormData();
      const query = JSON.parse(event.query);
      formData.append("file", event.file);
      formData.append("sectionId", query.section_id);
      formData.append("projectId", query.projectId);

      this.fileOne = formData;
    },

    async upload_files() {
      try {
        if (this.$refs.libraryForm.validate()) {
          this.fileOne.append("file_name", this.uploaded_file_name);
          const response = await this.axios.post("files", this.fileOne, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          });
          this.fetch_files();
          console.log(response);
        }
      } catch (error) {
        console.log(error);
        return;
      }
    },

    format_date(date) {
      console.log(moment(date).format("YYYY-MM-DD HH:mm:ss"));
      return moment(date).format("YYYY-MM-DD");
    },

    async deleteFile(file) {
      const { file_id } = file;
      try {
        await this.axios.delete(`files/${file_id}`);
        this.fetch_files();
      } catch (error) {
        console.log(error);
      }
    },

    async fetch_files() {
      const query = JSON.parse(this.$route.query.event);

      try {
        const sections = await this.axios.get(`sections/${query.section_id}`);
        this.files = sections.data.files.map((file) => {
          return {
            ...file,
            file_name: file.file_name.split("-")[0],
            file_start_date: file.file_start_date === null ? "" : this.format_date(file.file_start_date),
            file_end_date: file.file_end_date === null ? "" : this.format_date(file.file_end_date)
          };
        });
      } catch (error) {
        console.log(error);
      }
    }
  },

  created() {
    this.fetch_files();
  },

  destroyed() {
    this.fileOne = null;
    this.fileTwo = null;
  }
};
</script>

<style></style>
