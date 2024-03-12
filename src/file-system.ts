import {Editor, MarkdownView, TFolder} from 'obsidian'

export type Tab = {
  favIconUrl: string | undefined
  title: string | undefined
  url: string | undefined
}

export function getTabsFromMarkdown(markdown: string): Tab[] {
  const lines = markdown.split('\n').filter(line => line.split(' ')[1]?.[0] === '!')
  const tabs: Tab[] = lines.map(line => {
    const [favIconCell, titleCell] = line.slice(1, -2).split(' | ')
    const url = titleCell.slice(titleCell.indexOf('(') + 1, titleCell.indexOf(')'))
    const title = titleCell.slice(titleCell.indexOf('[') + 1, titleCell.indexOf(']'))
    const favIconUrl = favIconCell.slice(favIconCell.indexOf('(') + 1, favIconCell.indexOf(')'))
    return {
      favIconUrl,
      title,
      url,
    }
  })

  return tabs
}

export function getTabFromMarkdown(line: string): Tab[] {
  const [favIconCell, titleCell] = line.slice(1, -2).split(' | ')
  const url = titleCell.slice(titleCell.indexOf('(') + 1, titleCell.indexOf(')'))
  const title = titleCell.slice(titleCell.indexOf('[') + 1, titleCell.indexOf(']'))
  const favIconUrl = favIconCell.slice(favIconCell.indexOf('(') + 1, favIconCell.indexOf(')'))
  return [
    {
      favIconUrl,
      title,
      url,
    },
  ]
}

export async function saveJson(json: string, directory: string) {
  const randomNum = Math.floor(1000 + Math.random() * 9000)
  const existingFile = this.app.vault.getFileByPath(
    `${directory}/browser-interface-open-queue-${randomNum}.json`
  )

  if (!existingFile) {
    await this.app.vault.create(
      `${directory}/browser-interface-open-queue-${randomNum}.json`,
      json + '\n'
    )
  } else {
    const currentContent = await this.app.vault.read(existingFile)
    await this.app.vault.modify(existingFile, currentContent + json + '\n')
  }

  console.log('JSON saved.')
}

export function isDirectoryValid(directory: string): boolean {
  return this.app.vault.getFolderByPath(directory) instanceof TFolder
}
