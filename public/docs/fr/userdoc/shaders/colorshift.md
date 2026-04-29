# Shader de Décalage de Couleur

**Fichier :** `res/shader/postprocessing/colorshift.frag`

## Description
Applique un effet de décalage de couleur à l'image rendue en mélangeant les couleurs originales avec un vecteur de décalage de couleur uniforme, créant une apparence teintée/filtrée.

## Paramètres
| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `colorShift` | `vec3` | - | Valeurs de décalage de couleur RGB à mélanger avec l'image originale (plage : 0.0 - 1.0 par composante) |

## Détails Techniques
- Le shader mélange la couleur originale avec la couleur de décalage en utilisant un mélange 50/50 : `(original + décalage) / 2.0`
- Chaque composante RGB peut aller de `0.0` à `1.0`
- Le canal alpha est préservé de l'image originale
- Des valeurs plus élevées dans le vecteur de décalage pousseront les couleurs vers ce canal, créant une teinte dominante

## Exemple d'Utilisation

```cpp
// Obtenir l'emplacement de l'uniform
GLint colorShiftLocation = glGetUniformLocation(shaderProgram, "colorShift");

// Ton chaud (orange/sépia)
glUniform3f(colorShiftLocation, 0.8f, 0.5f, 0.2f);

// Ton froid (bleu/cyan)
glUniform3f(colorShiftLocation, 0.2f, 0.5f, 0.8f);

// Ton vert
glUniform3f(colorShiftLocation, 0.2f, 0.8f, 0.3f);

// Neutre (aucun décalage)
glUniform3f(colorShiftLocation, 0.5f, 0.5f, 0.5f);
```