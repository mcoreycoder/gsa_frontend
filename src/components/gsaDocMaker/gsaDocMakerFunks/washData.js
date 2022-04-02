export default function washData (array, string) {
  let allProducts = []
  let allVariants = []
  let allData = []
  let handleArray = (array, string) => {
    if (string === 'allProducts') {
      allProducts = array
    }
    if (string === 'allVariants') {
      allVariants = array
    }
    if (string === 'allData') {
      allData = array
    }
  }
  handleArray(array, string)
  let newFormat = {
    _source: 'null',
    _idKey: 'null',
    _parent_sku: 'null',
    _brand: 'null',
    _product_name: 'null',
    _product_description: 'null', // no source of data from Price or UPC data, just GSA PPT form or webscrap forms(outdated)
    _past_gsa_msrp: 'null',
    _msrp: 'null',
    _gsa_price: 'null',
    _oldFormat: 'null'
  } // builds standard format for use in below functions for standardizing based on array/document
  let formattedProducts = allProducts.map(product => {
    console.log("allProducts product.keyId:",product)
    let formatedProduct = { ...newFormat, _oldFormat: product } //build new based on standard format
    // assign vals to props else it will still have prop val of 'null'
    formatedProduct = {
      ...formatedProduct,
      _source: 'Vendor Price List',
      _idKey: product.idKey,
      _brand: product.brand,
      _parent_sku: product.price_parent_sku,
      _product_name: product.price_product_name,
      _oldFormat: product._oldFormat,
      _msrp: product.price_msrp
    }
    return formatedProduct
  })

  let formattedVariants = allVariants.map(product => {
    // console.log("allVariants product.keyId:",product.idKey)
    let formatedProduct = { ...newFormat, _oldFormat: product } //build new based on standard format
    // assign vals to props else it will still have prop val of 'null'
    formatedProduct = {
      ...formatedProduct,
      _source: 'Vendor UPC List',
      _idKey: product.idKey,
      _brand: product.brand,
      _parent_sku: product.upc_parent_sku,
      _product_name: product.upc_product_name
    }
    return formatedProduct
  })

  let formattedDocData = allData.map(product => {
    // console.log("allData product.keyId:",product.idKey)
    let formatedProduct = { ...newFormat, _oldFormat: product } //build new based on standard format
    // assign vals to props else it will still have prop val of 'null'

    //below handles 'Commercial Price List' file
    if (product.idKey.includes('Commercial Price List')) {
      // console.log("Commercial Price List")
      formatedProduct = {
        ...formatedProduct,
        _source: 'Commercial Price List',
        _idKey: product.idKey,
        _parent_sku: product.header_column_1,
        _brand: product.header_column_2,
        _product_name: product.header_column_3,
        _msrp: product.header_column_4
      }
      return formatedProduct
    }

    //below handles PPT file for tabs 'PRODUCTS WITH DISCOUNT (A) and (B-Δ)' since header formatting appeared to be the same
    if (
      product.idKey.includes('PRODUCTS WITH DISCOUNT (A)') ||
      product.idKey.includes('PRODUCTS WITH DISCOUNT (B-Δ)')
    ) {
      // console.log(
      //   product.idKey.includes('PRODUCTS WITH DISCOUNT (A)')
      //     ? 'PRODUCTS WITH DISCOUNT (A)'
      //     : 'PRODUCTS WITH DISCOUNT (B-Δ)'
      // )
      formatedProduct = {
        _source: product.idKey.includes('PRODUCTS WITH DISCOUNT (A)')
          ? 'PRODUCTS WITH DISCOUNT (A)'
          : 'PRODUCTS WITH DISCOUNT (B-Δ)',
        _idKey: product.idKey,
        _parent_sku: product.header_column_7,
        _brand: product.header_column_6,
        _product_name: product.header_column_10,
        _product_description: product.header_column_11, // no source of data from Price or UPC data, just GSA PPT form or webscrap forms(outdated)
        _msrp: product.header_column_15
      }
      return formatedProduct
    }

    //below handles PPT file for tab 'EPA - DISCOUNT' since header formatting appeared to be different
    // source for data not yet created, still need to create but started to format below newFormat object
    if (product.idKey.includes('EPA - DISCOUNT')) {
      console.log('EPA - DISCOUNT')
      formatedProduct = {
        _source: 'EPA - DISCOUNT',
        _idKey: product.idKey,
        _parent_sku: product.header_column_6,
        _brand: product.header_column_5,
        _product_name: product.header_column_9,
        _product_description: product.header_column_10, // no source of data from Price or UPC data, just GSA PPT form or webscrap forms(outdated)
        _past_gsa_msrp: product.header_column_14,
        _msrp: product.header_column_15
      }
      return formatedProduct
    }
    // end of 'if' needing to be completed

    //below handles PPT file for tab 'EPA - DISCOUNT' since header formatting appeared to be different
    // source for data not yet created, still need to create but started to format below newFormat object
    if (product.idKey.includes('data')) {
      formatedProduct = {
        // start with common properties
        _idKey: product.idKey,
        _parent_sku: product.header_column_2,
        _brand: product.header_column_3
      }
      // console.log('formatedProduct: ', formatedProduct)

      //then assess to map additional properties by form
      if (formatedProduct._idKey.includes('IOPTIONS')) {
        // console.log('IOPTIONS data')
        formatedProduct = {
          ...formatedProduct,
          _source: 'IOPTIONS',
          _msrp: product.header_column_9 //OPT_PRICE and prop name is not accurate for this column
        }
      }
      if (formatedProduct._idKey.includes('IPRICE')) {
        // console.log('IPRICE data')
        formatedProduct = {
          ...formatedProduct,
          _source: 'IPRICE',
          _gsa_price: product.header_column_4,
          _msrp: product.header_column_8
        }
      }
      if (formatedProduct._idKey.includes('IPROD')) {
        // console.log('IPROD data')
        formatedProduct = {
          ...formatedProduct,
          _source: 'IPROD',
          _product_name: product.header_column_4
        }
      }

      return formatedProduct
    }
    return formatedProduct
  }) // end of formattedData() that works with form data

  // // below prepairs data from product pricelist/upc and docs to be sent
  let combineData = [
    ...formattedProducts,
    ...formattedVariants,
    ...formattedDocData
  ]
  // let combineData = [...formattedProducts, ...formattedDocData]

  // let compare = (a, b) => {
  //   if (a < b) {
  //     return -1
  //   }
  //   if (a > b) {
  //     return 1
  //   }
  //   return 0
  // }
  return combineData
}
