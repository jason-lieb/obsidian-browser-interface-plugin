import {Editor, MarkdownView, Notice, Plugin} from 'obsidian'
import {Tab, getTabsFromMarkdown, isDirectoryValid, saveJson} from './src/file-system'
import {BrowserInterfaceSettingTab} from 'src/settings'

interface BrowserInterfaceSettings {
  browserDirectory: string | undefined
}

const DEFAULT_SETTINGS: BrowserInterfaceSettings = {
  browserDirectory: 'Browser', // set default to undefined in production
}

export default class BrowserInterfacePlugin extends Plugin {
  settings: BrowserInterfaceSettings

  async onload() {
    console.log('Loading Browser Interface Plugin...') // Remove for production
    await this.loadSettings()
    this.setUpCommands()
    // this.loadMetaBindTemplates()
    this.addSettingTab(new BrowserInterfaceSettingTab(this.app, this))
  }

  async loadMetaBindTemplates() {
    // @ts-ignore
    const metaBind = this.app.plugins.plugins['obsidian-meta-bind-plugin']
    console.log({metaBind})
    if (!metaBind) return

    const templates = [
      {
        id: 'browser-interface-extension-open-window',
        label: 'Open',
        style: 'primary',
        actions: [{type: 'command', command: 'browser-interface-plugin:open-window'}],
      },
      {
        id: 'browser-interface-extension-open-tab',
        label: 'Open',
        style: 'primary',
        actions: [{type: 'command', command: 'browser-interface-plugin:open-tab'}],
      },
      {
        id: 'browser-interface-extension-delete-tab',
        label: 'Delete',
        style: 'danger',
        actions: [{type: 'command', command: 'browser-interface-plugin:delete-tab'}],
      },
    ]

    metaBind.api.buttonManager.setButtonTemplates(templates)
  }

  setUpCommands() {
    // Change these commands to use checkCallback instead of editorCallback?
    this.addCommand({
      id: 'open-window',
      name: 'Open Window',
      editorCallback: this.open(getTabsFromMarkdown),
    })

    this.addCommand({
      id: 'open-tab',
      name: 'Open Tab',
      // editorCallback: this.open(getTabFromMarkdown),
    })
  }

  open(getTabsFn: (markdown: string) => Tab[]): (editor: Editor, view: MarkdownView) => void {
    return (editor: Editor, view: MarkdownView) => {
      const directory = this.getBrowserDirectory()

      const tabs = getTabsFn(editor.getValue())
      saveJson(JSON.stringify(tabs), directory)
      // if (view.file !== null) this.app.vault.delete(view.file)
    }
  }

  onunload() {
    this.tearDownQueue
  }

  tearDownQueue() {
    const queue = this.app.vault.getFileByPath(
      `${this.settings.browserDirectory}/browser-interface-open-queue.json`
    )
    if (queue) this.app.vault.delete(queue)
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  }

  async saveSettings() {
    await this.saveData(this.settings)
  }

  getBrowserDirectory() {
    if (
      this.settings.browserDirectory === undefined ||
      !isDirectoryValid(this.settings.browserDirectory)
    ) {
      new Notice('The directory does not exist. Please try again.')
      throw new Error('The directory does not exist. Please try again.')
    }

    return this.settings.browserDirectory
  }
}
