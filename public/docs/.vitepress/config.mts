import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/ShimeraDocs/',
  title: "ShimeraDocs",
  description: "Shimera Official Documentation",
  locales: {
    root: {
      lang: 'en-US',
      label: 'English',
      themeConfig: {
        nav: [
          { text: 'UserDoc', link: '/userdoc/' },
          { text: 'DevDoc', link: '/devdoc/' }
        ],
        sidebar: {
          '/userdoc/': [
            {
              text: 'UserDoc',
              items: [
                { text: 'Installation', link: '/userdoc/installation' },
                {
                  text: 'Shaders',
                  items: [
                    { text: 'Brightness', link: '/userdoc/shaders/brightness' },
                    { text: 'Contrast', link: '/userdoc/shaders/contrast' },
                    { text: 'Saturation', link: '/userdoc/shaders/saturation' }
                  ]
                }
              ]
            }
          ],
          '/devdoc/': [
            {
              text: 'DevDoc',
              items: [
                { text: 'Architecture', link: '/devdoc/architecture/technical_architecture' },
                { text: 'Code Standards', link: '/devdoc/code_standards' },
              ]
            }
          ]
        },
        socialLinks: [
          { icon: 'github', link: 'https://github.com/ShimeraTeam/Shimera' }
        ]
      }
    },
    fr: {
      lang: 'fr',
      label: 'French',
      themeConfig: {
        nav: [
          { text: 'UserDoc', link: '/fr/userdoc/' },
          { text: 'DevDoc', link: '/fr/devdoc/' }
        ],
        sidebar: {
          '/fr/userdoc/': [
            {
              text: 'UserDoc',
              items: [
                { text: 'Installation', link: '/fr/userdoc/installation' },
                {
                  text: 'Shaders',
                  items: [
                    { text: 'Luminosité', link: '/fr/userdoc/shaders/brightness' },
                    { text: 'Contraste', link: '/fr/userdoc/shaders/contrast' },
                    { text: 'Saturation', link: '/fr/userdoc/shaders/saturation' }
                  ]
                }
              ]
            }
          ],
          '/fr/devdoc/': [
            {
              text: 'DevDoc',
              items: [
                { text: 'Architecture', link: '/fr/devdoc/architecture/technical_architecture' },
                { text: 'Standards de code', link: '/fr/devdoc/code_standards' },
              ]
            }
          ]
        },
        socialLinks: [
          { icon: 'github', link: 'https://github.com/ShimeraTeam/Shimera' }
        ]
      }
    }
  }
})
