export {}
// Unused code from onload()

// // This creates an icon in the left ribbon.
// const ribbonIconEl = this.addRibbonIcon('refresh-cw', 'Load JSON', (evt: MouseEvent) => {
//   // Called when the user clicks the icon.
//   new Notice('Loading JSON...')
// })
// // Perform additional things with the ribbon
// ribbonIconEl.addClass('my-plugin-ribbon-class')
// This adds a complex command that can check whether the current state of the app allows execution of the command
// this.addCommand({
//   id: 'open-sample-modal-complex',
//   name: 'Open sample modal (complex)',
//   checkCallback: (checking: boolean) => {
//     // Conditions to check
//     const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView)
//     if (markdownView) {
//       // If checking is true, we're simply "checking" if the command can be run.
//       // If checking is false, then we want to actually perform the operation.
//       if (!checking) {
//         // new MyModal(this.app).open()
//       }
//       // This command will only show up in Command Palette when the check function returns true
//       return true
//     }
//   },
// })
// This adds a settings tab so the user can configure various aspects of the plugin
// this.addSettingTab(new SettingTab(this.app, this))
// // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
// this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000))
