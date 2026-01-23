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
        ],
        sidebar: [
          {
            text: 'Shaders',
            items: [
              { text: 'Contrast', link: '/shaders/contrast' }
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
        ],
        sidebar: [
          {
            text: 'Shaders',
            items: [
              { text: 'Contraste', link: '/fr/shaders/contrast' }
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
