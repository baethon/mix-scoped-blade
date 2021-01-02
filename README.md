# Mix Scoped Blade

This is a Laravel Mix extension that takes Blade templates and adds to them a CSS scope. You can use it to write your Blade templates similar to Vue components (HTML + scoped CSS).

## Installation

```
npm i -D https://github.com/baethon/mix-scoped-blade.git
```

Then import `@baethon/mix-scoped-blade` in `webpack.mix.js`:

```js
const mix = require('laravel-mix');

require('@baethon/mix-scoped-blade');

mix.scopedBlade();
```

Add `resources/scoped/` to your `.gitignore`.  
Add  `resource_path('scoped/views'),` in `config.view.paths` configuration.

Finally, import `scoped.css` stylesheet in your template:

```html
<link href="{{ mix('css/scoped.css') }}" rel="stylesheet" />
```

## Usage

The extension will look for templates named with `*.scoped.blade.php` and compile them to a separate stylesheet and blade template.

Example template (`resources/views/hello.scoped.blade.php`):

```html
<div>Hello there!</div>

<style scoped>
div {
  padding: 20px;
  background: lightgreen;
}
</style>
```
