import style from '../attributes-selectors/style'
import useStyle from './nft-preview.style'

interface IProps {
    images: string[]
}

const NftPreview: React.FC<IProps> = ({ images }: IProps) => {
    const styles = useStyle()
    return (
        <div className={styles.root}>
            {images.map((image, index) => (
                <img
                    key={`image-${index}`}
                    alt={`image-${index}`}
                    src={image}
                    className={[styles.image, index > 0 ? styles.absolute : ''].join(' ')}
                />
            ))}
        </div>
    )
}

export default NftPreview
