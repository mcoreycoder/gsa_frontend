export default async function updateSelectedItem  (arr, product, productIndex, brandIndex)  {
    product.displayVariants = !product.displayVariants
    let updateSelectedLists = [...arr]
    let productArr = arr[brandIndex].hasProducts
    productArr[productIndex] = product
    updateSelectedLists[brandIndex].hasProducts = productArr
    return updateSelectedLists
  }