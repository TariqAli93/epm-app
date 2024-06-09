<template>
  <div id="planning-page">
    <v-form ref="planningForm" @submit.prevent="create_planning" lazy-validation>
      <v-row>
        <v-col cols="6">
          <v-file-input label="ملف عقد" outlined @change="saveFile({ file: $event, file_name: 'ملف عقد', query: query }, 1)">
            <template v-slot:append>
              <v-btn @click="upload_files(1)" icon class="mx-0 my-0">
                <v-icon>cloud_upload</v-icon>
              </v-btn>
            </template>
          </v-file-input>
        </v-col>
        <v-col cols="6">
          <v-file-input label="ملف ملحق عقد" outlined @change="saveFile({ file: $event, file_name: 'ملف ملحق عقد', query: query }, 2)">
            <template v-slot:append>
              <v-btn @click="upload_files(2)" icon class="mx-0 my-0">
                <v-icon>cloud_upload</v-icon>
              </v-btn>
            </template>
          </v-file-input>
        </v-col>
        <v-col cols="12">
          <v-file-input label="ملف احالة" outlined @change="saveFile({ file: $event, file_name: 'ملف احالة', query: query }, 3)">
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
              <v-btn color="white" icon :disabled="guarantee.length > 0" v-bind="attrs" v-on="on">
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
                    <v-form
                      ref="guaranteeForm"
                      @submit.prevent="
                        create_guarantee();
                        dialog.value = false;
                      "
                      lazy-validation
                    >
                      <v-row>
                        <v-col cols="6">
                          <v-text-field label="رقم خطاب الضمان" :rules="[(v) => !!v || 'حقل مطلوب']" v-model="guarantee_obj.guarantee_number" outlined></v-text-field>
                        </v-col>
                        <v-col cols="6">
                          <v-file-input label="ملف خطاب الضمان" outlined @change="saveGauranteeFile($event)"></v-file-input>
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
                <th class="text-right">تاريخ البداية</th>
                <th class="text-right">تاريخ الانتهاء</th>
                <th class="text-right">الاجرائات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="guarantee.length > 0">
                <td>{{ guarantee[guarantee.length - 1].guarantee_number }}</td>
                <td>{{ guarantee[guarantee.length - 1].start_date }}</td>
                <td>{{ guarantee[guarantee.length - 1].end_date }}</td>
                <td>
                  <v-btn icon @click="removeGuarantee(guarantee[guarantee.length - 1])">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </td>
              </tr>

              <tr v-else>
                <td colspan="3" class="text-center">لا يوجد خطاب ضمان</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </div>

      <div class="box-media flex-grow-1">
        <v-toolbar color="primary" dark rounded>
          <span> التأمين الهندسي </span>

          <v-spacer />

          <v-dialog max-width="600">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="white" :disabled="insurance.length > 0" icon v-bind="attrs" v-on="on">
                <v-icon>add</v-icon>
              </v-btn>
            </template>
            <template v-slot:default="dialog">
              <v-card>
                <v-container>
                  <v-toolbar color="primary" rounded dark>
                    <v-toolbar-title>
                      <span> التأمين الهندسي</span>
                    </v-toolbar-title>

                    <v-spacer />

                    <v-btn icon @click="dialog.value = false">
                      <v-icon>close</v-icon>
                    </v-btn>
                  </v-toolbar>
                  <v-card-text>
                    <v-form
                      ref="insuranceForm"
                      @submit.prevent="
                        create_insurance();
                        dialog.value = false;
                      "
                      lazy-validation
                    >
                      <v-row>
                        <v-col cols="6">
                          <v-text-field label="رقم التأمين الهندسي" :rules="[(v) => !!v || 'حقل مطلوب']" v-model="insurance_obj.insurance_number" outlined></v-text-field>
                        </v-col>
                        <v-col cols="6">
                          <v-file-input label="ملف التأمين الهندسي" outlined @change="saveInsuranceFile($event)"></v-file-input>
                        </v-col>
                        <v-col cols="6">
                          <v-menu v-model="insurance_start_date_menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field v-model="insurance_obj.insurance_start_date" :rules="[(v) => !!v || 'حقل مطلوب']" outlined label="تاريخ البداية" readonly v-bind="attrs" v-on="on"></v-text-field>
                            </template>
                            <v-date-picker v-model="insurance_obj.insurance_start_date" @input="insurance_start_date_menu = false"></v-date-picker>
                          </v-menu>
                        </v-col>

                        <v-col cols="6">
                          <v-menu v-model="insurance_end_date_menu" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                            <template v-slot:activator="{ on, attrs }">
                              <v-text-field v-model="insurance_obj.insurance_end_date" :rules="[(v) => !!v || 'حقل مطلوب']" outlined label="تاريخ الانتهاء" readonly v-bind="attrs" v-on="on"></v-text-field>
                            </template>
                            <v-date-picker v-model="insurance_obj.insurance_end_date" @input="insurance_end_date_menu = false"></v-date-picker>
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
                <th class="text-right">رقم التأمين الهندسي</th>
                <th class="text-rught">تاريخ البداية</th>
                <th class="text-rught">تاريخ الانتهاء</th>

                <th class="text-right">الاجرائات</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="insurance.length > 0">
                <td>{{ insurance[insurance.length - 1].insurance_number }}</td>
                <td>{{ insurance[insurance.length - 1].start_date }}</td>
                <td>{{ insurance[insurance.length - 1].end_date }}</td>
                <td>
                  <v-btn icon @click="removeInsurance(insurance[insurance.length - 1])">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </td>
              </tr>

              <tr v-else>
                <td colspan="3" class="text-center">لا يوجد تأمين هندسي</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
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
      guarantee: [],
      guarantee_start_date_menu: false,
      guarantee_end_date_menu: false,
      guarantee_file: null,
      guarantee_obj: {
        guarantee_number: null,
        guarantee_start_date: null,
        guarantee_end_date: null
      },

      insurance: [],
      insurance_start_date_menu: false,
      insurance_end_date_menu: false,
      insurance_file: null,
      insurance_obj: {
        insurance_number: null,
        insurance_start_date: null,
        insurance_end_date: null
      },

      query: null
    };
  },
  methods: {
    saveFile(event, count) {
      console.log(event);
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

    saveGauranteeFile(file) {
      this.guarantee_file = file;
    },

    saveInsuranceFile(file) {
      this.insurance_file = file;
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

      this.$toasted.success("تم رفع الملف بنجاح", {
        duration: 3000,
        position: "top-center"
      });
      this.fetch_files();
    },

    format_date(date) {
      console.log(moment(date).format("YYYY-MM-DD HH:mm:ss"));
      return moment(date).format("YYYY-MM-DD");
    },

    async fetch_files() {
      try {
        const sections = await this.axios.get(`sections/${this.query.section_id}`);
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

    async create_guarantee() {
      try {
        if (this.$refs.guaranteeForm.validate()) {
          const formData = new FormData();
          formData.append("file", this.guarantee_file);
          formData.append("guarantee_number", this.guarantee_obj.guarantee_number);
          formData.append("start_date", this.guarantee_obj.guarantee_start_date);
          formData.append("end_date", this.guarantee_obj.guarantee_end_date);
          formData.append("projectId", this.query.projectId);

          const uploaded_file = this.axios.post("/guarantee", formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          });

          this.guarantee = [];
          await this.fetch_guarantee();
          this.$toasted.success("تم اضافة خطاب الضمان بنجاح", {
            duration: 3000,
            position: "top-center"
          });
        }
      } catch (error) {
        this.$toasted.error("حدث خطأ ما");
        console.log(error);
      } finally {
        this.guarantee_obj = {
          guarantee_number: null,
          guarantee_start_date: null,
          guarantee_end_date: null
        };

        this.guarantee_file = null;

        this.guarantee_start_date_menu = false;

        this.guarantee_end_date_menu = false;

        this.$refs.guaranteeForm.resetValidation();

        this.$refs.guaranteeForm.reset();

        this.fetch_guarantee();
      }
    },

    async fetch_guarantee() {
      try {
        const project = await this.axios.get(`projects/${this.query.projectId}`);
        console.log(project);
        this.guarantee = project.data.guarantee;
      } catch (error) {
        console.log(error);
      }
    },

    async create_insurance() {
      try {
        if (this.$refs.insuranceForm.validate()) {
          const formData = new FormData();
          formData.append("file", this.insurance_file);
          formData.append("insurance_number", this.insurance_obj.insurance_number);
          formData.append("start_date", this.insurance_obj.insurance_start_date);
          formData.append("end_date", this.insurance_obj.insurance_end_date);
          formData.append("projectId", this.query.projectId);

          const uploaded_file = this.axios.post("/insurance", formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          });

          this.insurance = [];
          await this.fetch_insurances();
          this.$toasted.success("تم اضافة التأمين الهندسي بنجاح", {
            duration: 3000,
            position: "top-center"
          });
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.insurance_obj = {
          insurance_number: null,
          insurance_start_date: null,
          insurance_end_date: null
        };

        this.insurance_file = null;

        this.insurance_start_date_menu = false;

        this.insurance_end_date_menu = false;

        this.$refs.insuranceForm.resetValidation();

        this.$refs.insuranceForm.reset();

        this.fetch_insurances();
      }
    },

    async fetch_insurances() {
      try {
        const project = await this.axios.get(`projects/${this.query.projectId}`);
        this.insurance = [];
        this.insurance = project.data.insurance;
        console.log(this.insurance);
      } catch (error) {
        console.log(error);
      }
    },

    async removeGuarantee(item) {
      try {
        const response = await this.axios.delete(`guarantee/${item.guarantee_id * 1}`);
        this.$toasted.success("تم حذف خطاب الضمان بنجاح", {
          duration: 3000,
          position: "top-center"
        });
        this.fetch_guarantee();
      } catch (error) {
        console.log(error);
      } finally {
        this.fetch_guarantee();
      }
    },

    async removeInsurance(item) {
      try {
        const response = await this.axios.delete(`insurance/${item.insurance_id * 1}`);
        this.$toasted.success("تم حذف التأمين الهندسي بنجاح", {
          duration: 3000,
          position: "top-center"
        });
        this.fetch_insurances();
      } catch (error) {
        console.log(error);
      } finally {
        this.fetch_insurances();
      }
    }
  },

  created() {
    this.query = JSON.parse(this.$route.query.event);

    this.fetch_files();
    this.fetch_guarantee();
    this.fetch_insurances();
  },

  destroyed() {
    this.fileOne = null;
    this.fileTwo = null;
    this.fileThree = null;
  }
};
</script>

<style></style>
