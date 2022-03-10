import mapProductVariantData from '../priceListFunks/mapProductVariantData'
import updateSelectedItem from '../priceListFunks/updateSelectedItem'

export default function mapProductListToButtons (arr, updateSelectedListsState) {
    let brandsMapped = arr.map((brandObj, i) => {
      if (brandObj.displayProducts === true) {
        let productArr = brandObj.hasProducts.map((product, j) => {
          if (product.displayVariants === undefined) {
            product.displayVariants = false
          }

          let displayProductVariantData = mapProductVariantData(
            product.variants
          )

          return (
            <div key={j}>
              <button
                onClick={e => {
                  e.preventDefault()
                  // console.log(
                  //   `You selected: ${product.price_parent_sku} ${product.price_product_name} , product.displayVariants: ${product.displayVariants}`
                  // )
                  updateSelectedItem(arr,product, j, i).then(res => updateSelectedListsState(res))
                }}
              >{`${product.price_parent_sku} ${product.price_product_name}`}</button>
              {product.displayVariants === false
                ? null
                : displayProductVariantData}
              {/* {mapProductVariantData(product.variants)} */}
            </div>
          )
        })
        return productArr
      }
      return
    })
    return brandsMapped
  }