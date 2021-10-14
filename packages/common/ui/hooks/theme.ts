import { ThemeContext } from '@emotion/react'
import { useContext } from 'react'
import { Theme } from '@mui/material'

/**
 * get current theme
 * @returns
 */
export const useTheme = (): Theme => {
    return useContext(ThemeContext) as Theme
}

/**
 * inject current theme in an existing style
 * @param style
 * @returns
 */
export const createUseStyle = <T extends { [className: string]: string }, Props>(
    styles: T | ((theme: Theme, props?: Props) => T)
) => (props?: Props): T => {
    if (typeof styles === 'function') {
        return styles(useTheme(), props)
    } else if (typeof styles === 'object') {
        return styles
    } else {
        throw new Error('Unsupported styles format. Styles can be an object or a function.')
    }
}
