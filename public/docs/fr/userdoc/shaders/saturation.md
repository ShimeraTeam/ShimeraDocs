# Shader de Saturation

**Fichier :** `res/shader/postprocessing/saturation.frag`

## Description
Ajuste la saturation des couleurs de l'image rendue en interpolant entre une version en niveaux de gris et les couleurs originales.

## Paramètres
| Valeur | Effet |
|--------|--------|
| `0.0` | Complètement désaturé (niveaux de gris) |
| `1.0` | Couleurs originales (aucun changement) |
| `> 1.0` | Couleurs sursaturées |

## Détails Techniques
- Utilise les coefficients de luminance **ITU-R BT.709** pour le calcul de la luminance : `(0.2126, 0.7152, 0.0722)`
- Ce standard est recommandé pour le contenu HD et les écrans modernes (espace colorimétrique sRGB)
- Le shader préserve le canal alpha de l'image originale

## Exemple d'Utilisation

```cpp
// Définir la saturation à 0.5 (50% désaturé)
glUniform1f(saturationLocation, 0.5f);

// Définir la saturation à 0.0 (niveaux de gris)
glUniform1f(saturationLocation, 0.0f);

// Définir la saturation à 2.0 (très saturé)
glUniform1f(saturationLocation, 2.0f);
```
