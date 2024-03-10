---
layout: page.11ty.cjs
title: <shell-script> ⌲ Home
---

# &lt;shell-script>

`<shell-script>` is an awesome element. It's a great introduction to building web components with LitElement, with nice documentation site as well.

## Configure with JS

<section class="columns">
  <div>

`<shell-script>` can be configured with JS.

```html
<script>
  const pythonScript = document.createElement('shell-script');
  pythonScript.data = {
    content: 'import math\\nprint(math.sqrt(16))\\nprint("Hello, World!")',
    type: 'python',
  };
  document.body.appendChild(pythonScript);
</script>
<script>
  const shellScript = document.createElement('shell-script');
  shellScript.data = {
    content: 'ls',
    type: 'bash',
  };
  document.body.appendChild(shellScript);
</script>
<script>
  const cmdScript = document.createElement('shell-script');
  cmdScript.data = {
    content: 'dir',
    type: 'cmd',
  };
  document.body.appendChild(cmdScript);
</script>
```

  </div>
</section>
<script>
  const pythonScript = document.createElement('shell-script');
  pythonScript.data = {
    content: 'import math\\nprint(math.sqrt(16))\\nprint("Hello, World!")',
    type: 'python',
  };
  document.body.appendChild(pythonScript);
</script>
<script>
  const shellScript = document.createElement('shell-script');
  shellScript.data = {
    content: 'ls',
    type: 'bash',
  };
  document.body.appendChild(shellScript);
</script>
<script>
  const cmdScript = document.createElement('shell-script');
  cmdScript.data = {
    content: 'dir',
    type: 'cmd',
  };
  document.body.appendChild(cmdScript);
</script>
