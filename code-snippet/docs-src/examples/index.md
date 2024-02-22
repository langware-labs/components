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
<code-snippet
  data = '[
  {
    "content": "<h1>Hello World</h1>",
    "type": "text/html"
  },
  {
    "content": "h1 { color: blue; }",
    "type": "text/css"
  },
  {
    "content": "console.log(\"Hello from JS\");",
    "type": "application/javascript"
  }
]'>
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
  data  = '[
  {
    "content": "<h1>Hello World</h1>",
    "type": "text/html"
  },
  {
    "content": "h1 { color: blue; }",
    "type": "text/css"
  },
  {
    "content": "console.log(\"Hello from JS\");",
    "type": "application/javascript"
  }
]'>
</code-snippet>
```
