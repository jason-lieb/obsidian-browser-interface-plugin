# Obsidian Browser Interface Plugin

An obsidian plugin that pairs with a [chrome extension](https://github.com/jason-lieb/obsidian-browser-interface-extension) to manage your tabs in obsidian.

This plugin displays the tabs saved from the chrome extension and creates buttons to reopen and delete tabs.

The Obsidian Browser Interface Plugin is dependent on the Meta Bind plugin. Also it is highly recommended to pair this plugin with the Advanced Tables plugin.

### Installation

Until the obsidian plugin is approved, the only way to install it will be manually building it.

1. Clone this repository to your local machine in your obsidian vault in the `.obsidian/plugins/` folder using `git clone https://github.com/jason-lieb/obsidian-browser-interface-plugin.git`.

2. Install the dependencies with `npm i`

3. Build the project with `npm run build`

4. Set up settings in obsidian.

### Limitations

This plugin currently only has the essential functions. Also, the `Open Tab` and `Delete Tab` work by clicking on the row of the desired tab and then clicking the associated button.
