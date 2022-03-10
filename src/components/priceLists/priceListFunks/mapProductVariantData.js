export default function mapProductVariantData (variants) {
    let variantList = variants.map((option, i) => {
    //   let inCart = () => {
    //     let isInCart = props.cartItems.find(el => el.fullSKU === option.fullSKU)
    //     return isInCart === undefined ? `Add to Cart` : 'Remove'
    //   }
      return (
        <div key={i}>
          {option.fullSKU} - {option.upc_color} {option.upc_size}
          <button
            onClick={e => {
              e.preventDefault()
            //   props.addToCart(option)
            }}
          >
            {/* {inCart()} */}
          </button>
        </div>
      )
    })
    return variantList
  }