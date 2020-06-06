# ssg
A static site generator built with simplicity in mind.

## Install
This is not published in NPM yet, so clone this repo and install the node module locally as you please.

## Configure
Option | Description
-------|--------
assetsDir | Assets directory location. Defaults to `assets`
buildDir | Build directory location. Defaults to `site`
contentDir | Content directory location. Defaults to `content`
dataDir | Data directory location. Defaults to `data`
helpersDir | Helpers directory location. Defaults to `helpers`
layoutsDir | Layouts directory location. Defaults to `layouts`
pagesDir | Pages directory location. Defaults to `pages`
partialsDir | Partials directory location. Defaults to `partials`
uncategorizedContentName | The content name for any uncategorized content (i.e. content in the base `content` dir). Defaults to `uncategorized`

## CLI Usage
Start the dev server
```
ssg -s
```
Build for production (includes minification of HTML, CSS, and JS)
```
ssg
```

## Roadmap
* Robust CLI options
* Detailed logging
* Improved error handling
* Tests
* Pagination
* Validations to catch errors before they occur (e.g. two files with the same output path)
* Config options to enable/disable asset revision and minification