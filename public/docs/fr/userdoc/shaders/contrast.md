# Shader de Contraste

**Fichier :** `res/shader/postprocessing/contrast.frag`

## Description
Ajuste le contraste de l'image rendue en ajustant la distance de chaque composante de couleur par rapport au gris moyen (0.5).

## Paramètres
| Valeur | Effet |
|--------|--------|
| `0.0` | Aucun contraste (gris uniforme) |
| `1.0` | Contraste original (aucun changement) |
| `> 1.0` | Contraste augmenté |

## Détails Techniques
- Le shader utilise 0.5 comme point pivot pour l'ajustement du contraste
- Les résultats sont limités à la plage valide `[0.0, 1.0]` pour éviter le débordement de couleur
- Le canal alpha est préservé de l'image originale

## Exemple d'Utilisation

```cpp
// Définir le contraste à 1.5 (50% de contraste en plus)
glUniform1f(contrastLocation, 1.5f);

// Définir le contraste à 0.5 (50% de contraste en moins)
glUniform1f(contrastLocation, 0.5f);

// Définir le contraste à 0.0 (aucun contraste - gris)
glUniform1f(contrastLocation, 0.0f);
```
