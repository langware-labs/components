---
layout: example.11ty.cjs
title: <code-snippet> ⌲ Examples ⌲ Basic
tags: example
name: Basic
description: A basic example
---

<style>
  code-snippet p {
    border: solid 1px blue;
    padding: 8px;
  }
</style>
<code-snippet htmlCode="<p>Hello, world!</p>" jsCode="console.log('Hello, world!');" cssCode="p { color: red; }">
</code-snippet>

<h3>CSS</h3>

```css
p {
  border: solid 1px blue;
  padding: 8px;
}
```

<h3>HTML</h3>

```html
<code-snippet
  htmlCode="<p>Hello, world!</p>"
  jsCode="console.log('Hello, world!');"
  cssCode="p { color: red; }"
>
</code-snippet>
```
