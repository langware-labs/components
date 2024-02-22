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
<code-snippet
  data = '[
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
    }
  ]'>
</code-snippet>
```

  </div>
  <div>

  <code-snippet
    data = '[
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
      }
    ]'>
  </code-snippet>

  </div>
</section>
