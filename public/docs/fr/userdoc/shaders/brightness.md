# Shader de Luminosité

**Fichier :** `res/shader/postprocessing/brightness.frag`

## Description
Ajuste la luminosité de l'image rendue en ajoutant ou soustrayant une valeur uniforme à toutes les composantes de couleur.

## Paramètres
| Valeur | Effet |
|--------|--------|
| `< 0.0` | Image plus sombre (ex: -0.2 = 20% plus sombre) |
| `0.0` | Luminosité originale (aucun changement) |
| `> 0.0` | Image plus claire (ex: +0.2 = 20% plus claire) |

## Détails Techniques
- Le shader ajoute la valeur de luminosité directement à chaque composante RGB
- Les résultats sont limités à la plage valide `[0.0, 1.0]` pour éviter le débordement de couleur
- Le canal alpha est préservé de l'image originale

## Exemple d'Utilisation

```cpp
// Définir la luminosité à +0.2 (20% plus clair)
glUniform1f(brightnessLocation, 0.2f);

// Définir la luminosité à -0.3 (30% plus sombre)
glUniform1f(brightnessLocation, -0.3f);

// Définir la luminosité à 0.0 (aucun changement)
glUniform1f(brightnessLocation, 0.0f);
```