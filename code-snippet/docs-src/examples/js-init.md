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
      "content": "&lt!DOCTYPE html&gt\\n&lthtml&gt\\n&lthead&gt\\n&lttitle&gtSimple Counter App&lt/title&gt\\n&ltstyle&gt\\n#counter {\\n text-align: center;\\n font-size: 50px;\\n margin-top: 20%;\\n}\\n&lt/style&gt\\n&lt/head&gt\\n&ltbody&gt\\n&ltbutton onclick=&aposincrement()&apos&gt+&lt/button&gt\\n&ltdiv id=&aposcounter&apos&gt0&lt/div&gt\\n&ltbutton onclick=&aposdecrement()&apos&gt-&lt/button&gt\\n&ltscript src=&aposapp.js&apos&gt&lt/script&gt\\n&lt/body&gt\\n&lt/html&gt\\n",
      "type": "text/html"
    },
    {
      "content": "var count = 0;\\nfunction increment() {\\n count += 1;\\n document.getElementById('counter').innerText = count;\\n}\\nfunction decrement() {\\n if (count > 0) {\\n  count -= 1;\\n }\\n document.getElementById('counter').innerText = count;\\n}",
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
    "content": "&lt!DOCTYPE html&gt\\n&lthtml&gt\\n&lthead&gt\\n&lttitle&gtSimple Counter App&lt/title&gt\\n&ltstyle&gt\\n#counter {\\n text-align: center;\\n font-size: 50px;\\n margin-top: 20%;\\n}\\n&lt/style&gt\\n&lt/head&gt\\n&ltbody&gt\\n&ltbutton onclick=&aposincrement()&apos&gt+&lt/button&gt\\n&ltdiv id=&aposcounter&apos&gt0&lt/div&gt\\n&ltbutton onclick=&aposdecrement()&apos&gt-&lt/button&gt\\n&ltscript src=&aposapp.js&apos&gt&lt/script&gt\\n&lt/body&gt\\n&lt/html&gt\\n",
    "type": "text/html"
  },
  {
    "content": "var count = 0;\\nfunction increment() {\\n count += 1;\\n document.getElementById('counter').innerText = count;\\n}\\nfunction decrement() {\\n if (count > 0) {\\n  count -= 1;\\n }\\n document.getElementById('counter').innerText = count;\\n}",
    "type": "application/javascript"
  }
]`;
document.body.appendChild(codeSnippet);
```
