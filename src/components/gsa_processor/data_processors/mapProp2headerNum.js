export default function mapProp2headerNum (item, docLists, selectedDocObj) {
  // console.log("mapProp2headerNum")

  let formatedProduct = {}
  let doc_name = selectedDocObj.doc_name
  let doc_sheet_name = selectedDocObj.doc_sheet_name
  let targetPPT = item.docDeets?.find(el =>
    el._idKey.includes('1WGfBmKDiFdPfwjh8nmqxJI9VJJZ1I2S6BdwQbzmvPwE')
  )
  let targetVariant_oldFormat = item.variant?._oldFormat
  //   console.log(`mapProp2headerNum ${doc_sheet_name}`)

  if (doc_sheet_name?.includes('Commercial Price List')) {
    console.log('Commercial Price List')
    formatedProduct = {
      header_column_1: item._parent_sku,
      header_column_2: item._brand,
      header_column_3: item._product_name,
      header_column_4: item._msrp,
      header_column_5: targetPPT._award_action
    }
    return formatedProduct
  }

  if (doc_sheet_name?.includes('data')) {
    if (doc_name?.includes('IPRICE')) {
      // console.log('IPRICE data')
      formatedProduct = {
        header_column_1: targetPPT._contract_num,
        header_column_2: targetPPT._parent_sku,
        header_column_3: targetPPT._brand,
        header_column_4: targetPPT._gsa_price_including_IFF,
        header_column_5: targetPPT._temp_price,
        header_column_6: targetPPT._temp_price_start,
        header_column_7: targetPPT._temp_price_end,
        header_column_8: targetPPT._msrp,
        header_column_9: targetPPT._zone_num
      }
    }

    if (doc_name?.includes('IOPTIONS')) {
      // console.log('IOPTIONS data')
      let checkColor = (fullSKU) => {
          if(fullSKU?.includes("-CY-")){
              return "Coyote"
          }
          if(fullSKU?.includes("-BK-")){
              return "Sitka Black"
          }
          if(fullSKU?.includes("-PB-")){
              return "Lead"
          }
          if(fullSKU?.includes("-MCC-")){
              return "MultiCam Classic"
          }
      }
      let upc_color = item._brand === "ARROWHEAD 2022" ? checkColor(targetVariant_oldFormat?.fullSKU) : targetVariant_oldFormat?.upc_color
      let combinedColorSizeFullSKU = `${upc_color} / ${targetVariant_oldFormat?.upc_size} - ${targetVariant_oldFormat?.fullSKU}`
      let create_opt_code = targetedVariant => {
        let item_variant_array = item.variantDeets.filter(el => {
          return el._oldFormat._parent_sku === targetedVariant?._parent_sku
        })
        let index = item_variant_array.findIndex(el => {
          return el._oldFormat.fullSKU === targetedVariant?.fullSKU
        })
        console.log(`index: ${index}`)
        return index === 0 ? 'I' : 'S'
      }
      let check4PriceDiff = () => {
        var regex = /\d+/
        let variantPrice = targetVariant_oldFormat?.upc_msrp.match(regex)
        let itemPrice = item._msrp.match(regex)
        let priceDiff = variantPrice? variantPrice - itemPrice : "ssame"
        // console.log(`${variantPrice} - ${itemPrice} = ${priceDiff}`)
        return priceDiff
      }

      formatedProduct = {
        header_column_1: targetPPT._contract_num,
        header_column_2: targetPPT._parent_sku,
        header_column_3: targetPPT._brand,
        header_column_4: combinedColorSizeFullSKU, // may need to change to upc_fullsku and color/size detail
        header_column_5: `COLOR / SIZE`, // was set at (targetPPT._group,)
        header_column_6: create_opt_code(targetVariant_oldFormat), // was set at (targetPPT._opt_code,) // either an "I" or "S"
        header_column_7: `1`, // was set at (targetPPT._opt_qty,)
        header_column_8: targetPPT._uoi, // was set at (targetPPT._opt_unit,) // may just be _uoi
        header_column_9: check4PriceDiff(), // was set at (targetPPT._opt_price,) //may need to change to (_upc_msrp - _msrp)
        header_column_10: combinedColorSizeFullSKU, // was set at (targetPPT._opt_desc,) // my just be same as _opt_part
        header_column_11: item._brand, // was set at (targetPPT._opt_mfg,) // may just be _vendor_name? or it related to accessories made by seperate brand?
        header_column_12: `FALSE`, // was set at (targetPPT._is_deleted)
      }
    }

    if (doc_name?.includes('IPROD')) {
        let _product_description = targetPPT._product_description.substr(0,249)
        let _product_description_2 = targetPPT._product_description.substr(250,499)
        let _product_description_3 = targetPPT._product_description.substr(500,749)
        let _product_description_4 = targetPPT._product_description.substr(750,1000)
        
      // console.log('IPROD data')
      return formatedProduct = {
        header_column_1: targetPPT._contract_num,
        header_column_2: targetPPT._parent_sku,
        header_column_3: targetPPT._brand,
        header_column_4: targetPPT._product_name,
        header_column_5: targetPPT._vendor_part_num,
        header_column_6: _product_description, 
        header_column_7: _product_description_2,
        header_column_8: _product_description_3,
        header_column_9: _product_description_4,
        header_column_10: '', 
        header_column_11: 0, 
        header_column_12: 0, 
        header_column_13: 0, 
        header_column_14: 1, 
        header_column_15: 'CF', 
        header_column_16: targetPPT._uoi, 
        header_column_17: '', 
        header_column_18: '', 
        header_column_19: '', 
        header_column_20: 1, 
        header_column_21: targetPPT._sin,
        header_column_22: targetPPT._coo,
        header_column_23: '',
        header_column_24: '',
        header_column_25: 1,
        header_column_26: 'YEAR',
        header_column_27: 30,
        header_column_28: 'AF',
        header_column_29: '',
        header_column_30: '',
        header_column_31: '',
        header_column_32: 'LN',
        header_column_33: 'WD',
        header_column_34: 'HT',
        header_column_35: 'P',
        header_column_36: targetPPT._upc_a,
        header_column_37: '',
        header_column_38: 'O',
        header_column_39: 'O',
        header_column_40: 'O',
        header_column_41: 'O',
        header_column_42: '',
      }
    }

    return formatedProduct
  }

  // end return
  return formatedProduct
}
