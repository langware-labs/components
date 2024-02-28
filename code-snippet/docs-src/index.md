---
layout: page.11ty.cjs
title: <code-snippet> ⌲ Home
---

# &lt;code-snippet>

`<code-snippet>` is an awesome element. It's a great introduction to building web components with LitElement, with nice documentation site as well.

## Configure with JS

<section class="columns">
  <div>

`<code-snippet>` can be configured with JS.

```html
<script>
  const codeSnippet = document.createElement('code-snippet');
  codeSnippet.data  =  [
    {
      "content": "<h1>\\n  Hello World\\n</h1>",
      "type": "text/html"
    },
    {
      "content": "h1\\n{\n  color: blue;\n}",
      "type": "text/css"
    },
    {
      "content": "console.log(\"Hello from JS\");",
      "type": "application/javascript"
    },
    {
      "content": "import math\\nprint(math.sqrt(16))\\nprint(\"Hello, World!\")",
      "type": "text/x-python"
    },
    { 
      "content": "ls", 
      "type": "application/x-sh"
    }
  ];
  document.body.appendChild(codeSnippet);
</script>
```

  </div>
</section>
<script>
  const codeSnippet = document.createElement('code-snippet');
  codeSnippet.data  =  [
    {
      "content": "<h1>\\n  Hello World\\n</h1>",
      "type": "text/html"
    },
    {
      "content": "h1\\n{\n  color: blue;\n}",
      "type": "text/css"
    },
    {
      "content": "console.log(\"Hello from JS\");",
      "type": "application/javascript"
    },
    {
      "content": "import math\\nprint(math.sqrt(16))\\nprint(\"Hello, World!\")",
      "type": "text/x-python"
    },
    { 
      "content": "ls", 
      "type": "application/x-sh"
    }
  ];
  document.body.appendChild(codeSnippet);
</script>   
