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
    _gsa_price_excluding_IFF: 'null',
    _oldFormat: 'null'
  } // builds standard format for use in below functions for standardizing based on array/document
  let formattedProducts = allProducts.map(product => {
    // console.log("allProducts product.keyId:",product)
    let formatedProduct = { ...newFormat, _oldFormat: product } //build new based on standard format
    // assign vals to props else it will still have prop val of 'null'
    formatedProduct = {
      ...formatedProduct,
      _source: 'Vendor Price List',
      _idKey: product.idKey,
      _brand: product.brand,
      _parent_sku: product.price_parent_sku,
      _product_name: product.price_product_name,
      _wholesale: product.price_wholesale,
      _gsa_cost: product.price_gsa_cost,
      _msrp: product.price_msrp,
      _gsa_price_excluding_IFF: product.price_gsa_map,
      _coo: product.price_coo,
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
      _product_name: product.upc_product_name,
      _wholesale: product.upc_whls,
      _msrp: product.upc_msrp,
      _upc_a: product.upc_upc,
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
        _msrp: product.header_column_4,
        _award_action: product.header_column_4
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
        ...formatedProduct,
        _source: product.idKey.includes('PRODUCTS WITH DISCOUNT (A)')
          ? 'PRODUCTS WITH DISCOUNT (A)'
          : 'PRODUCTS WITH DISCOUNT (B-Δ)',
        _idKey: product.idKey,
        _award_action: product.header_column_1,
        _duns: product.header_column_2,
        _vendor_name: product.header_column_3,
        _contract_num: product.header_column_4,
        _sin: product.header_column_5,
        _brand: product.header_column_6,
        _parent_sku: product.header_column_7,
        _vendor_part_num: product.header_column_8,
        _upc_a: product.header_column_9,
        _product_name: product.header_column_10,
        _product_description: product.header_column_11, // no source of data from Price or UPC data, just GSA PPT form or webscrap forms(outdated)
        _uoi: product.header_column_12,
        _green_certification: product.header_column_13,
        _recycled_percent: product.header_column_14,
        _msrp: product.header_column_15,
        _mfc: product.header_column_16,
        _discount_percent_to_mfc: product.header_column_17,
        _discount_price_to_mfc: product.header_column_18,
        _discount_percent_to_gsa: product.header_column_19,
        _discount_percent_to_gsa_off_mfc_price: product.header_column_20,
        _gsa_price_excluding_IFF: product.header_column_21,
        _gsa_price_including_IFF: product.header_column_22,
        _qty_volume_discount: product.header_column_23,
        _coo: product.header_column_24
      }
      return formatedProduct
    }

    //below handles PPT file for tab 'EPA - DISCOUNT' since header formatting appeared to be different
    // source for data not yet created, still need to create but started to format below newFormat object
    if (product.idKey.includes('EPA - DISCOUNT')) {
      // console.log('EPA - DISCOUNT')
      formatedProduct = {
        ...formatedProduct,
        _source: 'EPA - DISCOUNT',
        _idKey: product.idKey,

        _duns: product.header_column_1,
        _us_elite_vendor_name: product.header_column_2,
        _contract_num: product.header_column_3,
        _sin: product.header_column_4,
        _brand: product.header_column_5,
        _parent_sku: product.header_column_6,
        _vendor_part_num: product.header_column_7,
        _upc_a: product.header_column_8,
        _product_name: product.header_column_9,
        _product_description: product.header_column_10, // no source of data from Price or UPC data, just GSA PPT form or webscrap forms(outdated)
        _uoi: product.header_column_11,
        _green_certification: product.header_column_12,
        _recycled_percent: product.header_column_13,
        _past_msrp: product.header_column_14,
        _msrp: product.header_column_15,
        _percent_change_msrp: product.header_column_16,
        _mfc: product.header_column_17,
        _discount_percent_to_mfc: product.header_column_18,
        _discount_price_to_mfc: product.header_column_19,
        _discount_price_to_mfc_new: product.header_column_20,
        _percent_change_mfc_price: product.header_column_21,
        _discount_percent_to_gsa: product.header_column_22,
        _discount_percent_to_gsa_off_mfc_price: product.header_column_23,
        _gsa_price_excluding_IFF: product.header_column_24,
        _gsa_price_including_IFF: product.header_column_25,
        _gsa_price_excluding_IFF_new: product.header_column_26,
        _gsa_price_including_IFF_new: product.header_column_27,
        _gsa_price_percent_change: product.header_column_28,
        _qty_volume_discount: product.header_column_29,
        _coo: product.header_column_30
      }
      return formatedProduct
    }
    // end of 'if' needing to be completed

    //below handles PPT file for tab 'EPA - DISCOUNT' since header formatting appeared to be different
    // source for data not yet created, still need to create but started to format below newFormat object
    if (product.idKey.includes('data')) {
      formatedProduct = {
        ...formatedProduct,
        _idKey: product.idKey,
        _parent_sku: product.header_column_2,
        _brand: product.header_column_3
      }
      // console.log('formatedProduct: ', formatedProduct)
      if (formatedProduct._idKey.includes('IPRICE')) {
        // console.log('IPRICE data')
        formatedProduct = {
          ...formatedProduct,
          _source: 'IPRICE',
          _contract_num: product.header_column_1,
          _vendor_part_num: product.header_column_2,
          _brand: product.header_column_3,
          _gsa_price_including_IFF: product.header_column_4,
          _temp_price: product.header_column_5,
          _temp_price_start: product.header_column_6,
          _temp_price_end: product.header_column_7,
          _msrp: product.header_column_8,
          _zone_num: product.header_column_9
        }
      }
      if (formatedProduct._idKey.includes('IOPTIONS')) {
        // console.log('IOPTIONS data')
        formatedProduct = {
          ...formatedProduct,
          _source: 'IOPTIONS',
          // todo below assign <propNames>
          _contract_num: product.header_column_1,
          _vendor_part_num: product.header_column_2,
          _brand: product.header_column_3,
          _opt_part: product.header_column_4, // may need to change to upc_fullsku and color/size detail
          _group: product.header_column_5,
          _opt_code: product.header_column_6, // either an "I" or "S"
          _opt_qty: product.header_column_7,
          _opt_unit: product.header_column_8, // may just be _uoi
          _opt_price: product.header_column_9, //may need to change to (_upc_msrp - _msrp)
          _opt_desc: product.header_column_10, // my just be same as _opt_part
          _opt_mfg: product.header_column_11, // may just be _vendor_name? or it related to accessories made by seperate brand?
          _is_deleted: product.header_column_12
        }
      }
      if (formatedProduct._idKey.includes('IPROD')) {
        // console.log('IPROD data')
        formatedProduct = {
          ...formatedProduct,
          _source: 'IPROD',
          _contract_num: product.header_column_1,
          _parent_sku: product.header_column_2,
          _brand: product.header_column_3,
          _product_name: product.header_column_4,
          _vendor_part_num: product.header_column_5,
          _product_description: product.header_column_6,
          _product_description_2: product.header_column_7,
          _product_description_3: product.header_column_8,
          _product_description_4: product.header_column_9,
          _nsn: product.header_column_10,
          _value_1: product.header_column_11,
          _value_2: product.header_column_12,
          _value_3: product.header_column_13,
          _dVolume: product.header_column_14,
          _d_vUnit: product.header_column_15,
          _iss_code: product.header_column_16,
          _qty_unit: product.header_column_17,
          _qp_unit: product.header_column_18,
          _stdPack: product.header_column_19,
          _weight: product.header_column_20,
          _sin: product.header_column_21,
          _coo: product.header_column_22,
          // todo below assign <propNames>
          // : product.header_column_23,
          // : product.header_column_24,
          // : product.header_column_25,
          // : product.header_column_26,
          // : product.header_column_27,
          // : product.header_column_28,
          // : product.header_column_29,
          // : product.header_column_30,
          // : product.header_column_31,
          // : product.header_column_32,
          // : product.header_column_33,
          // : product.header_column_34,
          // : product.header_column_35,
          _upc_a: product.header_column_36
          // : product.header_column_37,
          // : product.header_column_38,
          // : product.header_column_39,
          // : product.header_column_40,
          // : product.header_column_41,
          // : product.header_column_42,
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
