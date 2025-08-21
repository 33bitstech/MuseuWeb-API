/**
 * Cria um novo objeto contendo apenas as chaves especificadas de um objeto de origem.
 * @param obj O objeto de origem.
 * @param keys Um array com as chaves a serem selecionadas.
 */
export default function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>
    keys.forEach(key => {
        if (key in obj) {
            result[key] = obj[key]
        }
    })
    return result
}