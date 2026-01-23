import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/ShimeraDevDoc/',
  title: 'Shimera Dev Doc',
  description: 'Documentation officielle multilingue',
  locales: {
    root: {
      lang: 'en-US',
      label: 'English',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Deployment & Environment', link: '/deployment/deployment' },
          { text: 'Library', link: '/library/fonctionnement_lib' },
          { text: 'POC', link: '/poc/opengl_injection' },
          { text: 'Quality & Testing', link: '/quality/testing_policy' },
          { text: 'Annexes', link: '/annexes/plan-action' }
        ],
        sidebar: {
          '/deployment/': [
            {
              text: '', items: [
                { text: 'Deployment', link: '/deployment/deployment' },
                { text: 'Technical Environment', link: '/deployment/technology_environment' },
                { text: 'Binary Types', link: '/deployment/binary' }
              ]
            }
          ],
          '/library/': [
            {
              text: '', items: [
                { text: 'Library Functionality', link: '/library/fonctionnement_lib' },
              ]
            }
          ],
          '/poc/': [
            {
              text: '', items: [
                { text: 'OpenGL Injection', link: '/poc/opengl_injection' },
              ]
            }
          ],
          '/quality/': [
            {
              text: '', items: [
                { text: 'Testing Policy', link: '/quality/testing_policy' },
                { text: 'Accessibility', link: '/quality/accessibility' },
              ]
            }
          ],
          '/annexes/': [
            {
              text: '', items: [
                { text: 'Action Plan', link: '/annexes/plan-action' },
                { text: 'Assets', link: '/annexes/assets' },
              ]
            }
          ],
        }
      }
    },
    fr: {
      lang: 'fr',
      label: 'French',
      themeConfig: {
        nav: [
          { text: 'Accueil', link: '/fr' },
          { text: 'Déploiement & Environnement', link: '/fr/deployment/deployment' },
          { text: 'Librairie', link: '/fr/library/fonctionnement_lib' },
          { text: 'POC', link: '/fr/poc/opengl_injection' },
          { text: 'Qualité & Tests', link: '/fr/quality/testing_policy' },
          { text: 'Annexes', link: '/fr/annexes/plan-action' }
        ],
        sidebar: {
          '/fr/deployment/': [
            {
              text: '', items: [
                { text: 'Déploiement', link: '/fr/deployment/deployment' },
                { text: 'Environnement Technique', link: '/fr/deployment/technology_environment' },
                { text: 'Types de binaires', link: '/fr/deployment/binary' }
              ]
            }
          ],
          '/fr/library/': [
            {
              text: '', items: [
                { text: 'Fonctionnement de la librairie', link: '/fr/library/fonctionnement_lib' },
              ]
            }
          ],
          '/fr/poc/': [
            {
              text: '', items: [
                { text: 'Injection OpenGL', link: '/fr/poc/opengl_injection' },
              ]
            }
          ],
          '/fr/quality/': [
            {
              text: '', items: [
                { text: 'Politique de test', link: '/fr/quality/testing_policy' },
                { text: 'Accéssibilité', link: '/fr/quality/accessibility' },
              ]
            }
          ],
          '/fr/annexes/': [
            {
              text: '', items: [
                { text: 'Plan d\'action', link: '/fr/annexes/plan-action' },
                { text: 'Assests', link: '/fr/annexes/assets' },
              ]
            }
          ],
        }
      }
    }
  }
})