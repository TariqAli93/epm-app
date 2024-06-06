import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'
import ar from 'vuetify/lib/locale/ar'

Vue.use(Vuetify)

export default new Vuetify({
  rtl: true,
  theme: {
    dark: false,
    options: {
      customProperties: true,
    },
    themes: {},
  },
  lang: {
    locales: { ar },
    current: 'ar',
  },
  icons: {
    iconfont: 'md',
  },
})
