---
layout: example.11ty.cjs
title: <code-snippet> ⌲ Examples ⌲ JS init
tags: example
name: JS init
description: Init thourgh code
---

<script>
  const codeSnippet = document.createElement('code-snippet');
  codeSnippet.htmlCode = '<h1>Hello World</h1>';
  codeSnippet.jsCode = "console.log('Hello from JS');";
  codeSnippet.cssCode = 'h1 { color: blue; }';
  document.body.appendChild(codeSnippet);
</script>

<h3>Javascript</h3>

```javascript
const codeSnippet = document.createElement('code-snippet');
codeSnippet.htmlCode = '<h1>Hello World</h1>';
codeSnippet.jsCode = "console.log('Hello from JS');";
codeSnippet.cssCode = 'h1 { color: blue; }';
document.body.appendChild(codeSnippet);
```
