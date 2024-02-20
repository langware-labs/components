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
<code-snippet name="HTML"></code-snippet>
```

  </div>
  <div>

<code-snippet name="HTML"></code-snippet>

  </div>
</section>

## Declarative rendering

<section class="columns">
  <div>

`<code-snippet>` can be used with declarative rendering libraries like Angular, React, Vue, and lit-html

```js
import {html, render} from 'lit-html';

const name = 'lit-html';

render(
  html`
    <h2>This is a &lt;code-snippet&gt;</h2>
    <code-snippet .name=${name}></code-snippet>
  `,
  document.body
);
```

  </div>
  <div>

<h2>This is a &lt;code-snippet&gt;</h2>
<code-snippet name="lit-html"></code-snippet>

  </div>
</section>
