<template>
  <div id="planning-page">
    <v-form ref="planningForm" @submit.prevent="create_planning" lazy-validation>
      <v-row>
        <v-col cols="6">
          <v-file-input label="ملف المباشرة" outlined @change="saveFile({ file: $event, file_name: 'ملف المباشرة', query: $route.query.event }, 1)">
            <template v-slot:append>
              <v-btn @click="upload_files(1)" icon class="mx-0 my-0">
                <v-icon>cloud_upload</v-icon>
              </v-btn>
            </template>
          </v-file-input>
        </v-col>
        <v-col cols="6">
          <v-file-input label="ملف امر اداري" outlined @change="saveFile({ file: $event, file_name: 'ملف امر اداري', query: $route.query.event }, 2)">
            <template v-slot:append>
              <v-btn @click="upload_files(2)" icon class="mx-0 my-0">
                <v-icon>cloud_upload</v-icon>
              </v-btn>
            </template>
          </v-file-input>
        </v-col>
        <v-col cols="6">
          <v-file-input label="ملف لجنة الاستلام الاولي" outlined @change="saveFile({ file: $event, file_name: 'ملف لجنة الاستلام الاولي', query: $route.query.event }, 3)">
            <template v-slot:append>
              <v-btn @click="upload_files(3)" icon class="mx-0 my-0">
                <v-icon>cloud_upload</v-icon>
              </v-btn>
            </template>
          </v-file-input>
        </v-col>
        <v-col cols="6">
          <v-file-input label="ملف لجنة الاستلام النهائي" outlined @change="saveFile({ file: $event, file_name: 'ملف لجنة الاستلام النهائي', query: $route.query.event }, 4)">
            <template v-slot:append>
              <v-btn @click="upload_files(4)" icon class="mx-0 my-0">
                <v-icon>cloud_upload</v-icon>
              </v-btn>
            </template>
          </v-file-input>
        </v-col>
      </v-row>
    </v-form>

    <div class="box-body d-block">
      <div class="box-media">
        <v-toolbar color="primary" dark rounded>
          <span> ملفات التخطيط </span>
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

                <v-btn :disabled="$store.getters.user.role == 0" icon class="mx-2" @click="deleteFile(item)">
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
import { ipcRenderer } from "electron";
export default {
  name: "PlanningPage",
  data() {
    return {
      fileOne: null,
      fileTwo: null,
      fileThree: null,
      fileFour: null,
      files: [],
      query: null
    };
  },
  methods: {
    saveFile(event, count) {
      const formData = new FormData();
      const query = JSON.parse(event.query);
      formData.append("file", event.file);
      formData.append("file_name", event.file_name);
      formData.append("sectionId", query.section_id);
      formData.append("projectId", query.projectId);

      switch (count) {
        case 1:
          this.fileOne = formData;
          break;
        case 2:
          this.fileTwo = formData;
          break;
        case 3:
          this.fileThree = formData;
          break;
        case 4:
          this.fileFour = formData;
          break;
      }
    },

    async upload_files(count) {
      switch (count) {
        case 1:
          try {
            const response = await this.axios.post("files", this.fileOne, {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            });
            console.log(response);
          } catch (error) {
            console.log(error);
            return;
          }
          break;
        case 2:
          try {
            const response = await this.axios.post("files", this.fileTwo, {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            });
            console.log(response);
          } catch (error) {
            console.log(error);
            return;
          }
          break;
        case 3:
          try {
            const response = await this.axios.post("files", this.fileThree, {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            });
            console.log(response);
          } catch (error) {
            console.log(error);
            return;
          }
          break;
        case 4:
          try {
            const response = await this.axios.post("files", this.fileFour, {
              headers: {
                "Content-Type": "multipart/form-data"
              }
            });
            console.log(response);
          } catch (error) {
            console.log(error);
            return;
          }
          break;
      }

      this.fetch_files();
    },

    viewFile(item) {
      const url = this.axios.defaults.baseURL.split("/api")[0] + "/" + item.file_path;

      console.log(item);
      ipcRenderer.send("open-file", url);
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
            file_path: file.file_path,
            file_name: file.file_name,
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
    this.fileThree = null;
    this.fileFour = null;
  }
};
</script>

<style></style>
