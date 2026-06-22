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
                    { text: 'Index', link: '/userdoc/shaders/index' },
                    { text: 'Brightness', link: '/userdoc/shaders/brightness' },
                    { text: 'Chromatic Aberration', link: '/userdoc/shaders/chromatic_aberration' },
                    { text: 'Colorshift', link: '/userdoc/shaders/colorshift' },
                    { text: 'Contrast', link: '/userdoc/shaders/contrast' },
                    { text: 'Distortion', link: '/userdoc/shaders/distortion' },
                    { text: 'Gaussian Blur', link: '/userdoc/shaders/gaussian_blur' },
                    { text: 'Grayscale', link: '/userdoc/shaders/grayscale' },
                    { text: 'Saturation', link: '/userdoc/shaders/saturation' },
                    { text: 'Vignette', link: '/userdoc/shaders/vignette' }
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
                    { text: 'Index', link: '/fr/userdoc/shaders/index' },
                    { text: 'Brightness', link: '/fr/userdoc/shaders/brightness' },
                    { text: 'Chromatic Aberration', link: '/fr/userdoc/shaders/chromatic_aberration' },
                    { text: 'Colorshift', link: '/fr/userdoc/shaders/colorshift' },
                    { text: 'Contrast', link: '/fr/userdoc/shaders/contrast' },
                    { text: 'Distortion', link: '/fr/userdoc/shaders/distortion' },
                    { text: 'Gaussian Blur', link: '/fr/userdoc/shaders/gaussian_blur' },
                    { text: 'Grayscale', link: '/fr/userdoc/shaders/grayscale' },
                    { text: 'Saturation', link: '/fr/userdoc/shaders/saturation' },
                    { text: 'Vignette', link: '/fr/userdoc/shaders/vignette' }
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
