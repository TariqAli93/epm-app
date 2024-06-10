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
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>المشاريع</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
            </v-toolbar>
            <v-divider />
          </template>
          <template #[`item.project_progress`]="{ item }">
            <v-edit-dialog :return-value.sync="item.project_progress" @save="saveEdit(item, `project_progress`, item.project_progress)">
              <v-progress-circular :size="50" :width="5" rotate="-90" :value="item.project_progress * 1" color="primary"> {{ item.project_progress }}% </v-progress-circular>

              <template v-slot:input>
                <v-text-field v-model="item.project_progress" label="الانجاز" type="number" outlined></v-text-field>
              </template>
            </v-edit-dialog>
          </template>

          <template #[`item.project_status`]="{ item }">
            <v-edit-dialog :return-value.sync="item.project_status" @save="saveEdit(item, `project_status`, item.project_status)">
              <v-chip v-if="item.project_status == 0" color="primary" text-color="white" exact class="mr-2">قيد الانجاز</v-chip>
              <v-chip v-else-if="item.project_status == 1" color="error" text-color="white" exact class="mr-2">متوقف</v-chip>
              <v-chip v-else-if="item.project_status == 2" color="warning" text-color="white" exact class="mr-2">منجز</v-chip>
              <v-chip v-else-if="item.project_status == 3" color="warning" text-color="white" exact class="mr-2">في فترة الصيانة</v-chip>

              <template v-slot:input>
                <v-select
                  v-model="item.project_status"
                  :items="[
                    { text: 'قيد الانجاز', value: 0 },
                    { text: 'متوقف', value: 1 },
                    { text: 'منجز', value: 2 },
                    { text: 'في فترة الصيانة', value: 3 }
                  ]"
                  label="الحالة"
                  outlined
                ></v-select>
              </template>
            </v-edit-dialog>
          </template>

          <template #[`item.project_amount_text`]="{ item }">
            {{ tafqeet_number(item.project_amount) }}
          </template>

          <template #[`item.project_amount`]="{ item }">
            <v-edit-dialog :return-value.sync="item.project_amount" @save="saveEdit(item, `project_amount`, item.project_amount)">
              {{ item.project_amount }}

              <template v-slot:input>
                <v-text-field v-model="item.project_amount" label="المبلغ" type="number" outlined></v-text-field>
              </template>
            </v-edit-dialog>
          </template>

          <template #[`item.project_name`]="{ item }">
            <v-edit-dialog :return-value.sync="item.project_name" @save="saveEdit(item, `project_name`, item.project_name)">
              {{ item.project_name }}

              <template v-slot:input>
                <v-text-field v-model="item.project_name" label="اسم المشروع" outlined></v-text-field>
              </template>
            </v-edit-dialog>
          </template>

          <template #[`item.project_company`]="{ item }">
            <v-edit-dialog :return-value.sync="item.project_company" @save="saveEdit(item, `project_company`, item.project_company)">
              {{ item.project_company }}

              <template v-slot:input>
                <v-text-field v-model="item.project_company" label="اسم الشركة" outlined></v-text-field>
              </template>
            </v-edit-dialog>
          </template>

          <template #[`item.project_start_date`]="{ item }">
            <v-edit-dialog :return-value.sync="item.project_start_date" @save="saveEdit(item, `project_start_date`, item.project_start_date)">
              {{ format_date(item.project_start_date) }}

              <template v-slot:input>
                <v-text-field v-model="item.project_start_date" label="تاريخ البداية" outlined></v-text-field>
              </template>
            </v-edit-dialog>
          </template>

          <template #[`item.project_end_date`]="{ item }">
            <v-edit-dialog :return-value.sync="item.project_end_date" @save="saveEdit(item, `project_end_date`, item.project_end_date)">
              {{ format_date(item.project_end_date) }}

              <template v-slot:input>
                <v-text-field v-model="item.project_end_date" label="تاريخ انتهاء المشروع" outlined></v-text-field>
              </template>
            </v-edit-dialog>
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
              <v-btn :disabled="$store.getters.user.role == 0" color="error" depressed icon @click="delete_project(item)">
                <v-icon>delete</v-icon>
              </v-btn>
              <v-btn color="primary" depressed icon @click="viewPrintedTable(item)">
                <v-icon>print</v-icon>
              </v-btn>

              <v-btn v-if="item.maintenance.length < 1" :disabled="$store.getters.user.role == 0" icon @click="open_maintenance_dialog(item)">
                <v-icon>tune</v-icon>
              </v-btn>

              <v-btn v-else icon :disabled="$store.getters.user.role == 0" color="warning" @click="remove_maintenance(item)">
                <v-icon>layers_clear</v-icon>
              </v-btn>
            </div>
          </template>
        </v-data-table>

        <v-dialog v-model="maintenance_object.dialog" max-width="500px">
          <v-card>
            <v-card-title class="mb-5">
              <v-toolbar rounded dark color="primary">
                <v-toolbar-title>صيانة المشروع</v-toolbar-title>
                <v-spacer />
                <v-btn icon @click="close_maintenance_dialog">
                  <v-icon>close</v-icon>
                </v-btn>
              </v-toolbar>
            </v-card-title>
            <v-card-text>
              <v-form lazy-validation ref="maintenance_form" @submit.prevent="create_maintenance">
                <v-menu ref="start_menu" v-model="maintenance_object.start_menu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="maintenance_object.start_date" label="تاريخ البداية" :rules="[(v) => !!v || 'حقل مطلوب']" readonly v-bind="attrs" v-on="on"></v-text-field>
                  </template>
                  <v-date-picker v-model="maintenance_object.start_date" :active-picker.sync="maintenance_object.start_active_picker"></v-date-picker>
                </v-menu>

                <v-menu ref="end_menu" v-model="maintenance_object.end_menu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="maintenance_object.end_date" label="تاريخ نهاية الصيانة" :rules="[(v) => !!v || 'حقل مطلوب']" readonly v-bind="attrs" v-on="on"></v-text-field>
                  </template>
                  <v-date-picker v-model="maintenance_object.end_date" :active-picker.sync="maintenance_object.end_active_picker"></v-date-picker>
                </v-menu>

                <div class="mt-3">
                  <v-btn color="primary" depressed type="submit">انشاء الصيانة</v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
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

    <!-- printed project v-dialog -->
    <v-dialog v-model="printed_project_dialog">
      <v-card class="elevation-10">
        <v-card-title class="grey lighten-4 pa-4">
          <h2 class="headline mb-0">{{ printed_project.project_name }}</h2>

          <v-spacer></v-spacer>

          <v-btn icon @click="printed_project_dialog = false">
            <v-icon>close</v-icon>
          </v-btn>

          <v-divider vertical />

          <v-btn icon @click="print_process">
            <v-icon>print</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text id="document">
          <v-list id="print">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>اسم المشروع:</v-list-item-title>
                <v-list-item-subtitle>{{ printed_project.project_name }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider />
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>المبلغ:</v-list-item-title>
                <v-list-item-subtitle>{{ printed_project.project_amount }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider />
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>المبلغ كتابة:</v-list-item-title>
                <v-list-item-subtitle>{{ printed_project.project_amount_text }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider />
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>تاريخ المباشرة:</v-list-item-title>
                <v-list-item-subtitle>{{ printed_project.project_start_date }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider />
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>تاريخ الانجاز:</v-list-item-title>
                <v-list-item-subtitle>{{ printed_project.project_end_date }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider />
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>مدة المشروع:</v-list-item-title>
                <v-list-item-subtitle>{{ printed_project.project_time }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider />
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>الوقت المتبقي:</v-list-item-title>
                <v-list-item-subtitle>{{ printed_project.project_remaining_time }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider />
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>الانجاز:</v-list-item-title>
                <v-list-item-subtitle>{{ printed_project.project_progress }}%</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider />
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>الحالة:</v-list-item-title>
                <v-list-item-subtitle>{{ printed_project.project_status == 0 ? "قيد الانجاز" : printed_project.project_status == 1 ? "متوقف" : printed_project.project_status == 2 ? "منجز" : "في فترة الصيانة" }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider />

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>رقم الضمان:</v-list-item-title>
                <v-list-item-subtitle>{{ printed_project.project_guarantee_number }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider />
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>تاريخ بداية الضمان:</v-list-item-title>
                <v-list-item-subtitle>{{ printed_project.project_guarantee_start }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider />

            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>تاريخ نهاية الضمان:</v-list-item-title>
                <v-list-item-subtitle>{{ printed_project.project_guarantee_end }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import tafqeet from "@/plugins/tafqeet.js";
import moment from "moment";
import { EventBus } from "@/plugins/eventBus";
import jsPDF from "jspdf";
import html2pdf from "html2pdf.js";
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
          value: "project_name",
          width: "200"
        },
        {
          text: "المبلغ رقما",
          align: "start",
          sortable: false,
          value: "project_amount",
          width: "200"
        },
        {
          text: "المبلغ كتابة",
          align: "start",
          sortable: false,
          value: "project_amount_text",
          width: "200"
        },
        {
          text: "الشركة",
          align: "start",
          sortable: false,
          value: "project_company",
          width: "200"
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
      rules: [(v) => !!v || "حقل مطلوب"],
      printed_project: {},
      printed_project_header: [
        {
          text: "اسم المشروع",
          value: "project_name",
          align: "start"
        },
        {
          text: "المبلغ",
          value: "project_amount",
          align: "start"
        },
        {
          text: "المبلغ كتابة",
          value: "project_amount_text",
          align: "start"
        },
        {
          text: "تاريخ المباشرة",
          value: "project_start_date",
          align: "start"
        },
        {
          text: "تاريخ الانجاز",
          value: "project_end_date",
          align: "start"
        },
        {
          text: "مدة المشروع",
          value: "project_time",
          align: "start"
        },
        {
          text: "الوقت المتبقي",
          value: "project_remaining_time",
          align: "start"
        },
        {
          text: "الانجاز",
          value: "project_progress",
          align: "start"
        },
        {
          text: "الحالة",
          value: "project_status",
          align: "start"
        }
      ],
      printed_project_dialog: false,
      maintenance_object: {
        start_date: "",
        end_date: "",
        project_id: "",
        start_active_picker: null,
        end_active_picker: null,
        start_menu: false,
        end_menu: false,
        dialog: false
      }
    };
  },

  watch: {
    "maintenance_object.start_menu"(val) {
      val && setTimeout(() => (this.maintenance_object.start_active_picker = "YEAR"));
    },

    "maintenance_object.end_menu"(val) {
      val && setTimeout(() => (this.maintenance_object.end_active_picker = "YEAR"));
    }
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

    async create_maintenance() {
      if (this.$refs.maintenance_form.validate()) {
        try {
          await this.axios.post(`/maintenance`, {
            start_date: this.maintenance_object.start_date,
            end_date: this.maintenance_object.end_date,
            projectId: this.maintenance_object.project_id
          });

          this.$toasted.success("تم انشاء الصيانة بنجاح", {
            duration: 3000,
            position: "top-center"
          });
          this.fetchProjects();
          this.close_maintenance_dialog();
        } catch (error) {
          console.log(error);
          this.$toasted.error("حدث خطأ ما", {
            duration: 3000,
            position: "top-center"
          });
        }
      }
    },

    async remove_maintenance(item) {
      try {
        const response = await this.axios.delete(`/maintenance/${item.maintenance[0].maintenance_id}`);
        if (response.status == 200) {
          this.$toasted.success("تم حذف الصيانة بنجاح", {
            duration: 3000,
            position: "top-center"
          });
          this.fetchProjects();
        }
      } catch (error) {
        console.log(error);
        this.$toasted.error("حدث خطأ ما", {
          duration: 3000,
          position: "top-center"
        });
      }
    },

    open_maintenance_dialog(item) {
      this.maintenance_object.project_id = item.project_id;
      this.maintenance_object.dialog = true;
    },

    close_maintenance_dialog() {
      this.maintenance_object.project_id = "";
      this.maintenance_object.dialog = false;
    },

    save_maintenance_date(date, ref) {
      ref.save(date);
    },

    async saveEdit(item, type, value) {
      const types = [
        "project_progress", // يجب أن يكون رقمًا
        "project_stops", // يجب أن يكون رقمًا
        "project_status", // يجب أن يكون رقما
        "project_start_date", // يجب أن يكون تاريخًا
        "project_end_date", // يجب أن يكون تاريخًا
        "project_company", // يجب أن يكون نصًا
        "project_name", // يجب أن يكون نصًا
        "project_amount" // يجب أن يكون رقمًا
      ];

      const attributeToUpdate = types.find((t) => t === type);
      if (!attributeToUpdate) {
        this.$toasted.error("فهرس النوع غير صالح", {
          duration: 3000,
          position: "top-center"
        });
        return;
      }

      // دالة للتحقق من صحة التاريخ
      const isValidDate = (dateString) => !isNaN(Date.parse(dateString));

      // كائن يحتوي على دوال التحقق لكل نوع
      const validators = {
        project_progress: (val) => !isNaN(val),
        project_stops: (val) => !isNaN(val),
        project_status: (val) => !isNaN(val),
        project_company: (val) => typeof val === "string",
        project_amount: (val) => typeof val === "string",
        project_name: (val) => typeof val === "string",
        project_start_date: isValidDate,
        project_end_date: isValidDate
      };

      // كائن يحتوي على دوال التحويل لكل نوع
      const converters = {
        project_progress: (val) => Number(val),
        project_stops: (val) => Number(val),
        project_status: (val) => Number(val),
        project_company: (val) => String(val),
        project_amount: (val) => String(val),
        project_name: (val) => String(val),
        project_start_date: (val) => new Date(val).toISOString(),
        project_end_date: (val) => new Date(val).toISOString()
      };

      if (!validators[attributeToUpdate](value)) {
        this.$toasted.error(`${attributeToUpdate} يحتوي على قيمة غير صالحة`, {
          duration: 3000,
          position: "top-center"
        });
        return;
      }

      // تحويل القيمة إلى النوع المطلوب
      const convertedValue = converters[attributeToUpdate](value);

      console.log(`Updating ${attributeToUpdate} to ${convertedValue} for item`, item);

      try {
        const response = await this.axios.put(`/projects/${item.project_id}`, {
          [attributeToUpdate]: convertedValue
        });

        if (response.status === 200) {
          this.$toasted.success("تم تعديل المشروع بنجاح", {
            duration: 3000,
            position: "top-center"
          });
          await this.fetchProjects(); // التأكد من انتظار إتمام جلب المشاريع
          EventBus.$emit("refetch_projects");
        } else {
          this.$toasted.error("لم يتم تعديل المشروع", {
            duration: 3000,
            position: "top-center"
          });
        }
      } catch (error) {
        console.error("خطأ في تحديث المشروع:", error);
        this.$toasted.error("حدث خطأ ما", {
          duration: 3000,
          position: "top-center"
        });
      }
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
      return Math.floor(moment.duration(moment(date).diff(moment())).asDays()) < 0 ? "منتهي" : Math.floor(moment.duration(moment(date).diff(moment())).asDays()) + " يوم";
    },

    count_days(end_date, start_date) {
      return Math.floor(moment.duration(moment(end_date).diff(moment(start_date))).asDays()) + " يوم";
    },

    viewPrintedTable(item) {
      console.log(item);
      this.printed_project = {
        project_name: item.project_name,
        project_amount: item.project_amount,
        project_amount_text: this.tafqeet_number(item.project_amount),
        project_start_date: moment(item.project_start_date).format("YYYY-MM-DD"),
        project_end_date: moment(item.project_end_date).format("YYYY-MM-DD"),
        project_time: this.count_days(item.project_end_date, item.project_start_date),
        project_remaining_time: this.time_remaining(item.project_end_date),
        project_progress: item.project_progress,
        project_status: item.project_status,
        project_guarantee_end: item.guarantee.length > 0 ? item.guarantee[0].end_date : "لا يوجد ضمان",
        project_guarantee_start: item.guarantee.length > 0 ? item.guarantee[0].start_date : "لا يوجد ضمان",
        project_guarantee_number: item.guarantee.length > 0 ? item.guarantee[0].guarantee_number : "لا يوجد ضمان"
      };

      this.printed_project_dialog = true;
    },

    async print_process() {
      const doc = document.getElementById("document");
      const imgData = await html2pdf(doc, {
        margin: 1,
        filename: `${this.printed_project.project_name}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true, useCORS: true }
      });

      const pdf = new jsPDF();
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = 1200;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${this.printed_project.project_name}.pdf`);
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

<style lang="scss">
#print {
  direction: rtl !important;
  border: 1px solid #000000 !important;

  margin-block: 10px !important;
  & > * {
    direction: rtl !important;
  }

  .v-list-item__content {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;

    .v-list-item__title,
    .v-list-item__subtitle {
      flex: auto !important;
      font-weight: unset !important;
      color: #000000 !important;
      padding-block: 5px !important;
      font-display: unset !important;
    }

    .v-list-item__subtitle {
      text-align: left !important;
    }
  }
}
</style>
