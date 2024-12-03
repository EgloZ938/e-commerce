// Bubble Sort
function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // Swap
            }
        }
    }
    return arr;
}

// Quick Sort
function quickSort(arr) {
    if (arr.length <= 1) return arr;
    const pivot = arr[arr.length - 1];
    const left = arr.filter(el => el < pivot);
    const right = arr.filter(el => el > pivot);
    return [...quickSort(left), pivot, ...quickSort(right)];
}

// Native Sort
function nativeSort(arr) {
    return arr.sort((a, b) => a - b);
}

module.exports = { bubbleSort, quickSort, nativeSort };


/**
 * Ce module implémente différentes méthodes de tri proposées par l'IA :
 * 
 * 1. **Bubble Sort** : 
 *    - Un algorithme de tri simple basé sur des comparaisons successives de paires d'éléments adjacents.
 *    - Si les éléments ne sont pas dans le bon ordre, ils sont échangés.
 *    - Complexité temporelle : O(n^2) dans le pire et le cas moyen, O(n) dans le meilleur cas (tableau déjà trié).
 *    - Utilisé principalement pour des démonstrations ou des jeux éducatifs en raison de son inefficacité sur les grandes données.
 * 
 * 2. **Quick Sort** : 
 *    - Un algorithme de tri rapide utilisant le paradigme "diviser pour régner".
 *    - Choisit un pivot, puis partitionne les éléments en deux sous-listes : les éléments inférieurs et supérieurs au pivot.
 *    - Très performant et souvent utilisé dans les bibliothèques standard.
 * 
 * 3. **Native Sort** :
 *    - Utilise la méthode `Array.prototype.sort()` native de JavaScript avec une fonction de comparaison personnalisée.
 * 
 * Ces trois méthodes illustrent différentes approches de tri, allant d'algorithmes éducatifs à des solutions optimisées
 * pour des environnements de production.
 */