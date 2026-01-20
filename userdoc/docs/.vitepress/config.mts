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
        socialLinks: [
          { icon: 'github', link: 'https://github.com/ShimeraTeam/Shimera' }
        ]
      }
    }
  }
})
