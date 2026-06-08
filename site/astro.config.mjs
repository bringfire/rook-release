// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// Deployed to GitHub Pages under https://bringfire.github.io/rook-release/
// so the base path must be "/rook-release/". When you later attach a custom
// domain (e.g. docs.bringfiregames.com) set base back to "/" and update `site`.
const SITE = 'https://bringfire.github.io';
const BASE = '/rook-release/';

// https://astro.build/config
export default defineConfig({
  site: SITE,
  base: BASE,
  // Trailing slashes keep relative asset URLs stable under a base path.
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'Rook',
      description:
        'AI agents for Rhino 3D and Grasshopper. 392 MCP tools. Works with any LLM provider.',
      logo: {
        light: './src/assets/rook-raven.svg',
        dark: './src/assets/rook-raven.svg',
        alt: 'Rook',
        replacesTitle: false,
      },
      favicon: '/favicon.svg',
      // Code blocks: the site is visually forced to light, so pin Expressive
      // Code to a single light theme (otherwise it follows data-theme and can
      // render pale-on-light). The copy-to-clipboard button is built in.
      expressiveCode: {
        themes: ['github-light'],
        styleOverrides: {
          borderColor: 'rgba(26,20,16,0.18)',
          borderRadius: '3px',
        },
      },
      // The folio aesthetic — loaded after Starlight's own styles so our
      // token overrides win. See src/styles/rook.css.
      customCss: ['./src/styles/fonts.css', './src/styles/rook.css'],
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/bringfire/rook-release',
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/bringfire/rook-release/edit/main/',
      },
      lastUpdated: true,
      sidebar: [
        {
          label: 'Start Here',
          items: [
            { label: 'What is Rook', slug: 'start/what-is-rook' },
            { label: 'Install Rook', slug: 'start/install' },
            { label: 'Set Up & Verify', slug: 'start/setup-verify' },
            { label: 'Your First Conversation', slug: 'start/first-conversation' },
          ],
        },
        {
          label: 'The Rook Plugin',
          items: [
            { label: 'Plugin Overview', slug: 'plugin/overview' },
            { label: 'Skills That Ship', slug: 'plugin/skills' },
            { label: 'Claude Code & Desktop', slug: 'plugin/claude' },
            { label: 'Codex & Other Clients', slug: 'plugin/codex' },
          ],
        },
        {
          label: 'Working with Rook',
          items: [
            { label: 'How to Ask for Things', slug: 'working/asking-rook' },
            { label: 'Everyday Tasks', slug: 'working/everyday-tasks' },
          ],
        },
        {
          label: 'Modeling',
          items: [
            { label: 'All Capabilities', slug: 'modules/overview' },
            { label: 'Rhino Geometry', slug: 'modules/rhino-geometry' },
            { label: 'Grasshopper', slug: 'modules/grasshopper' },
            { label: 'The Design Cascade', slug: 'modules/design-cascade' },
            { label: 'Scene Graph', slug: 'modules/scene-graph' },
          ],
        },
        {
          label: 'Intelligence',
          items: [
            { label: 'Knowledge Graph', slug: 'modules/knowledge-graph' },
            { label: 'Chirp', slug: 'modules/chirp' },
            { label: 'Multi-Agent', slug: 'modules/multi-agent' },
            { label: 'Model-Agnostic', slug: 'modules/model-agnostic' },
            { label: 'Many Providers', slug: 'modules/multi-provider' },
          ],
        },
        {
          label: 'Vision & Media',
          items: [
            { label: 'RookVision', slug: 'modules/rookvision' },
            { label: 'Image Round-Trip', slug: 'modules/image-round-trip' },
            { label: 'Director', slug: 'modules/director' },
          ],
        },
        {
          label: 'From 2D to 3D',
          items: [
            { label: 'Hunyuan 3D', slug: 'modules/hunyuan-3d' },
            { label: '3D Pipeline', slug: 'modules/3d-pipeline' },
            { label: 'RookSplat', slug: 'modules/rooksplat' },
          ],
        },
        {
          label: 'BIM & Ecosystem',
          items: [
            { label: 'RookBIM', slug: 'modules/rookbim' },
            { label: 'The Ecosystem', slug: 'modules/ecosystem' },
          ],
        },
        {
          label: 'Showcase',
          items: [{ label: 'Gallery', slug: 'showcase/gallery' }],
        },
        {
          label: 'Going Deeper',
          items: [
            { label: 'Under the Hood', slug: 'deeper/under-the-hood' },
            { label: 'Troubleshooting', slug: 'deeper/troubleshooting' },
          ],
        },
        {
          label: 'Legal',
          items: [{ label: 'Privacy Policy', slug: 'legal/privacy' }],
        },
      ],
    }),
  ],
});
