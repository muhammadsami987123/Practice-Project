---
sidebar_position: 1
---

# Create a Page

import LessonTabs from '@site/src/components/LessonTabs';

<LessonTabs 
  lessonId="create-a-page"
  originalContent={`
    <h2>Create a Page</h2>
    <p>Add <strong>Markdown or React</strong> files to <code>src/pages</code> to create a <strong>standalone page</strong>:</p>
    <ul>
      <li><code>src/pages/index.js</code> → <code>localhost:3000/</code></li>
      <li><code>src/pages/foo.md</code> → <code>localhost:3000/foo</code></li>
      <li><code>src/pages/foo/bar.js</code> → <code>localhost:3000/foo/bar</code></li>
    </ul>

    <h2>Create your first React Page</h2>
    <p>Create a file at <code>src/pages/my-react-page.js</code>:</p>
    <pre><code class="language-jsx">import React from 'react';
import Layout from '@theme/Layout';

export default function MyReactPage() {
  return (
    <Layout>
      <h1>My React page</h1>
      <p>This is a React page</p>
    </Layout>
  );
}</code></pre>
    <p>A new page is now available at <a href="http://localhost:3000/my-react-page">http://localhost:3000/my-react-page</a>.</p>

    <h2>Create your first Markdown Page</h2>
    <p>Create a file at <code>src/pages/my-markdown-page.md</code>:</p>
    <pre><code class="language-mdx"># My Markdown page

This is a Markdown page</code></pre>
    <p>A new page is now available at <a href="http://localhost:3000/my-markdown-page">http://localhost:3000/my-markdown-page</a>.</p>
  `}
/>
