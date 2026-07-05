import { defineComponent, h, nextTick, onMounted, watch } from 'vue';
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { useData } from 'vitepress';
import { createMermaidRenderer } from 'vitepress-mermaid-renderer';

export default {
  extends: DefaultTheme,
  Layout: defineComponent({
     setup() {
       const { isDark } = useData();

      const initMermaid = () => {
          if (typeof window === 'undefined') return;

      createMermaidRenderer({
           theme: isDark.value ? 'dark' : 'default',
         });
       };

    onMounted(initMermaid);
       watch(
         () => isDark.value,
         initMermaid,
         { flush: 'post' },
       );
       return () => h(DefaultTheme.Layout);
     },
   }),
} satisfies Theme;
