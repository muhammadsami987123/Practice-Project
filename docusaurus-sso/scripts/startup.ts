import 'dotenv/config';
import { connectToDatabase, COLLECTIONS, closeDatabaseConnection } from '../src/db/index.js';
import type { Tenant, Lesson } from '../src/db/schema.js';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

interface LessonData {
    id: string;
    title: string;
    slug: string;
    originalContent: string;
    category: string;
    order: number;
}

const lessons: LessonData[] = [
    {
        id: 'create-a-page',
        title: 'Create a Page',
        slug: 'create-a-page',
        category: 'Tutorial Basics',
        order: 1,
        originalContent: `
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
  `
    },
    {
        id: 'create-a-document',
        title: 'Create a Document',
        slug: 'create-a-document',
        category: 'Tutorial Basics',
        order: 2,
        originalContent: `
    <h2>Create a Document</h2>
    <p>Documents are <strong>groups of pages</strong> connected through:</p>
    <ul>
      <li>a <strong>sidebar</strong></li>
      <li><strong>previous/next navigation</strong></li>
      <li><strong>versioning</strong></li>
    </ul>

    <h2>Create your first Doc</h2>
    <p>Create a Markdown file at <code>docs/hello.md</code>:</p>
    <pre><code class="language-md"># Hello

This is my **first Docusaurus document**!</code></pre>
    <p>A new document is now available at <a href="http://localhost:3000/docs/hello">http://localhost:3000/docs/hello</a>.</p>

    <h2>Configure the Sidebar</h2>
    <p>Docusaurus automatically <strong>creates a sidebar</strong> from the <code>docs</code> folder.</p>
    <p>Add metadata to customize the sidebar label and position:</p>
    <pre><code class="language-md">---
sidebar_label: 'Hi!'
sidebar_position: 3
---

# Hello

This is my **first Docusaurus document**!</code></pre>
    <p>It is also possible to create your sidebar explicitly in <code>sidebars.js</code>:</p>
    <pre><code class="language-js">export default {
  tutorialSidebar: [
    'intro',
    'hello',
    {
      type: 'category',
      label: 'Tutorial',
      items: ['tutorial-basics/create-a-document'],
    },
  ],
};</code></pre>
  `
    },
    {
        id: 'create-a-blog-post',
        title: 'Create a Blog Post',
        slug: 'create-a-blog-post',
        category: 'Tutorial Basics',
        order: 3,
        originalContent: `
    <h2>Create a Blog Post</h2>
    <p>Docusaurus creates a <strong>page for each blog post</strong>, but also a <strong>blog index page</strong>, a <strong>tag system</strong>, an <strong>RSS</strong> feed...</p>

    <h2>Create your first Post</h2>
    <p>Create a file at <code>blog/2021-02-28-greetings.md</code>:</p>
    <pre><code class="language-md">---
slug: greetings
title: Greetings!
authors:
  - name: Joel Marcey
    title: Co-creator of Docusaurus 1
    url: https://github.com/JoelMarcey
    image_url: https://github.com/JoelMarcey.png
  - name: Sébastien Lorber
    title: Docusaurus maintainer
    url: https://sebastienlorber.com
    image_url: https://github.com/slorber.png
tags: [greetings]
---

Congratulations, you have made your first post!

Feel free to play around and edit this post as much as you like.</code></pre>
    <p>A new blog post is now available at <a href="http://localhost:3000/blog/greetings">http://localhost:3000/blog/greetings</a>.</p>
  `
    },
    {
        id: 'markdown-features',
        title: 'Markdown Features',
        slug: 'markdown-features',
        category: 'Tutorial Basics',
        order: 4,
        originalContent: `
    <h2>Markdown Features</h2>
    <p>Docusaurus supports <strong><a href="https://daringfireball.net/projects/markdown/syntax">Markdown</a></strong> and a few <strong>additional features</strong>.</p>

    <h2>Front Matter</h2>
    <p>Markdown documents have metadata at the top called <a href="https://jekyllrb.com/docs/front-matter/">Front Matter</a>:</p>
    <pre><code class="language-text">---
id: my-doc-id
title: My document title
description: My document description
slug: /my-custom-url
---

## Markdown heading

Markdown text with <a href="./hello.md">links</a></code></pre>

    <h2>Links</h2>
    <p>Regular Markdown links are supported, using url paths or relative file paths.</p>
    <p>Let's see how to <a href="/create-a-page">Create a page</a>.</p>
    <p>Let's see how to <a href="./create-a-page.md">Create a page</a>.</p>
    <p><strong>Result:</strong> Let's see how to <a href="./create-a-page.md">Create a page</a>.</p>

    <h2>Images</h2>
    <p>Regular Markdown images are supported.</p>
    <p>You can use absolute paths to reference images in the static directory (<code>static/img/docusaurus.png</code>):</p>
    <p><img src="/img/docusaurus.png" alt="Docusaurus logo" /></p>
    <p>You can reference images relative to the current file as well. This is particularly useful to colocate images close to the Markdown files using them:</p>
    <p><img src="./img/docusaurus.png" alt="Docusaurus logo" /></p>

    <h2>Code Blocks</h2>
    <p>Markdown code blocks are supported with Syntax highlighting.</p>
    <pre><code class="language-jsx">function HelloDocusaurus() {
  return <h1>Hello, Docusaurus!</h1>;
}</code></pre>

    <h2>Admonitions</h2>
    <p>Docusaurus has a special syntax to create admonitions and callouts:</p>
    <div class="admonition admonition-tip">
      <div class="admonition-heading"><h5>My tip</h5></div>
      <div class="admonition-content"><p>Use this awesome feature option</p></div>
    </div>
    <div class="admonition admonition-danger">
      <div class="admonition-heading"><h5>Take care</h5></div>
      <div class="admonition-content"><p>This action is dangerous</p></div>
    </div>

    <h2>MDX and React Components</h2>
    <p><a href="https://mdxjs.com/">MDX</a> can make your documentation more <strong>interactive</strong> and allows using any <strong>React components inside Markdown</strong>:</p>
    <pre><code class="language-jsx">export const Highlight = ({children, color}) => (
  <span
    style={{
      backgroundColor: color,
      borderRadius: '20px',
      color: '#fff',
      padding: '10px',
      cursor: 'pointer',
    }}
    onClick={() => {
      alert('You clicked the color ' + color + ' with label ' + children)
    }}>
    {children}
  </span>
);

This is <Highlight color="#25c2a0">Docusaurus green</Highlight> !

This is <Highlight color="#1877F2">Facebook blue</Highlight> !</code></pre>
  `
    },
    {
        id: 'deploy-your-site',
        title: 'Deploy your site',
        slug: 'deploy-your-site',
        category: 'Tutorial Basics',
        order: 5,
        originalContent: `
    <h2>Deploy your site</h2>
    <p>Docusaurus is a <strong>static-site-generator</strong> (also called <strong><a href="https://jamstack.org/">Jamstack</a></strong>).</p>
    <p>It builds your site as simple <strong>static HTML, JavaScript and CSS files</strong>.</p>

    <h2>Build your site</h2>
    <p>Build your site <strong>for production</strong>:</p>
    <pre><code class="language-bash">npm run build</code></pre>
    <p>The static files are generated in the <code>build</code> folder.</p>

    <h2>Deploy your site</h2>
    <p>Test your production build locally:</p>
    <pre><code class="language-bash">npm run serve</code></pre>
    <p>The <code>build</code> folder is now served at <a href="http://localhost:3000/">http://localhost:3000/</a>.</p>
    <p>You can now deploy the <code>build</code> folder <strong>almost anywhere</strong> easily, <strong>for free</strong> or very small cost (read the <strong><a href="https://docusaurus.io/docs/deployment">Deployment Guide</a></strong>).</p>
  `
    },
    {
        id: 'manage-docs-versions',
        title: 'Manage Docs Versions',
        slug: 'manage-docs-versions',
        category: 'Tutorial Extras',
        order: 1,
        originalContent: `
    <h2>Manage Docs Versions</h2>
    <p>Docusaurus can manage multiple versions of your docs.</p>

    <h2>Create a docs version</h2>
    <p>Release a version 1.0 of your project:</p>
    <pre><code class="language-bash">npm run docusaurus docs:version 1.0</code></pre>
    <p>The <code>docs</code> folder is copied into <code>versioned_docs/version-1.0</code> and <code>versions.json</code> is created.</p>
    <p>Your docs now have 2 versions:</p>
    <ul>
      <li><code>1.0</code> at <a href="http://localhost:3000/docs/">http://localhost:3000/docs/</a> for the version 1.0 docs</li>
      <li><code>current</code> at <a href="http://localhost:3000/docs/next/">http://localhost:3000/docs/next/</a> for the <strong>upcoming, unreleased docs</strong></li>
    </ul>

    <h2>Add a Version Dropdown</h2>
    <p>To navigate seamlessly across versions, add a version dropdown.</p>
    <p>Modify the <code>docusaurus.config.js</code> file:</p>
    <pre><code class="language-js">export default {
  themeConfig: {
    navbar: {
      items: [
        {
          type: 'docsVersionDropdown',
        },
      ],
    },
  },
};</code></pre>
    <p>The docs version dropdown appears in your navbar:</p>
    <p><img src="./img/docsVersionDropdown.png" alt="Docs Version Dropdown" /></p>

    <h2>Update an existing version</h2>
    <p>It is possible to edit versioned docs in their respective folder:</p>
    <ul>
      <li><code>versioned_docs/version-1.0/hello.md</code> updates <a href="http://localhost:3000/docs/hello">http://localhost:3000/docs/hello</a></li>
      <li><code>docs/hello.md</code> updates <a href="http://localhost:3000/docs/next/hello">http://localhost:3000/docs/next/hello</a></li>
    </ul>
  `
    },
    {
        id: 'translate-your-site',
        title: 'Translate your site',
        slug: 'translate-your-site',
        category: 'Tutorial Extras',
        order: 2,
        originalContent: `
    <h2>Translate your site</h2>
    <p>Let's translate <code>docs/intro.md</code> to French.</p>

    <h2>Configure i18n</h2>
    <p>Modify <code>docusaurus.config.js</code> to add support for the <code>fr</code> locale:</p>
    <pre><code class="language-js">export default {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
  },
};</code></pre>

    <h2>Translate a doc</h2>
    <p>Copy the <code>docs/intro.md</code> file to the <code>i18n/fr</code> folder:</p>
    <pre><code class="language-bash">mkdir -p i18n/fr/docusaurus-plugin-content-docs/current/

cp docs/intro.md i18n/fr/docusaurus-plugin-content-docs/current/intro.md</code></pre>
    <p>Translate <code>i18n/fr/docusaurus-plugin-content-docs/current/intro.md</code> in French.</p>

    <h2>Start your localized site</h2>
    <p>Start your site on the French locale:</p>
    <pre><code class="language-bash">npm run start -- --locale fr</code></pre>
    <p>Your localized site is accessible at <a href="http://localhost:3000/fr/">http://localhost:3000/fr/</a> and the <code>Getting Started</code> page is translated.</p>
    <div class="admonition admonition-caution">
      <div class="admonition-heading"><h5>Caution</h5></div>
      <div class="admonition-content"><p>In development, you can only use one locale at a time.</p></div>
    </div>

    <h2>Add a Locale Dropdown</h2>
    <p>To navigate seamlessly across languages, add a locale dropdown.</p>
    <p>Modify the <code>docusaurus.config.js</code> file:</p>
    <pre><code class="language-js">export default {
  themeConfig: {
    navbar: {
      items: [
        {
          type: 'localeDropdown',
        },
      ],
    },
  },
};</code></pre>
    <p>The locale dropdown now appears in your navbar:</p>
    <p><img src="./img/localeDropdown.png" alt="Locale Dropdown" /></p>

    <h2>Build your localized site</h2>
    <p>Build your site for a specific locale:</p>
    <pre><code class="language-bash">npm run build -- --locale fr</code></pre>
    <p>Or build your site to include all the locales at once:</p>
    <pre><code class="language-bash">npm run build</code></pre>
  `
    },
];

async function initializeDatabase() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        const db = await connectToDatabase();
        const tenantsCollection = db.collection<Tenant>(COLLECTIONS.TENANTS);
        
        const tenantId = process.env.DEFAULT_TENANT_ID || 'default-tenant';
        const existing = await tenantsCollection.findOne({ id: tenantId });
        
        if (!existing) {
            console.log('📝 Creating default tenant...');
            await tenantsCollection.insertOne({
                id: tenantId,
                name: 'Default Tenant',
                domain: 'default',
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            console.log('✅ Default tenant created successfully!');
        } else {
            console.log('ℹ️  Default tenant already exists.');
        }
        
        return { db, tenantId };
    } catch (error) {
        console.error('❌ Error initializing database:', error);
        throw error;
    }
}

async function seedLessons(db: any, tenantId: string) {
    try {
        const lessonsCollection = db.collection<Lesson>(COLLECTIONS.LESSONS);
        
        let created = 0;
        let skipped = 0;

        for (const lessonData of lessons) {
            const existingLesson = await lessonsCollection.findOne({ id: lessonData.id });
            
            if (existingLesson) {
                skipped++;
                continue;
            }

            await lessonsCollection.insertOne({
                id: lessonData.id,
                tenantId: tenantId,
                title: lessonData.title,
                slug: lessonData.slug,
                originalContent: lessonData.originalContent.trim(),
                summaryText: null,
                isSummaryGenerated: false,
                category: lessonData.category,
                order: lessonData.order,
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            created++;
        }

        if (created > 0) {
            console.log(`✅ Seeded ${created} lessons (${skipped} already existed)`);
        } else if (skipped > 0) {
            console.log(`ℹ️  All ${skipped} lessons already exist.`);
        }
    } catch (error) {
        console.error('❌ Error seeding lessons:', error);
        throw error;
    }
}

async function runInitialization() {
    try {
        console.log('🚀 Starting initialization...\n');
        
        // Step 1: Initialize database
        console.log('📦 Step 1: Initializing database...');
        const { db, tenantId } = await initializeDatabase();
        console.log('✅ Database initialized\n');
        
        // Step 2: Seed lessons
        console.log('📚 Step 2: Seeding topic lessons...');
        await seedLessons(db, tenantId);
        console.log('✅ Lessons seeded\n');
        
        // Note: We don't close the database connection here because:
        // 1. The server process will create its own connection
        // 2. Each Node process has its own connection pool
        // 3. Closing here would only affect this script's connection
        
        console.log('✅ Initialization complete!\n');
        return true;
    } catch (error) {
        console.error('❌ Initialization failed:', error);
        return false;
    }
}

function startServers() {
    console.log('🎯 Starting servers...\n');
    
    // Determine package manager
    const isPnpm = process.env.npm_config_user_agent?.includes('pnpm') || 
                   existsSync(join(projectRoot, 'pnpm-lock.yaml'));
    const pm = isPnpm ? 'pnpm' : 'npm';
    
    // Start server
    const serverProcess = spawn(pm, ['run', 'server'], {
        cwd: projectRoot,
        stdio: 'inherit',
        shell: true,
    });
    
    // Start Docusaurus
    const docusaurusProcess = spawn(pm, ['run', 'start:docusaurus'], {
        cwd: projectRoot,
        stdio: 'inherit',
        shell: true,
    });
    
    // Handle process termination
    const cleanup = () => {
        console.log('\n🛑 Shutting down servers...');
        serverProcess.kill();
        docusaurusProcess.kill();
        process.exit(0);
    };
    
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    
    // Handle errors
    serverProcess.on('error', (error) => {
        console.error('❌ Server process error:', error);
    });
    
    docusaurusProcess.on('error', (error) => {
        console.error('❌ Docusaurus process error:', error);
    });
}

async function main() {
    const success = await runInitialization();
    
    if (!success) {
        console.error('❌ Initialization failed. Exiting...');
        process.exit(1);
    }
    
    // Start servers
    startServers();
}

main();

