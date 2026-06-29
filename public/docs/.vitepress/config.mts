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
                { text: 'Performances', link: '/userdoc/performances/benchmark'},
                {
                  text: 'Shaders',
                  items: [
                    { text: 'Index', link: '/userdoc/shaders/index' },
                    { text: 'Brightness', link: '/userdoc/shaders/brightness' },
                    { text: 'Chromatic Aberration', link: '/userdoc/shaders/chromatic_aberration' },
                    { text: 'Colorshift', link: '/userdoc/shaders/colorshift' },
                    { text: 'Contrast', link: '/userdoc/shaders/contrast' },
                    { text: 'Distortion', link: '/userdoc/shaders/distortion' },
                    { text: 'Gaussian Blur', link: '/userdoc/shaders/gaussian_blur' },
                    { text: 'Grayscale', link: '/userdoc/shaders/grayscale' },
                    { text: 'Saturation', link: '/userdoc/shaders/saturation' },
                    { text: 'Vignette', link: '/userdoc/shaders/vignette' },
                    { text: 'Pixelisation', link: '/userdoc/shaders/pixelisation' }
                  ]
                }
              ]
            }
          ],
          '/devdoc/': [
            {
              text: 'DevDoc',
              items: [
                { text: 'Git Workflow', link: '/devdoc/git_workflow' },
                { text: 'Architecture', link: '/devdoc/architecture/technical_architecture' },
                {
                  text: 'Testing',
                  items: [
                    { text: 'Index', link: '/devdoc/testing/index' },
                    { text: 'Testing Guide', link:'/devdoc/testing/testing_guide' }
                  ]
                },
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
                { text: 'Performances', link: '/fr/userdoc/performances/benchmark'},
                {
                  text: 'Shaders',
                  items: [
                    { text: 'Index', link: '/fr/userdoc/shaders/index' },
                    { text: 'Brightness', link: '/fr/userdoc/shaders/brightness' },
                    { text: 'Chromatic Aberration', link: '/fr/userdoc/shaders/chromatic_aberration' },
                    { text: 'Colorshift', link: '/fr/userdoc/shaders/colorshift' },
                    { text: 'Contrast', link: '/fr/userdoc/shaders/contrast' },
                    { text: 'Distortion', link: '/fr/userdoc/shaders/distortion' },
                    { text: 'Gaussian Blur', link: '/fr/userdoc/shaders/gaussian_blur' },
                    { text: 'Grayscale', link: '/fr/userdoc/shaders/grayscale' },
                    { text: 'Saturation', link: '/fr/userdoc/shaders/saturation' },
                    { text: 'Vignette', link: '/fr/userdoc/shaders/vignette' },
                    { text: 'Pixelisation', link: '/fr/userdoc/shaders/pixelisation' }
                  ]
                }
              ]
            }
          ],
          '/fr/devdoc/': [
            {
              text: 'DevDoc',
              items: [
                { text: 'Git Workflow', link: '/fr/devdoc/git_workflow' },
                { text: 'Architecture', link: '/fr/devdoc/architecture/technical_architecture' },
                {
                  text: 'Tests',
                  items: [
                    { text: 'Index', link: '/fr/devdoc/testing/index' },
                    { text: 'Guide de test', link:'/fr/devdoc/testing/testing_guide' }
                  ]
                },
              ],
            },
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
