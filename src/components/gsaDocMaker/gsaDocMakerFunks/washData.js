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

  let formattedProducts = allProducts.map(product => {
    // console.log("allProducts product.keyId:",product.idKey)
    product.source = 'Vendor Price List'
    return product
  })

    let formattedVariants = allVariants.map(product => {
      // console.log("allVariants product.keyId:",product.idKey)
      product.source = 'Vendor UPC List'
      return product
    })

  let formattedDocData = allData.map(product => {
    // console.log("allData product.keyId:",product.idKey)
    let newFormat = {}
    //below handles 'Commercial Price List' file
    if (product.idKey.includes('Commercial Price List')) {
      // console.log("Commercial Price List")
      newFormat = {
        source: 'Commercial Price List',
        idKey: product.idKey,
        price_parent_sku: product.header_column_1,
        brand: product.header_column_2,
        price_product_name: product.header_column_3,
        price_msrp: product.header_column_4
      }
      return newFormat
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
      newFormat = {
        source: product.idKey.includes('PRODUCTS WITH DISCOUNT (A)')
          ? 'PRODUCTS WITH DISCOUNT (A)'
          : 'PRODUCTS WITH DISCOUNT (B-Δ)',
        idKey: product.idKey,
        price_parent_sku: product.header_column_7,
        brand: product.header_column_6,
        price_product_name: product.header_column_10,
        product_description: product.header_column_11, // no source of data from Price or UPC data, just GSA PPT form or webscrap forms(outdated)
        price_msrp: product.header_column_15
      }
      return newFormat
    }

    //below handles PPT file for tab 'EPA - DISCOUNT' since header formatting appeared to be different
    // source for data not yet created, still need to create but started to format below newFormat object
    if (product.idKey.includes('EPA - DISCOUNT')) {
      console.log('EPA - DISCOUNT')
      newFormat = {
        source: 'EPA - DISCOUNT',
        idKey: product.idKey,
        price_parent_sku: product.header_column_6,
        brand: product.header_column_5,
        price_product_name: product.header_column_9,
        product_description: product.header_column_10, // no source of data from Price or UPC data, just GSA PPT form or webscrap forms(outdated)
        past_gsa_msrp: product.header_column_14,
        price_msrp: product.header_column_15
      }
      return newFormat
    }
    // end of 'if' needing to be completed

    //below handles PPT file for tab 'EPA - DISCOUNT' since header formatting appeared to be different
    // source for data not yet created, still need to create but started to format below newFormat object
    if (product.idKey.includes('data')) {
      newFormat = {
        // start with common properties
        idKey: product.idKey,
        price_parent_sku: product.header_column_2,
        upc_parent_sku: product.header_column_2,
        brand: product.header_column_3
      }
      // console.log('newFormat: ', newFormat)

      //then assess to map additional properties by form
      if (newFormat.idKey.includes('IOPTIONS')) {
        // console.log('IOPTIONS data')
        newFormat = {
          ...newFormat,
          source: 'IOPTIONS',
          price_msrp: product.header_column_9 //OPT_PRICE and prop name is not accurate for this column
        }
      }
      if (newFormat.idKey.includes('IPRICE')) {
        // console.log('IPRICE data')
        newFormat = {
          ...newFormat,
          source: 'IPRICE',
          gsa_price: product.header_column_4,
          price_msrp: product.header_column_8
        }
      }
      if (newFormat.idKey.includes('IPROD')) {
        // console.log('IPROD data')
        newFormat = {
          ...newFormat,
          source: 'IPROD',
          price_product_name: product.header_column_4
        }
      }

      return newFormat
    }
  }) // end of formattedData() that works with form data

  // // below prepairs data from product pricelist/upc and docs to be sent
    let combineData = [...formattedProducts, ...formattedVariants, ...formattedDocData]
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
