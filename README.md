# Tiexo Marketplace monorepo

## Styling rules:

### Naming
  * folder: `/forder-name/`
  * component: `my-component.tsx` and component: `MyComponent.tsx`
  * styles: `my-component.style.ts`
  * stories: `my-component.stories.tsx`
  * helpers: `my-cool-helper.ts`
  * pages: `my-page.tsx`

### Grouping
* each component should be in separate folder and should contains the folowing:
   * component itself: `MyComponent.tsx`
   * the style: `MyComponent.style.ts`
   * story book file (optional): `mycomponent.stories.tsx`
   * subfolder with dependent components: `component/`
* global folder for `helpers`, `styles` etc.

#### Next.js grouping exceptions:
* each page component should have a folder in `/pages` where the folder name is path where to find the page: `/pages/marketplace`, this folder will contain:
* component: `MarketplacePage.tsx`
* style file should be prefixed with `_`: `_Marketplace.style.ts`
* create an `index.ts` file to reexport the Component (next.js need an index.ts file to render the page)
```
import MarketplacePage from './MarketplacePage'
export default MarketplacePage

```

### Component structure

```
import useLocalStyles from './MyComponent.style.ts'
import useGlobalStyles from '../../styles/helpers'


interface IMyComponentProps {
  data?: string
}

const MyComponent: React.FC<IMyComponentProps> = (props: IMyComponentProps) {
  const localStyle = useLocalStyles()
  const globalStyle = useGLobalStyles()
  
  return (
    <div className={globalStyle.title}>my component</div>
  )
}

export default MyComponent

```
