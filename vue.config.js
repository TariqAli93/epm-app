const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: ['vuetify'],
})

module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      nodeModulesPath: [
        './node_modules',
        '../node_modules',
        '../../node_modules',
      ],
      externals: ['pg', 'sqlite3', 'tedious', 'pg-hstore', 'better-sqlite3'],
      customFileProtocol: './',
      builderOptions: {
        appId: 'com.codel.epmapp',
        productName: 'برنامج ادارة المشاريع',
        extraResources: [
          './src/database/database.db',
          './node_modules/roboto-fontface/*',
          './node_modules/material-design-icons-iconfont/dist/*',
          './node_modules/@vscode/codicons/dist/*',
        ],

        publish: {
          provider: 'github',
          owner: env.proccess.GITHUB_USER,
          repo: 'epm-app',
          token: env.proccess.GITHUB_TOKEN,
          releaseType: 'release',
        },

        win: {
          target: 'nsis',
          icon: './public/icon.ico',
        },
        nsis: {
          oneClick: false,
          artifactName: 'epm.exe',
          allowElevation: false,
          deleteAppDataOnUninstall: true,
          runAfterFinish: true,
          allowToChangeInstallationDirectory: true,
          installerIcon: './public/icon.ico',
          uninstallerIcon: './public/edit_delete.ico',
          installerHeaderIcon: './public/icon.ico',
          createDesktopShortcut: true,
          createStartMenuShortcut: true,
          shortcutName: 'برنامج ادارة المشاريع',
          perMachine: false,
        },
      },
    },
  },

  transpileDependencies: ['vuetify'],
}
