<template>
  <div id="homePage">
    <div class="project-selector">
      <v-select label="المشروع" outlined :items="projects" item-text="project_name" return-object item-value="project_id" @change="changeSelectedProject($event)"></v-select>
    </div>
    <div class="box-body">
      <div class="box-media">
        <div class="box-media-icon">
          <v-icon>category</v-icon>
        </div>
        <div class="box-media-content">
          <div class="box-media-title">
            <h4>المشاريع المنجزة</h4>
          </div>

          <div class="box-media-text">
            <span class="box-media-text-number">{{ finished_projects }}</span>
            <span>مشروع</span>
          </div>
        </div>
      </div>

      <div class="box-media">
        <div class="box-media-icon">
          <v-icon>category</v-icon>
        </div>
        <div class="box-media-content">
          <div class="box-media-title">
            <h4>المشاريع في فترة الصيانة</h4>
          </div>

          <div class="box-media-text">
            <span class="box-media-text-number">{{ maintenance_projects }}</span>
            <span>مشروع</span>
          </div>
        </div>
      </div>

      <div class="box-media">
        <div class="box-media-icon">
          <v-icon>category</v-icon>
        </div>
        <div class="box-media-content">
          <div class="box-media-title">
            <h4>المشاريع المتوقفة</h4>
          </div>

          <div class="box-media-text">
            <span class="box-media-text-number">{{ stopped_projects }}</span>
            <span>مشروع</span>
          </div>
        </div>
      </div>
    </div>

    <div class="box-body d-block mt-10">
      <v-row>
        <v-col cols="6" lg="6" md="6" sm="12">
          <div class="box-media">
            <home-guarntee />
          </div>
        </v-col>
        <v-col cols="6" lg="6" md="6" sm="12">
          <div class="box-media">
            <home-insurnce />
          </div>
        </v-col>

        <v-col cols="12" lg="12" md="12" sm="12">
          <div class="box-media">
            <home-maintenance />
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import homeGuarntee from "@/components/homeGuarntee";
import homeInsurnce from "@/components/homeInsurnce";
import homeMaintenance from "@/components/homeMaintenance";
import { EventBus } from "@/plugins/eventBus";
export default {
  data() {
    return {
      projects: [],
      finished_projects: "",
      maintenance_projects: "",
      stopped_projects: ""
    };
  },

  components: {
    homeGuarntee,
    homeInsurnce,
    homeMaintenance
  },

  methods: {
    changeSelectedProject(event) {
      this.$store.dispatch("select_project", event);
      EventBus.$emit("change_project", event);
    },

    async fetchProjects() {
      try {
        const response = await this.axios.get("projects");

        this.projects = response.data;

        this.stopped_projects = this.projects.filter((project) => project.project_status === 1).length;

        this.finished_projects = this.projects.filter((project) => project.project_status === 2).length;

        this.maintenance_projects = this.projects.filter((project) => project.project_status === 3).length;
      } catch (error) {
        console.log(error);
      }
    }
  },

  mounted() {
    this.fetchProjects();
    EventBus.$on("refetch_projects", () => {
      this.fetchProjects();
    });
  }
};
</script>

<style lang="scss">
@import "../scss/main.scss";
</style>
