# Git Hooks

## Introduction

Les Git hooks sont des scripts qui s’exécutent automatiquement à certains moments du workflow Git.  
Ils peuvent être utilisés pour appliquer des standards de codage, lancer des tests ou automatiser d’autres tâches avant ou après certaines actions Git, comme les commits ou les pushs.

Cependant, les hooks natifs présentent des limitations : ils ne sont pas versionnés avec le dépôt, ce qui rend leur partage et leur maintenance difficiles au sein d’une équipe.

**pre-commit** est un framework qui permet de gérer et maintenir des hooks pré-commit multi-langages.  
Il permet de définir les hooks dans un fichier de configuration, qui peut ensuite être partagé entre tous les membres de l’équipe.

## Pourquoi utiliser pre-commit ?

L’utilisation de pre-commit présente plusieurs avantages :

- **Cohérence** : garantit que tous les membres de l’équipe exécutent les mêmes vérifications avant de valider du code.  
- **Automatisation** : automatise les tâches répétitives, réduisant le risque d’erreurs humaines.  
- **Versionnement** : les hooks sont stockés dans le dépôt, ce qui facilite leur partage et leur mise à jour.  
- **Support multi-langage** : prend en charge des hooks écrits dans différents langages de programmation.

## Configuration de pre-commit

### Prérequis

- Python 3.6 ou supérieur  
- pip (gestionnaire de paquets Python)  
- Git

---

### Installer pre-commit

Installez pre-commit avec pip :

```bash
pip install pre-commit
```
Puis vérifiez l’installation :

```bash
pre-commit --version
```

### Activer les hooks dans votre dépôt

Naviguez jusqu’à votre dépôt Git et exécutez :

```bash
pre-commit install
```
Cette commande configure les hooks Git pour utiliser pre-commit.

### Première exécution

Pour exécuter les hooks sur tous les fichiers (et pas seulement ceux mis en scène), utilisez :

```bash
pre-commit run --all-files
```

Cela est utile lors de la première configuration pour s’assurer que l’ensemble du code existant respecte les hooks définis.

### Désactiver les hooks
Si vous souhaitez désactiver temporairement les hooks pre-commit, vous pouvez utiliser l’option `--no-verify` lors de vos commandes Git, par exemple :

```bash
git commit --no-verify -m "Votre message de commit"
```
