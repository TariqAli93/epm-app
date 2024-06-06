<template>
  <div id="planning-page">
    <v-form ref="planningForm" @submit.prevent="create_planning" lazy-validation>
      <v-row>
        <v-col cols="6">
          <v-file-input label="ملف عقد" outlined @change="saveFile({ file: $event, file_name: 'ملف عقد', query: $route.query.event }, 1)">
            <template v-slot:append>
              <v-btn @click="upload_files(1)" icon class="mx-0 my-0">
                <v-icon>cloud_upload</v-icon>
              </v-btn>
            </template>
          </v-file-input>
        </v-col>
        <v-col cols="6">
          <v-file-input label="ملف ملحق عقد" outlined @change="saveFile({ file: $event, file_name: 'ملف ملحق عقد', query: $route.query.event }, 2)">
            <template v-slot:append>
              <v-btn @click="upload_files(2)" icon class="mx-0 my-0">
                <v-icon>cloud_upload</v-icon>
              </v-btn>
            </template>
          </v-file-input>
        </v-col>
        <v-col cols="12">
          <v-file-input label="ملف احالة" outlined @change="saveFile({ file: $event, file_name: 'ملف احالة', query: $route.query.event }, 3)">
            <template v-slot:append>
              <v-btn @click="upload_files(3)" icon class="mx-0 my-0">
                <v-icon>cloud_upload</v-icon>
              </v-btn>
            </template>
          </v-file-input>
        </v-col>
      </v-row>
    </v-form>

    <div class="box-body d-flex">
      <div class="box-media flex-grow-1">
        <v-toolbar color="primary" dark rounded>
          <span> خطاب الضمان </span>
          <v-spacer />
          <v-dialog max-width="600">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="white" icon v-bind="attrs" v-on="on">
                <v-icon>add</v-icon>
              </v-btn>
            </template>
            <template v-slot:default="dialog">
              <v-card>
                <v-container>
                  <v-toolbar color="primary" rounded dark>
                    <v-toolbar-title>
                      <span> خطاب الضمان </span>
                    </v-toolbar-title>

                    <v-spacer />

                    <v-btn icon @click="dialog.value = false">
                      <v-icon>close</v-icon>
                    </v-btn>
                  </v-toolbar>
                  <v-card-text>
                    <v-form ref="guaranteeForm" @submit.prevent="create_guarantee" lazy-validation>
                      <v-row>
                        <v-col cols="6">
                          <v-text-field label="رقم خطاب الضمان" :rules="[(v) => !!v || 'حقل مطلوب']" v-model="guarantee_obj.guarantee_number" outlined></v-text-field>
                        </v-col>
                        <v-col cols="6">
                          <v-file-input label="ملف خطاب الضمان" outlined @change="saveGaurabteeFile($event)"></v-file-input>
                        </v-col>
                        <v-col cols="6">
                          <v-menu v-model="guarantee_start_date_menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field v-model="guarantee_obj.guarantee_start_date" :rules="[(v) => !!v || 'حقل مطلوب']" outlined label="تاريخ البداية" readonly v-bind="attrs" v-on="on"></v-text-field>
                            </template>
                            <v-date-picker v-model="guarantee_obj.guarantee_start_date" @input="guarantee_start_date_menu = false"></v-date-picker>
                          </v-menu>
                        </v-col>

                        <v-col cols="6">
                          <v-menu v-model="guarantee_end_date_menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field v-model="guarantee_obj.guarantee_end_date" :rules="[(v) => !!v || 'حقل مطلوب']" outlined label="تاريخ الانتهاء" readonly v-bind="attrs" v-on="on"></v-text-field>
                            </template>
                            <v-date-picker v-model="guarantee_obj.guarantee_end_date" @input="guarantee_end_date_menu = false"></v-date-picker>
                          </v-menu>
                        </v-col>
                      </v-row>

                      <v-btn type="submit" depressed color="primary"> إضافة </v-btn>
                    </v-form>
                  </v-card-text>
                </v-container>
              </v-card>
            </template>
          </v-dialog>
        </v-toolbar>

        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-right">رقم خطاب الضمان</th>
                <th class="text-rught">تاريخ البداية</th>
                <th class="text-rught">تاريخ الانتهاء</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in guarantee" :key="item.guarantee_number">
                <td>{{ item.guarantee_number }}</td>
                <td>{{ item.guarantee_start_date }}</td>
                <td>{{ item.guarantee_end_date }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </div>

      <div class="box-media flex-grow-1">
        <v-toolbar color="primary" dark rounded>
          <span> التأمين الهندسي </span>
        </v-toolbar>
      </div>
    </div>

    <div class="box-body d-block">
      <div class="box-media">
        <v-toolbar color="primary" dark rounded>
          <span> ملفات العقد </span>
        </v-toolbar>
        <v-list nav>
          <v-list-item v-for="(item, index) in files" :key="index">
            <v-list-item-content>
              <v-list-item-title>{{ item.file_name }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.file_start_date }} - {{ item.file_end_date }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon @click="viewFile(item)">
                <v-icon>open_in_new</v-icon>
              </v-btn>
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
      fileTwo: null,
      fileThree: null,
      files: [],
      guarantee: null,
      guarantee_start_date_menu: false,
      guarantee_end_date_menu: false,
      guarantee_file: null,
      guarantee_obj: {
        guarantee_number: null,
        guarantee_start_date: null,
        guarantee_end_date: null
      }
    };
  },
  methods: {
    saveFile(event, count) {
      const formData = new FormData();
      formData.append("file", event.file);
      formData.append("file_name", event.file_name);
      formData.append("sectionId", event.query.section_id);
      formData.append("projectId", event.query.projectId);

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
      }
    },

    saveGaurabteeFile(file) {
      this.guarantee_file = file;
    },

    uploadGuaranteeFile() {
      const formData = new FormData();
      formData.append("file", this.guarantee_file.file);
      formData.append("file_name", this.guarantee_file.file_name);
      formData.append("sectionId", this.$route.query.section_id);
      formData.append("projectId", this.$route.query.projectId);
      formData.append("guarantee_number", this.guarantee_obj.guarantee_number);
      formData.append("guarantee_start_date", this.guarantee_obj.guarantee_start_date);
      formData.append("guarantee_end_date", this.guarantee_obj.guarantee_end_date);
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
      }

      this.fetch_files();
    },

    format_date(date) {
      console.log(moment(date).format("YYYY-MM-DD HH:mm:ss"));
      return moment(date).format("YYYY-MM-DD");
    },

    async fetch_files() {
      const query_files = this.$route.query.event.section_id;

      try {
        const sections = await this.axios.get(`sections/${query_files}`);
        this.files = sections.data.files.map((file) => {
          return {
            file_name: file.file_name.split("-")[0],
            file_start_date: file.file_start_date === null ? "" : this.format_date(file.file_start_date),
            file_end_date: file.file_end_date === null ? "" : this.format_date(file.file_end_date)
          };
        });
      } catch (error) {
        console.log(error);
      }
    },

    async fetch_guarantee() {
      const projectId = this.$route.query.event.projectId;
      const sectionId = this.$route.query.event.section_id;

      try {
        const project = await this.axios.get(`projects/${projectId}`);
        this.guarantee = project.guarantee;
      } catch (error) {
        console.log(error);
      }
    },

    async create_guarantee() {
      try {
        if (this.$refs.guaranteeForm.validate()) {
          const response = await this.axios.post(`guarantee`, this.guarantee_obj);
          console.log(response);
          this.$toasted.success("تم إضافة الضمان بنجاح");
          this.fetch_guarantee();
          this.guarantee_obj = {
            guarantee_number: null,
            guarantee_start_date: null,
            guarantee_end_date: null
          };
          this.guarantee_start_date_menu = false;
          this.guarantee_end_date_menu = false;
        }
      } catch (error) {
        this.$toasted.error("حدث خطأ ما");
        console.log(error);
      }
    }
  },

  created() {
    this.fetch_files();
    this.fetch_guarantee();
  },

  destroyed() {
    this.fileOne = null;
    this.fileTwo = null;
    this.fileThree = null;
  }
};
</script>

<style></style>
