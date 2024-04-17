import {App, Notice, PluginSettingTab, Setting} from 'obsidian'
import BrowserInterface from './main'
import {isDirectoryValid} from './utils'

export class BrowserInterfaceSettingTab extends PluginSettingTab {
  plugin: BrowserInterface

  constructor(app: App, plugin: BrowserInterface) {
    super(app, plugin)
    this.plugin = plugin
  }

  display() {
    const {containerEl} = this
    containerEl.empty()
    const directorySetting = new Setting(containerEl)
      .setName('Browser directory')
      .setDesc(
        "Set the directory where the browser windows will be saved. This must be the same directory as the chrome extension's directory."
      )

    if (this.plugin.settings.browserDirectory) {
      directorySetting
        .addText(text => text.setValue(this.plugin.settings.browserDirectory ?? ''))
        .setDisabled(true)
      directorySetting.addButton(button => {
        button.setButtonText('Clear directory').onClick(async () => {
          this.plugin.tearDownQueue()
          this.plugin.settings.browserDirectory = undefined
          await this.plugin.saveSettings()
          this.display()
        })
      })
    } else {
      directorySetting
        .addText(text =>
          text
            .setPlaceholder('Enter the directory path')
            .setValue(this.plugin.settings.browserDirectory ?? '')
            .onChange(async value => {
              this.plugin.settings.browserDirectory = value
            })
        )
        .addButton(button => {
          button.setButtonText('Set directory').onClick(async () => {
            if (this.plugin.settings.browserDirectory === undefined) return
            const directoryIsValid = isDirectoryValid(this.plugin.settings.browserDirectory)
            if (!directoryIsValid) {
              new Notice('The directory does not exist. Please try again.')
              return
            }
            await this.plugin.saveSettings()
            this.display()
          })
        })
    }
  }
}
