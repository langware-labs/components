---
layout: page.11ty.cjs
title: <code-snippet> ⌲ Home
---

# &lt;code-snippet>

`<code-snippet>` is an awesome element. It's a great introduction to building web components with LitElement, with nice documentation site as well.

## As easy as HTML

<section class="columns">
  <div>

`<code-snippet>` is just an HTML element. You can it anywhere you can use HTML!

```html
<code-snippet></code-snippet>
```

  </div>
  <div>

<code-snippet></code-snippet>

  </div>
</section>

## Configure with attributes

<section class="columns">
  <div>

`<code-snippet>` can be configured with attributed in plain HTML.

```html
<code-snippet htmlCode="<p>Hello, world!</p>" jsCode="console.log('Hello, world!');" cssCode="p { color: red; }"></code-snippet>
```

  </div>
  <div>

<code-snippet htmlCode="<p>Hello, world!</p>" jsCode="console.log('Hello, world!');" cssCode="p { color: red; }"></code-snippet>

  </div>
</section>

## Declarative rendering

<section class="columns">
  <div>

`<code-snippet>` can be used with declarative rendering libraries like Angular, React, Vue, and lit-html

```js
import {html, render} from 'lit-html';

const htmlCode = "<p>Hello, world!</p>";
const jsCode = "console.log('Hello, world!');"
const cssCode = "p { color: red; }";

render(
  html`
    <h2>This is a &lt;code-snippet&gt;</h2>
    <code-snippet .htmlCode=${htmlCode} .jsCode=${jsCode} .cssCode=${cssCode}></code-snippet>
  `,
  document.body
);
```

  </div>
  <div>

<h2>This is a &lt;code-snippet&gt;</h2>
<code-snippet htmlCode="<p>Hello, world!</p>" jsCode="console.log('Hello, world!');" cssCode="p { color: red; }"></code-snippet>

  </div>
</section>
