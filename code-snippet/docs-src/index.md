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
  codeSnippet.data = {
    items: [
      {
        content: '<h1>\\n  Hello World\\n</h1>',
        type: 'html',
      },
      {
        content: 'h1\\n{\n  color: blue;\n}',
        type: 'css',
      },
      {
        content: 'console.log("Hello from JS");',
        type: 'javascript',
      },
    ],
  };
  document.body.appendChild(codeSnippet);
</script>
```

  </div>
</section>
<script>
  const codeSnippet = document.createElement('code-snippet');
  codeSnippet.data  =  {
    items: [
      {
        content: '<h1>\\n  Hello World\\n</h1>',
        type: 'html',
      },
      {
        content: 'h1\\n{\n  color: blue;\n}',
        type: 'css',
      },
      {
        content: 'console.log("Hello from JS");',
        type: 'javascript',
      },
    ],
  };
  document.body.appendChild(codeSnippet);
</script>
