import { useEffect } from 'react'

export function useEffectAsync(effect: () => Promise<void>, inputs: any[]) {
    useEffect(() => {
        effect()
    }, inputs)
}

export default useEffectAsync
