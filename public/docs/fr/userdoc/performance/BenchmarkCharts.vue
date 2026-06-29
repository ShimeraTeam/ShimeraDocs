<template>
  <div>
    <div class="chart-legend">
      <span><span class="legend-sq" style="background:#2a78d6"></span>OpenGL</span>
      <span><span class="legend-sq" style="background:#1baf7a"></span>Raylib</span>
      <span><span class="legend-sq" style="background:#eda100"></span>SFML</span>
    </div>

    <div class="benchmark-section">
      <h3>FPS moyen par effet - Quadro RTX 5000 <span class="badge">référence</span></h3>
      <div class="chart-wrap">
        <canvas ref="c1" role="img" aria-label="FPS par effet sur Quadro RTX 5000"></canvas>
      </div>
    </div>

    <div class="benchmark-section">
      <h3>FPS moyen par effet - RTX 5060 <span class="badge local">local</span></h3>
      <div class="chart-wrap">
        <canvas ref="c2" role="img" aria-label="FPS par effet sur RTX 5060"></canvas>
      </div>
    </div>

    <div class="benchmark-section">
      <h3>VRAM utilisée par effet - Quadro RTX 5000 (KB) <span class="badge">référence</span></h3>
      <div class="chart-wrap">
        <canvas ref="c3" role="img" aria-label="VRAM par effet sur Quadro RTX 5000"></canvas>
      </div>
    </div>

    <div class="benchmark-section">
      <h3>Comparaison GPU - baseline <code>no_effects</code></h3>
      <div class="chart-wrap" style="height:220px">
        <canvas ref="c4" role="img" aria-label="Comparaison FPS baseline entre les deux GPU"></canvas>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const c1 = ref<HTMLCanvasElement | null>(null)
const c2 = ref<HTMLCanvasElement | null>(null)
const c3 = ref<HTMLCanvasElement | null>(null)
const c4 = ref<HTMLCanvasElement | null>(null)

const EFFECTS_SHORT: string[] = [
  'no_effects', 'Brightness', 'Chromatic', 'Colortint', 'Contrast',
  'Distortion', 'GaussianBlur', 'Grayscale', 'Pixelisation',
  'Saturation', 'Vignette', 'C+Sat', 'C+G+Blur',
]

interface BackendData {
  opengl: (number | null)[]
  raylib: (number | null)[]
  sfml:   (number | null)[]
}

const fpsQuadro: BackendData = {
  opengl: [25510, 22123, 12919, 22123, 22123, 20080, 9416, 22222, 21645, 22026, 21834, 16778, 7898],
  raylib: [5257,  5086,  4849,  5446,  5376,  5091,  null, 5076,  4916,  5055,  null,  null,  null],
  sfml:   [null,  4480,  4452,  4911,  4743,  3965,  4019, 4582,  4633,  4625,  5010,  4930,  4006],
}

const fps5060: BackendData = {
  opengl: [5268, 5241, 4761, 5192, 4975, 5065, 4184, 5045, 4911, 4975, 3903, 4022, 3717],
  raylib: [3828, 4364, 4506, 4558, 4627, 4420, 3836, 4398, 4442, 4555, 3668, 3669, 3550],
  sfml:   [4472, 4918, 4887, 4699, 4984, 4366, 4599, 5064, 5030, 4882, 3950, 3770, 3733],
}

const vramQuadro: BackendData = {
  opengl: [13568, 13568, 13568, 13568, 13568, 14080, 16192, 13568, 13568, 13568, 13568, 13568, 16192],
  raylib: [6976,  6912,  6912,  6912,  6912,  6912,  null,  6912,  6912,  6912,  null,  null,  null],
  sfml:   [6656,  6656,  6656,  6656,  6656,  7168,  7936,  6656,  6656,  6656,  6656,  6656,  7936],
}

onMounted(async () => {
  if (typeof window === 'undefined') return

  let Chart = (window as any).Chart
  if (!Chart) {
    await new Promise<void>((resolve, reject) => {
      const s = document.createElement('script')
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js'
      s.onload = () => resolve()
      s.onerror = () => reject(new Error('Chart.js failed to load'))
      document.head.appendChild(s)
    })
    Chart = (window as any).Chart
  }

  const isDark = document.documentElement.classList.contains('dark')
  const gridColor = isDark ? '#2c2c2a' : '#e1e0d9'
  const textMuted = '#898781'
  const C = {
    opengl: isDark ? '#3987e5' : '#2a78d6',
    raylib: isDark ? '#199e70' : '#1baf7a',
    sfml:   isDark ? '#c98500' : '#eda100',
  }

  const baseOpts = (yLabel: string) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        ticks: { color: textMuted, font: { size: 10 }, maxRotation: 45, autoSkip: false },
        grid: { color: gridColor },
      },
      y: {
        title: { display: true, text: yLabel, color: textMuted, font: { size: 12 } },
        ticks: {
          color: textMuted,
          font: { size: 11 },
          callback: (v: number) => v >= 1000 ? Math.round(v / 1000) + 'k' : v,
        },
        grid: { color: gridColor },
      },
    },
  })

  const mkDs = (data: BackendData) => [
    { label: 'OpenGL', data: data.opengl, backgroundColor: C.opengl, borderRadius: 3 },
    { label: 'Raylib', data: data.raylib, backgroundColor: C.raylib, borderRadius: 3 },
    { label: 'SFML',   data: data.sfml,   backgroundColor: C.sfml,   borderRadius: 3 },
  ]

  if (c1.value) new Chart(c1.value, { type: 'bar', data: { labels: EFFECTS_SHORT, datasets: mkDs(fpsQuadro) }, options: baseOpts('FPS moyen') })
  if (c2.value) new Chart(c2.value, { type: 'bar', data: { labels: EFFECTS_SHORT, datasets: mkDs(fps5060)   }, options: baseOpts('FPS moyen') })
  if (c3.value) new Chart(c3.value, { type: 'bar', data: { labels: EFFECTS_SHORT, datasets: mkDs(vramQuadro)}, options: baseOpts('VRAM (KB)') })

  if (c4.value) {
    new Chart(c4.value, {
      type: 'bar',
      data: {
        labels: ['Quadro RTX 5000 (réf.)', 'RTX 5060 (local)'],
        datasets: [
          { label: 'OpenGL', data: [25510, 5268], backgroundColor: C.opengl, borderRadius: 3 },
          { label: 'Raylib', data: [5257,  3828], backgroundColor: C.raylib, borderRadius: 3 },
          { label: 'SFML',   data: [null,   4472], backgroundColor: C.sfml,  borderRadius: 3 },
        ],
      },
      options: baseOpts('FPS moyen (no_effects)'),
    })
  }
})
</script>

<style scoped>
.chart-legend {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin-bottom: 12px;
}
.chart-legend span {
  display: flex;
  align-items: center;
  gap: 5px;
}
.legend-sq {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  display: inline-block;
}
.benchmark-section {
  margin: 2rem 0;
}
.benchmark-section h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  gap: 8px;
}
.badge {
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}
.badge.local {
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
}
.chart-wrap {
  position: relative;
  width: 100%;
  height: 300px;
}
</style>