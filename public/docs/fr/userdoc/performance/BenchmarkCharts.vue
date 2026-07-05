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
      <h3>Comparaison GPU - moyenne tous effets confondus</h3>
      <div class="chart-wrap" style="height:220px">
        <canvas ref="c4" role="img" aria-label="Comparaison FPS moyenne entre les deux GPU"></canvas>
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

// Ordre commun à tous les graphes. `null` = effet non supporté / non testé
// sur ce backend (voir notes sous les tableaux : Atmospheric non implémenté
// sur OpenGL, Fresnel/Atmospheric non applicables sur SFML, GaussianBlur/
// HDRBloom cassés sur Raylib+Quadro).
const EFFECTS_SHORT: string[] = [
  'no_effects', 'Brightness', 'Atmospheric', 'Chromatic', 'Colortint',
  'Contrast', 'Distortion', 'Fresnel', 'GaussianBlur', 'Grayscale',
  'HDRBloom', 'Pixelisation', 'Saturation', 'Vignette', 'C+Sat', 'C+G+Blur',
]

interface BackendData {
  opengl: (number | null)[]
  raylib: (number | null)[]
  sfml:   (number | null)[]
}

const fpsQuadro: BackendData = {
  opengl: [5040, 5000, null,  4344, 5010, 4995, 4995, 4950, 3961, 4980, 3333, 4965, 4965, 5010, 4945, 3591],
  raylib: [5567, 5393, 4873,  5020, 5630, 5630, 5382, 5701, null, 5208, null, 5102, 5133, 5452, null, null],
  sfml:   [583,  4480, null,  4452, 4911, 4743, 3965, null, 4019, 4633, 3591, 4633, 4604, 5010, 4930, 4006],
}

const fps5060: BackendData = {
  opengl: [6090, 5186, null,    4761,   4591,   4975,    4878,   4703, 4145,    5045,   4012, 4955,    5149,   3918, 3996, 3819],
  raylib: [3620, 4374, 3017,    4505.8, 4557.9, 4627.2,  4419.8, 5005, 3676,    4863,   3687, 4295,    4555,   3657, 3940, 3337],
  sfml:   [4599, 4926, null,    4887,   4699,   4984.15, 4374,   null, 4599.27, 5064.4, 4022, 5030.17, 4881.8, 3897, 3891, 3732.5],
}

const vramQuadro: BackendData = {
  opengl: [0,    13568, null, 13568, 13568, 13568, 14080, 0,    16192, 13568, 16192, 13568, 13568, 13568, 13568, 16192],
  raylib: [6912, 6912,  4096, 6912,  6912,  6912,  6912,  4096, null,  6912,  null,  6912,  6912,  6912,  null,  null],
  sfml:   [0,    6656,  null, 6656,  6656,  6656,  7168,  null, 7936,  6656,  7936,  6656,  6656,  6656,  6656,  7936],
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

  // Comparaison générale : FPS moyen tous effets confondus, par backend et par GPU
  // (remplace l'ancienne comparaison limitée à no_effects, peu représentative)
  if (c4.value) {
    new Chart(c4.value, {
      type: 'bar',
      data: {
        labels: ['Quadro RTX 5000 (réf.)', 'RTX 5060 (local)'],
        datasets: [
          { label: 'OpenGL', data: [4672, 4682], backgroundColor: C.opengl, borderRadius: 3 },
          { label: 'Raylib', data: [5341, 4134], backgroundColor: C.raylib, borderRadius: 3 },
          { label: 'SFML',   data: [4183, 4542], backgroundColor: C.sfml,  borderRadius: 3 },
        ],
      },
      options: baseOpts('FPS moyen (tous effets)'),
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