import React, { useState, useEffect } from 'react'
import apiCaller from '../functions/apiCaller'
// import mapProductListToButtons from './priceListFunks/mapProductListToButtons'
import mapProductListToTable from './priceListFunks/mapProductListToTable'

let getPriceLists = () =>
  apiCaller({ route: `/sheets/pricelists`, method: `GET` })
let getProductData = brandsArr =>
  apiCaller({ route: `/sheets/products/?brands=${brandsArr}`, method: `GET` })
// let getProductVariantData = () =>
//   apiCaller({ route: `/sheets/variants`, method: `GET` })

export default function PriceLists (props) {
  const [priceLists, setPriceLists] = useState(['priceLists'])

  const [selectedLists, setSelectedLists] = useState([`selectedLists`])

  let isBrandSelected = brand => selectedLists.find(el => el.brand === brand)

  let addSelectedPriceList = brand => {
    if (isBrandSelected(brand) === undefined) {
      // console.log(`addSelectedPriceList: adding ${brand} to selectedLists`)
      let addBrand = {
        brand: brand,
        displayProducts: false,
        hasProducts: ['empty']
      }
      let updateList =
        selectedLists[0] === `selectedLists`
          ? [addBrand]
          : [...selectedLists, addBrand]
      setSelectedLists(updateList)
    }
    // console.log(`addSelectedPriceList: ${brand} is in selectedLists`)
  }

  let selectAllLists = e => {
    e.preventDefault()
    let updateList =
      selectedLists[0] === `selectedLists` ? [] : [...selectedLists]
    for (let i = 0; i < priceLists.length; i++) {
      if (isBrandSelected(priceLists[i].brand) === undefined) {
        let addBrand = {
          brand: priceLists[i].brand,
          displayProducts: false,
          hasProducts: ['empty']
        }
        updateList = [...updateList, addBrand]
      }
    }
    return setSelectedLists([...updateList])
  }

  let clearSelectedPriceList = brand => {
    if (brand === `clearAll` || selectedLists.length === 1) {
      return setSelectedLists(['selectedLists'])
    }
    return setSelectedLists(selectedLists.filter(el => el.brand !== brand))
  }

  let sendPriceListSelections = async selectedBrands => {
    let updateLists = selectedLists

    // selectedBrands.forEach(selectedBrand =>
    //   console.log(`sendPriceListSelections selectedBrand: ${selectedBrand.brand}`)
    // )
    for (let i = 0; i < selectedBrands.length; i++) {
      // console.log(
      //   `sendPriceListSelections for() selectedBrands[i].hasProducts: ${selectedBrands[i].hasProducts[0]}`
      // )
      if (selectedBrands[i].hasProducts[0] === 'empty') {
        let updateIndex = updateLists.indexOf(selectedBrands[i])
        // console.log(`sendPriceListSelections updateIndex: ${updateIndex}`)
        // console.log(`sendPriceListSelections getting: ${selectedBrands[i].brand}`)
        await getProductData(selectedBrands[i].brand).then(res => {
          updateLists[updateIndex].hasProducts = [...res]
          updateLists[updateIndex].displayProducts = true
        })
      }
    }
    // selectedBrands.forEach(selectedBrand =>
    //   console.log(
    //     `sendPriceListSelections: ${selectedBrand.brand} hasProducts: , ${selectedBrand.hasProducts[0].price_product_name}`
    //   ))
    setSelectedLists([]) //have to clear state and reload to prompt rerender since it is a property of an object being updated but the list itself is unchanged
    return setSelectedLists(updateLists)
  }

  let displayBrand = brandObj => {
    // console.log(
    //   `displayBrand view/hide button clicked on Brand: ${brandObj.brand}`
    // )
    let hasProductsListed = isBrandSelected(brandObj.brand)
    // console.log(`view/hide isBrandSelected: ${isBrandSelected(brandObj.brand)}`)

    if (hasProductsListed.hasProducts[0] === 'empty') {
      // console.log(
      //   `displayBrand view/hide button IF hasProductsListed.hasProducts[0]: ${hasProductsListed.hasProducts[0]}`
      // )
      return sendPriceListSelections([brandObj])
    } else {
      let updateLists = selectedLists.map(el => {
        if (el.brand === brandObj.brand) {
          el.displayProducts = !el.displayProducts
        }
        return el
      })
      // updateLists.forEach(el =>
      //   console.log(
      //     `displayBrand updateLists el.brand: ${el.brand} , el.displayProducts: ${el.displayProducts}`
      //   )
      // )
      return setSelectedLists(updateLists)
    }
  }

  let mapPriceLists = arr => {
    let brandsMapped = arr.map((brand, i) => {
      return (
        <div key={i}>
          <button
            onClick={e => {
              e.preventDefault()
              addSelectedPriceList(brand.brand)
            }}
          >
            {brand.brand}
          </button>
        </div>
      )
    })

    return brandsMapped
  }

  let mapSelectionLists = arr => {
    let brandsMapped = arr.map((brandObj, i) => {
      return (
        <div key={i}>
          {brandObj.brand}
          <button
            onClick={e => {
              e.preventDefault()
              displayBrand(brandObj)
            }}
          >
            {selectedLists[0] === 'selectedLists'
              ? null
              : brandObj.displayProducts === true
              ? `Hide Items`
              : `View Items`}
          </button>
          <button
            onClick={e => {
              e.preventDefault()
              clearSelectedPriceList(brandObj.brand)
            }}
          >
            Remove
          </button>
        </div>
      )
    })

    return brandsMapped
  }

  // let updateSelectedListsState = updateSelectedLists => {
  //   return setSelectedLists([...updateSelectedLists])
  // }

  let displayPriceList = mapPriceLists(priceLists)
  let displaySelectedPriceList = mapSelectionLists(selectedLists)

  // let displayProductList = mapProductList(selectedLists) // this outputs the product names to a list of buttons that when clicked shows the variant options
  // let displayProductListAsButtons = mapProductListToButtons(
  //   selectedLists,
  //   updateSelectedListsState
  // )
  // this outputs the product names to a list of buttons that when clicked shows the variant options

  let sortByPropName = (array, propName) => {
    if (array[0] === undefined || array[0] === 'empty') {
      return array
    }
    return array.sort((a, b) => {
      if (a[propName] < b[propName]) {
        return -1
      }
      if (a[propName] > b[propName]) {
        return 1
      }
      return 0
    })
  }

  let removeUnchangedData = (array, removeReqStr) => {
    // console.log('array.length: ', array.length)
    // console.log('removeReqStr: ', removeReqStr)
    let resData = []

    array.map((product, i) => {
      if (i === 0) {
        console.log('i: ', i)
        console.log('resData.length: ', resData.length) // 0 : returned on first call
        // console.log('resData[i]: ', resData[i]) // undefined : returned on first call
        // console.log('.map((product', product) // 'empty' : String returned on first call
      }

      // compare product to resData[i]
      if (product !== 'empty') {
        // if(i===0){console.log("if (product !== 'empty')", product)} //  first product of the array returned once product array is available

        // compare prop (.price_parent_sku) on product and resData[resData.length-1], if no match add product to resData, if match proceed to assess removeReqStr for additional logic
        //removeReqStr = 'Remove All' should check all props on product object
        //removeReqStr = <string for specific propName> should check just that propName on product object
        let compareProducts = (
          lastProduct,
          currentProduct,
          removeValByProp
        ) => {
          // console.log(`compare last item of resData:${lastProduct.price_parent_sku} to product ${currentProduct.price_parent_sku}`)
          // console.log('removeValByProp: ',removeValByProp)
          let compareProductProps = (last, current, removeValOfProp) => {
            let propKeys = Object.keys(last)
            let addItem = {}
            // console.log('propKeys.length: ',propKeys.length)
            for (let x = 0; x < propKeys.length; x++) {
              let checkProp = propKeys[x]
              if (checkProp !== 'price_parent_sku') {
                // console.log('checkProp', checkProp)

                addItem = {
                  ...addItem,
                  [checkProp]:
                    last[checkProp] === current[checkProp]
                      ? current[checkProp]
                      : // ? ''
                        `was: ${last[checkProp]} \n now: ${current[checkProp]}`
                }
              } else {
                addItem = {
                  ...addItem,
                  [checkProp]: current[checkProp]
                }
              }
              //  console.log(`current[checkProp] :${current[checkProp]} \n last[checkProp]:${last[checkProp]}`)
            }
            // console.log('addItem: ',addItem)
            //  return addItem.price_parent_sku	!== '' ? addItem : {}
            return addItem
          }
          let changedItem =
            lastProduct.price_parent_sku !== currentProduct.price_parent_sku
              ? currentProduct
              : compareProductProps(
                  lastProduct,
                  currentProduct,
                  removeValByProp
                )

          // lastProduct.price_parent_sku !== currentProduct.price_parent_sku
          //   ? (resData = [...resData, currentProduct])
          //   : (resData = [...resData, changedItem])
          // :(resData.slice(-1).push(changedItem) )
          // console.log("resData.slice", resData.slice(1))
          console.log(
            'resData.filter',
            resData.filter(
              el => el.price_parent_sku !== changedItem.price_parent_sku
            )
          )
          resData = [
            ...resData.filter(
              el => el.price_parent_sku !== changedItem.price_parent_sku
            ),
            changedItem
          ]
          return resData
        }
        // resData.length > 0 ? resData = [...resData, product] : console.log(`--- nothing to compare in resData Array ---`)
        // resData.length === 0 ? resData = [...resData, product] : console.log(`i: ${i}, resData.lenght: ${resData.length} `)
        resData.length > 0
          ? compareProducts(resData[resData.length - 1], product, removeReqStr)
          : (resData = [...resData, product])
        return resData
        // product.price_parent_sku === resData[i].price_parent_sku ? console.log("match") : resData = [...resData, product]
      }

      return product
    })
    // console.log("end of map")

    return resData
  }

  let productList = selectedListsArray => {
    let newList = []
    selectedListsArray.map(priceList => {
      if (priceList !== 'selectedLists') {
        //if (priceList !== 'Default State')
        let tempList = priceList.hasProducts.map(product => {
          // console.log("product:", product)
          if (product !== 'empty') {
            return product
          }
          return 'empty'
        })
        // console.log('PriceLists.productList.tempList: ', tempList)

        return (newList = [...newList, ...tempList])
      }
      return newList
    })
    // console.log('PriceLists.productList.newList: ', newList)

    newList = sortByPropName(newList, 'price_parent_sku')
    newList = sortByPropName(newList, 'price_product_name')
    newList = removeUnchangedData(newList, 'Remove All')

    return newList
  }

  let displayTable = mapProductListToTable(productList(selectedLists)) // this outputs the product details to a table

  useEffect(() => {
    let mounted = true
    // implement to make call and get price list when component is rendering
    getPriceLists().then(response => {
      if (mounted) {
        setPriceLists(response)
      }
    })
    return () => (mounted = false)
  }, [])

  return (
    <div>
      <h2
        onClick={e => {
          e.preventDefault()
          getPriceLists().then(response => {
            setPriceLists(response)
          })
        }}
      >
        Price Lists
      </h2>
      <div>
        {selectedLists[0] === 'selectedLists' ? null : (
          <div>
            Selected:
            {displaySelectedPriceList}
            <button
              onClick={e => {
                e.preventDefault()
                // console.log(`Submitting brands : ${selectedLists}`)
                sendPriceListSelections(selectedLists)
              }}
            >
              Submit List
            </button>
            <button
              onClick={e => {
                e.preventDefault()
                clearSelectedPriceList(`clearAll`)
              }}
            >
              Clear List
            </button>
          </div>
        )}
      </div>
      <hr />

      {priceLists[0] === 'priceLists' ? null : (
        <div>
          Select Price Lists{' '}
          <button onClick={e => selectAllLists(e)}>Select All</button>
          {displayPriceList}
          <hr />
        </div>
      )}

      {/* {displayProductListAsButtons} */}
      {displayTable}
    </div>
  )
}
