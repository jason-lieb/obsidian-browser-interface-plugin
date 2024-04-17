import {Editor, MarkdownView, Notice, Plugin} from 'obsidian'
import {getTabFromMarkdown, getTabsFromMarkdown, isDirectoryValid, saveJson} from './utils'
import {BrowserInterfaceSettingTab} from './settings'

interface BrowserInterfaceSettings {
  browserDirectory: string | undefined
}

const DEFAULT_SETTINGS: BrowserInterfaceSettings = {
  browserDirectory: undefined,
}

export default class BrowserInterface extends Plugin {
  settings: BrowserInterfaceSettings

  async onload() {
    await this.loadSettings()
    this.setUpCommands()
    this.loadMetaBindTemplates()
    this.addSettingTab(new BrowserInterfaceSettingTab(this.app, this))
  }

  async loadMetaBindTemplates() {
    // @ts-ignore
    const metaBind = this.app.plugins.plugins['obsidian-meta-bind-plugin']
    if (!metaBind) {
      new Notice('Please install the Meta Bind plugin.')
      return
    }

    type Template = {
      id?: string
      label: string
      style: string
      actions?: {type: string; command: string}[]
    }

    const templates: Template[] = [
      {
        id: 'browser-interface-extension-open-window',
        label: 'Open window',
        style: 'primary',
        actions: [{type: 'command', command: 'browser-interface:open-window'}],
      },
      {
        id: 'browser-interface-extension-open-tab',
        label: 'Open tab',
        style: 'primary',
        actions: [{type: 'command', command: 'browser-interface:open-tab'}],
      },
      {
        id: 'browser-interface-extension-delete-tab',
        label: 'Delete tab',
        style: 'destructive',
        actions: [{type: 'command', command: 'browser-interface:delete-tab'}],
      },
    ]

    const currentTemplates: Template[] = Array.from(
      metaBind.api.buttonManager.buttonTemplates.values()
    )

    const otherTemplates = currentTemplates.filter(
      template => !/^browser-interface-extension-/.test(template.id || '')
    )

    metaBind.api.buttonManager.setButtonTemplates([...otherTemplates, ...templates])
  }

  setUpCommands() {
    this.addCommand({
      id: 'open-window',
      name: 'Open window',
      editorCallback: (editor: Editor, view: MarkdownView) => {
        const directory = this.getBrowserDirectory()
        const tabs = getTabsFromMarkdown(editor.getValue())
        saveJson(JSON.stringify(tabs), directory)
        if (view.file !== null) this.app.vault.delete(view.file)
      },
    })

    this.addCommand({
      id: 'open-tab',
      name: 'Open tab',
      editorCallback: (editor: Editor) => {
        const lineNum = editor.getCursor().line
        const lineText = editor.getLine(lineNum)
        if (lineText.split(' ')[1]?.[0] !== '!') return

        const directory = this.getBrowserDirectory()
        const tab = getTabFromMarkdown(lineText)
        saveJson(JSON.stringify(tab), directory)

        editor.replaceRange('', {line: lineNum, ch: 0}, {line: lineNum + 1, ch: 0})
      },
    })

    this.addCommand({
      id: 'delete-tab',
      name: 'Delete tab',
      editorCallback: (editor: Editor) => {
        const lineNum = editor.getCursor().line
        const lineText = editor.getLine(lineNum)
        if (lineText.split(' ')[1]?.[0] !== '!') return

        editor.replaceRange('', {line: lineNum, ch: 0}, {line: lineNum + 1, ch: 0})
      },
    })
  }

  onunload() {
    this.tearDownQueue()
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
