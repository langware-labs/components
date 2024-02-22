---
layout: example.11ty.cjs
title: <code-snippet> ⌲ Examples ⌲ JS init
tags: example
name: JS init
description: Init thourgh code
---

<script>
  const codeSnippet = document.createElement('code-snippet');
  codeSnippet.data  = `[
    {
      "content": "<h1>Hello World</h1>",
      "type": "text/html"
    },
    {
      "content": "h1 { color: blue; }",
      "type": "text/css"
    },
    {
      "content": "console.log('Hello from JS');",
      "type": "application/javascript"
    }
  ]`;
  document.body.appendChild(codeSnippet);
</script>

<h3>Javascript</h3>

```javascript
const codeSnippet = document.createElement('code-snippet');
codeSnippet.data  = `[
  {
    "content": "<h1>Hello World</h1>",
    "type": "text/html"
  },
  {
    "content": "h1 { color: blue; }",
    "type": "text/css"
  },
  {
    "content": "console.log('Hello from JS');",
    "type": "application/javascript"
  }
]`;
document.body.appendChild(codeSnippet);
```
