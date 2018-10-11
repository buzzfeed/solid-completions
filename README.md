# solid-completions
An [Atom](http://www.atom.io) autocomplete provider for the [Solid CSS framework](http://solid.buzzfeed.com) and generator for `.sublime-completions` autocomplete files.

It will autocomplete your Solid classnames in HTML and HTML-ish (mustache, handlebars, etc) files while also providing access to Solid global variables in SCSS.

[Solid Autocomplete Example](https://monosnap.com/file/biBzhqnrIhT6jC0KA5PweeRTtuwN28.png)

## Installation (Atom)

Use the command palette `cmd-shift-P` and jump to `Settings View: Install Packages and Themes`. Search for `solid-completions` and hit install. That's it!

## Installation (Sublime)
Clone the repo to your machine
`git clone https://github.com/buzzfeed/solid-completions.git`

Install the modules
`npm install`

Generate the completions files
`grunt generate`

Move the resulting `.sublime-completions` files to `~/Library/Application Support/Sublime Text 2/Packages/User/`
