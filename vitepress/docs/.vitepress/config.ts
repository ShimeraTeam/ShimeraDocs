import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Shimera Docs',
  description: 'Documentation officielle multilingue',
  locales: {
    root: {
      lang: 'fr',
      label: 'French',
      themeConfig: {
        nav: [
          { text: 'Accueil', link: '/' },
          { text: 'Déploiement & Environnement', link: '/deployment/deployment' },
          { text: 'Librairie', link: '/library/fonctionnement_lib' },
          { text: 'Qualité & Tests', link: '/quality/testing_policy' },
          { text: 'Annexes', link: '/annexes/plan-action' }
        ],
        sidebar: {
          '/deployment/': [
            {
              text: '', items: [
                { text: 'Déploiement', link: '/deployment/deployment' },
                { text: 'Environnement Technique', link: '/deployment/technology_environment' }
              ]
            }
          ],
          '/library/': [
            {
              text: '', items: [
                { text: 'Fonctionnement de la librairie', link: '/library/fonctionnement_lib' },
              ]
            }
          ],
          '/quality/': [
            {
              text: '', items: [
                { text: 'Politique de test', link: '/quality/testing_policy' },
                { text: 'Accéssibilité', link: '/quality/accessibility' },
              ]
            }
          ],
          '/annexes/': [
            {
              text: '', items: [
                { text: 'Plan d\'action', link: '/annexes/plan-action' },
                { text: 'Assests', link: '/annexes/assets' },
              ]
            }
          ],
        }
      }
    },
    en: {
      lang: 'en-US',
      label: 'English',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/en' },
          { text: 'Deployment & Environment', link: '/en/deployment/deployment' },
          { text: 'Library', link: '/en/library/fonctionnement_lib' },
          { text: 'Quality & Testing', link: '/en/quality/testing_policy' },
          { text: 'Annexes', link: '/en/annexes/plan-action' }
        ],
        sidebar: {
          '/en/deployment/': [
            {
              text: '', items: [
                { text: 'Deployment', link: '/en/deployment/deployment' },
                { text: 'Technical Environment', link: '/en/deployment/technology_environment' }
              ]
            }
          ],
          '/en/library/': [
            {
              text: '', items: [
                { text: 'Library Functionality', link: '/en/library/fonctionnement_lib' },
              ]
            }
          ],
          '/en/quality/': [
            {
              text: '', items: [
                { text: 'Testing Policy', link: '/en/quality/testing_policy' },
                { text: 'Accessibility', link: '/en/quality/accessibility' },
              ]
            }
          ],
          '/en/annexes/': [
            {
              text: '', items: [
                { text: 'Action Plan', link: '/en/annexes/plan-action' },
                { text: 'Assets', link: '/en/annexes/assets' },
              ]
            }
          ],
        }
      }
    }
  }
})