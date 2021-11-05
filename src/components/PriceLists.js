import React, { useState, useEffect } from 'react'
import apiCaller from './functions/apiCaller'

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

  let mapProductVariantData = variants => {
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
              props.addToCart(option)
            }}
          >
            {/* {inCart()} */}
          </button>
        </div>
      )
    })
    return variantList
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

  let updateSelectedItem = (product, productIndex, brandIndex) => {
    product.displayVariants = !product.displayVariants
    let updateSelectedLists = [...selectedLists]
    let productArr = selectedLists[brandIndex].hasProducts
    productArr[productIndex] = product
    updateSelectedLists[brandIndex].hasProducts = productArr
    return setSelectedLists([...updateSelectedLists])
  }

  let mapProductList = arr => {
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
                  updateSelectedItem(product, j, i)
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
    })
    return brandsMapped
  }

  let displayPriceList = mapPriceLists(priceLists)
  let displaySelectedPriceList = mapSelectionLists(selectedLists)
  let displayProductList = mapProductList(selectedLists)

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

      {displayProductList}
    </div>
  )
}
