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
          { text: 'Home', link: '/' }
        ],
        sidebar: {
          '/': [
            {
              text: 'Deployment & Environment',
              items: [
                { text: 'Deployment', link: '/deployment/deployment' },
                { text: 'Technical Environment', link: '/deployment/technology_environment' },
                { text: 'Binary Types', link: '/deployment/binary' }
              ]
            },
            {
              text: 'Library',
              items: [
                { text: 'Library Functionality', link: '/library/fonctionnement_lib' },
                { text: 'Abstraction Layer', link: '/library/abstraction_layer' },
                { text: 'Technology Comparative Briefs', link: '/library/technology_comparative_briefs' }
              ]
            },
            {
              text: 'POC',
              items: [
                { text: 'OpenGL Injection', link: '/poc/opengl_injection' },
                { text: 'Raylib', link: '/poc/raylib' },
                { text: 'Abstraction Layer: First Attempt', link: '/poc/old_abstraction_layer' }
              ]
            },
            {
              text: 'Quality & Testing',
              items: [
                { text: 'Testing Policy', link: '/quality/testing_policy' },
                { text: 'Code Standards', link: '/quality/code_standards' },
                { text: 'Git Hooks', link: '/quality/git_hooks' },
                { text: 'Accessibility', link: '/quality/accessibility' },
                { text: 'Branches', link: '/quality/branches' },
                { text: 'Commits', link: '/quality/commits' }
              ]
            },
            {
              text: 'Annexes',
              items: [
                { text: 'Action Plan', link: '/annexes/plan-action' },
                { text: 'Assets', link: '/annexes/assets' }
              ]
            }
          ]
        }
      }
    },
    fr: {
      lang: 'fr',
      label: 'French',
      themeConfig: {
        nav: [
          { text: 'Accueil', link: '/fr/' }
        ],
        sidebar: {
          '/fr/': [
            {
              text: 'Déploiement & Environnement',
              items: [
                { text: 'Déploiement', link: '/fr/deployment/deployment' },
                { text: 'Environnement Technique', link: '/fr/deployment/technology_environment' },
                { text: 'Types de binaires', link: '/fr/deployment/binary' }
              ]
            },
            {
              text: 'Librairie',
              items: [
                { text: 'Fonctionnement de la librairie', link: '/fr/library/fonctionnement_lib' },
                { text: "Couche d'abstraction", link: '/fr/library/abstraction_layer' },
                { text: 'Comparatifs technologiques', link: '/fr/library/technology_comparative_briefs' }
              ]
            },
            {
              text: 'POC',
              items: [
                { text: 'Injection OpenGL', link: '/fr/poc/opengl_injection' },
                { text: 'Raylib', link: '/fr/poc/raylib' },
                { text: "Couche d'abstraction : Première tentative", link: '/fr/poc/old_abstraction_layer' }
              ]
            },
            {
              text: 'Qualité & Tests',
              items: [
                { text: 'Politique de test', link: '/fr/quality/testing_policy' },
                { text: 'Standards de code', link: '/fr/quality/code_standards' },
                { text: 'Git Hooks', link: '/fr/quality/git_hooks' },
                { text: 'Accéssibilité', link: '/fr/quality/accessibility' },
                { text: 'Branches', link: '/fr/quality/branches' },
                { text: 'Commits', link: '/fr/quality/commits' }
              ]
            },
            {
              text: 'Annexes',
              items: [
                { text: 'Plan d\'action', link: '/fr/annexes/plan-action' },
                { text: 'Assests', link: '/fr/annexes/assets' }
              ]
            }
          ]
        }
      }
    }
  }
})