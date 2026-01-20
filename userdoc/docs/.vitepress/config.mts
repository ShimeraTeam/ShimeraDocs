import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/ShimeraDoc/',
  title: "ShimeraDoc",
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
            text: 'Getting Started',
            items: [
              { text: 'Installation', link: '/installation' }
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
            text: 'Démarrage',
            items: [
              { text: 'Installation', link: '/fr/installation' }
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
