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
          { text: 'Home', link: '/' },
          { text: 'Installation', link: '/installation' }
        ],
        sidebar: [
          {
            text: 'Shaders',
            items: [
              { text: 'Brightness', link: '/shaders/brightness' },
              { text: 'Contrast', link: '/shaders/contrast' },
              { text: 'Saturation', link: '/shaders/saturation' }
            ]
          }
        ],
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
          { text: 'Accueil', link: '/fr' },
          { text: 'Installation', link: '/fr/installation' }
        ],
        sidebar: [
          {
            text: 'Shaders',
            items: [
              { text: 'Luminosité', link: '/fr/shaders/brightness' },
              { text: 'Contraste', link: '/fr/shaders/contrast' },
              { text: 'Saturation', link: '/fr/shaders/saturation' }
            ]
          }
        ],
        socialLinks: [
          { icon: 'github', link: 'https://github.com/ShimeraTeam/Shimera' }
        ]
      }
    }
  }
})
