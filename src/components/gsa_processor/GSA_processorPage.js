import React, { useState, useEffect } from 'react'
import {
  getPriceLists,
  getProductData,
  getDocsLists,
  getDocData
} from '../gsaDocMaker/gsaDocMakerFunks/apiCalls'
// examples below for imports
// import some_ViewComponent from './view_processors'
// import some_DataWorker from './data_processors'
import ViewSelectionLists from './view_processors/ViewSelectionLists'
import ViewSelected from './view_processors/ViewSelected'
import SelectedFormatTable from './view_processors/SelectedFormatTable'

let style1 = {
  display: 'flex',
  flexDirection: 'column',
  rowGap: '0px',
  justifyContent: 'center'
}
let style2 = {
  flex: 'auto',
  flexDirection: 'inherit',
  // width: '100%',

  transform: 'scale(0.5) translate(0%, 0%)'
}
let style3 = {
  flex: 'auto',
  flexDirection: 'inherit',
  // width: '250%',

  transform: 'scale(0.5) translate(0%, 0%)',
}

export default function GSA_processorPage (props) {
  const [priceLists, setPriceLists] = useState([])
  const [docLists, setDocLists] = useState([])
  const [selectedPriceLists, setSelectedPriceLists] = useState([])
  const [selectedDocsLists, setSelectedDocsLists] = useState([])
  const [singleSkuList, setSingleSkuList] = useState([])
  const [gsa_sku_data, setGSA_sku_data] = useState(['gsa_sku_data'])
  const [add_gsa_skus, setAdd_gsa_skus] = useState([])
  const [delete_gsa_skus, setDelete_gsa_skus] = useState([])
  const [priceChange_gsa_skus, setPriceChange_gsa_skus] = useState([])
  const [BrandPriceListObj, setBrandPriceListObj] = useState({})
  
  let reduceToSingleSkuList = props_array => {
    let newArray = []
    props_array.map(item => {
      if (item._product_name) {
        // added this if() to eleminate Salomon catagory that was being assigned to _parent_sku
        let itemMatchArray = props_array.filter(
          el => el?._parent_sku === item?._parent_sku
        )
        props_array = props_array.filter(
          el => el?._parent_sku !== item?._parent_sku
        )
        if (itemMatchArray.length === 1) {
          newArray = [...newArray, itemMatchArray[0]]
        }
        if (itemMatchArray.length > 1) {
          let updateItem = itemMatchArray[1]
          updateItem._previousPriceList = itemMatchArray[0]._oldFormat
          newArray = [...newArray, updateItem]
        }
      }
      // console.log('array: ',array)
      // console.log('itemMatchArray: ',itemMatchArray)
      // console.log('filterArray: ',filterArray)
      // console.log('newArray: ', newArray)
      return newArray
    })
    setSingleSkuList(newArray)
    return newArray
  }

  let createCurrentBrandPriceListObj = props_array => {
    let currentBrandPriceListObj = {}

    if (props_array[0] !== 'combinedByPriceListSKU') {
      props_array.map(item => {
        let brand_year = item._brand?.split(' ')
        let length = brand_year?.length
        let brand =
          length < 3 ? brand_year[0] : `${brand_year[0]} ${brand_year[1]}`
        let year = length < 3 ? brand_year[1] : `${brand_year[length - 1]}`

        if (currentBrandPriceListObj[brand] === undefined) {
          currentBrandPriceListObj = {
            ...currentBrandPriceListObj,
            [brand]: year
          }
        }
        if (currentBrandPriceListObj[brand] !== undefined) {
          // console.log(`---------------- ${Object.keys(currentBrandPriceListObj)}`)
          // console.log(`------------ ${currentBrandPriceListObj[brand]} < ${year}`)

          if (currentBrandPriceListObj[brand] < year) {
            currentBrandPriceListObj[brand] = year
          }
        }
      })
    }

    setBrandPriceListObj(currentBrandPriceListObj)
    return currentBrandPriceListObj
  }

  let sortCurrentGSAskus = singleSkuArray => {
    let currentGSAskus = []
    singleSkuArray.map(item => {
      if (item.docDeets?.length > 0) { 
        // could also look to evaluate based on a specific "MASTER" doc, 
        // currently using the dataSortingEPA which should reflect all current skus?
        currentGSAskus = [...currentGSAskus, item]
      }
      return currentGSAskus
    })
    setGSA_sku_data(currentGSAskus)
    return singleSkuArray
  }

  let sortByAction = async singleSkuArray => {
    let addSkus = []
    let deleteSkus = []
    let priceChangeSkus = []
    let myBrandPriceListObj = await createCurrentBrandPriceListObj(
      props.combinedByPriceListSKU
    )

    let sortActions = singleSkuArray =>
      singleSkuArray[0] === 'combinedByPriceListSKU'
        ? null
        : singleSkuArray.map(item => {
            let brand_year = item._brand?.split(' ')
            let length = brand_year?.length
            let brand =
              length < 3 ? brand_year[0] : `${brand_year[0]} ${brand_year[1]}`
            let year = length < 3 ? brand_year[1] : `${brand_year[length - 1]}`

            // console.log(`* * * * sortActions * * * *  `)
            // console.log(`item brand * * * * ${brand} `)
            // console.log(`item year * * * * ${year} `)
            // console.log(`item._previousPriceList * * * * ${Boolean(item._previousPriceList)} `)
            // console.log(`myBrandPriceListObj[brand] * * * * ${myBrandPriceListObj[brand]} `)
            // console.log(`BrandPriceListObj[brand] * * * * ${BrandPriceListObj[brand]} `)
            // console.log(`Sku: ${item?._parent_sku} \n
            //  gsa price ${item?._gsa_price_excluding_IFF} \n
            // ***** was ${item?._previousPriceList?._price_gsa_map}\n `)

            if (item._previousPriceList === undefined) {
              if (
                myBrandPriceListObj[brand] !== undefined &&
                myBrandPriceListObj[brand] === year
              ) {
                // console.log(`addSkus: ${item._parent_sku} ***** ${myBrandPriceListObj[brand]} === ${year}`)
                return (addSkus = [...addSkus, item])
              }
              if (
                myBrandPriceListObj[brand] > year &&
                item.docDeets[0] !== undefined
              ) {
                // console.log(`deleteSkus: ${item._parent_sku} ***** ${myBrandPriceListObj[brand]} > ${year}`)
                return (deleteSkus = [...deleteSkus, item])
              }
            }

            if (
              // may want to have this based on mapping just the GSA skus not the singleSkuArray list
              Boolean(item._previousPriceList) &&
              Boolean(item.docDeets[0]) &&
              Boolean(myBrandPriceListObj[brand]) &&
              myBrandPriceListObj[brand] === year
            ) {
              // evaluate gsa price changes
              if (
                item._gsa_price_excluding_IFF !==
                item._previousPriceList.price_gsa_map
              ) {
                // console.log(`GSA priceChangeSkus: ${item._parent_sku} \n
                // gsa price ${item._gsa_price_excluding_IFF} \n
                // ***** was ${item._previousPriceList.price_gsa_map}\n `)
                item._priceChange = {
                  ...item._priceChange,
                  _gsa_price_priceChange: `GSA priceChangeSku: ${item._parent_sku}, gsa price: ${item._gsa_price_excluding_IFF}, ***** was: ${item._previousPriceList.price_gsa_map} `
                }

                // return (priceChangeSkus = [...priceChangeSkus, item])
                // return item
              }
              if (item._gsa_cost !== undefined) {
                // console.log(`_gsa_cost priceChangeSkus: ${item._parent_sku} \n
                // _gsa_cost price ${item._gsa_cost} \n
                // ***** was ${item._previousPriceList.gsa_cost}\n `)
                item._priceChange = {
                  ...item._priceChange,
                  _gsa_cost_priceChange: `_gsa_cost priceChangeSku: ${item._parent_sku}, _gsa_cost price: ${item._gsa_cost}, ***** was: ${item._previousPriceList.gsa_cost}`
                }
                // return (priceChangeSkus = [...priceChangeSkus, item])
                // return item
              }
              // evaluate retail changes
              if (item._msrp !== item._previousPriceList.price_msrp) {
                // console.log(`MSRP priceChangeSkus: ${item._parent_sku} \n
                // MSRP price ${item._msrp} \n
                // ***** was ${item._previousPriceList.price_msrp}\n `)
                item._priceChange = {
                  ...item._priceChange,
                  _msrp_priceChange: `MSRP priceChangeSku: ${item._parent_sku}, MSRP price: ${item._msrp}, ***** was: ${item._previousPriceList.price_msrp} `
                }
                // return (priceChangeSkus = [...priceChangeSkus, item])
                // return item
              }
              if (item._wholesale !== item._previousPriceList.price_wholesale) {
                // console.log(`_wholesale priceChangeSkus: ${item._parent_sku} \n
                // _wholesale price ${item._wholesale} \n
                // ***** was ${item._previousPriceList.price_wholesale}\n `)
                item._priceChange = {
                  ...item._priceChange,
                  _wholesale_priceChange: `_wholesale priceChangeSku: ${item._parent_sku}, _wholesale price: ${item._wholesale}, ***** was: ${item._previousPriceList.price_wholesale}`
                }
                // return (priceChangeSkus = [...priceChangeSkus, item])
                // return item
              }
              return item._priceChange
                ? (priceChangeSkus = [...priceChangeSkus, item])
                : (priceChangeSkus = [...priceChangeSkus])
              // return console.log(`No Change: ${item._parent_sku} \n`)
              // return priceChangeSkus
              // return item
            }
          })

    let setAtionStates = (addSkus, deleteSkus, priceChangeSkus) => {
      setAdd_gsa_skus(addSkus)
      setDelete_gsa_skus(deleteSkus)
      setPriceChange_gsa_skus(priceChangeSkus)
    }

    await sortActions(singleSkuArray)
    await setAtionStates(addSkus, deleteSkus, priceChangeSkus)

    let actions = { addSkus, deleteSkus, priceChangeSkus }
    // console.log(
    //   `///// addSkus:${actions.addSkus.length},\n
    //   deleteSkus:${actions.deleteSkus.length},\n
    //   priceChangeSkus:${actions.priceChangeSkus.length}`
    // )
    return actions
  }

  let selectedFormat = selectedDocsLists.find(el => {
    // console.log('GSA_processorPage el.formatSelection: ',el.formatSelection)
    return el.formatSelection === true
  })
  //   console.log('GSA_processorPage selectedFormat: ',selectedFormat)

  let updateSelectedPriceLists = async (newlySelected, action) => {
    let newListArray
    if (action === 'delete') {
      newListArray = selectedPriceLists.filter(
        el => el.idKey !== newlySelected.idKey
      )
      if (newListArray[0] === undefined) {
        newListArray[0] = 'selectedPriceLists'
      }
      return setSelectedPriceLists(newListArray)
    }
    if (action !== 'delete') {
      let newObj = {
        idKey: newlySelected.google_price_list_file
          .replaceAll('https://docs.google.com/spreadsheets/d/', '')
          .split('/edit')[0],
        brand: newlySelected.brand,
        displayProducts: true,
        hasProducts: []
      }
      selectedPriceLists[0] === 'selectedPriceLists'
        ? (newListArray = [newObj])
        : (newListArray = [...selectedPriceLists, newObj])
      // setSelectedPriceLists(newListArray)
      // newObj.hasProducts = await getProductData([newlySelected.brand]).then(
      //   res => res
      // )
      // newListArray = newListArray.filter(el => el.idKey !== newObj.idKey)
      // newListArray = [...newListArray, newObj]
      return setSelectedPriceLists(newListArray)
    }
    return console.log('end updateSelectedPriceLists()')
  }

  let updateSelectedDocsLists = async (newlySelected, action) => {
    let newListArray

    if (action === 'delete') {
      newListArray = selectedDocsLists.filter(
        el => el.idKey !== newlySelected.idKey
      )
      if (newListArray[0] === undefined) {
        newListArray[0] = 'selectedDocsLists'
      }
      return setSelectedDocsLists(newListArray)
    }

    if (action === 'select format') {
      newListArray = [...selectedDocsLists]
      let formatedIndex = newListArray.findIndex(
        doc => doc.formatSelection === true
      )
      let currentFormatObj = { ...newListArray[formatedIndex] }
      let newlySelectedIndex = newListArray.indexOf(newlySelected)

      if (formatedIndex !== -1) {
        currentFormatObj.formatSelection = !currentFormatObj.formatSelection
        newListArray[formatedIndex] = currentFormatObj
      }

      newListArray[
        newlySelectedIndex
      ].formatSelection = !newlySelected.formatSelection

      return setSelectedDocsLists(newListArray)
    }

    if (action === 'add selection') {
      let newObj = {
        idKey: `${newlySelected.docSheetId}-${newlySelected.doc_sheet_name}`,
        doc_name: newlySelected.doc_name,
        doc_sheet_name: newlySelected.doc_sheet_name,
        formatSelection: false,
        displayProducts: false,
        hasData: []
      }

      newListArray =
        selectedDocsLists[0] === 'selectedDocsLists'
          ? [newObj]
          : [...selectedDocsLists, newObj]

      // setSelectedDocsLists(newListArray)

      // newObj.hasData = await getDocData(
      //   JSON.stringify({
      //     docSheetId: newlySelected.docSheetId,
      //     doc_sheet_name: newlySelected.doc_sheet_name
      //   })
      // ).then(res => res)
      // newListArray = newListArray.filter(el => el.idKey !== newObj.idKey)

      // newListArray = [...newListArray, newObj]

      return setSelectedDocsLists(newListArray)
    }

    return console.log('end updateSelectedDocsLists()')
  }

  let filterOptionsbySelected = (optionsList, selectedList) => {
    let filteredOptions = optionsList?.filter(el => {
      let found = selectedList?.find(selection => selection.idKey === el.idKey)
      //   console.log('found: ',found)
      return el.idKey !== found?.idKey
    })
    // console.log('filteredOptions: ',filteredOptions)

    return filteredOptions
  }

  let filteredPriceLists = filterOptionsbySelected(
    priceLists,
    selectedPriceLists
  )
  let filteredDocLists = filterOptionsbySelected(docLists, selectedDocsLists)

  // let sortPriceListPropSelections = response => {
  //   let tempArr = []
  //   let inPropsArr = []

  //   response.map(el => {
  //     el.idKey = `${
  //       el.google_price_list_file
  //         .replaceAll('https://docs.google.com/spreadsheets/d/', '')
  //         .split('/edit')[0]
  //     }`

  //     let foundBrandInProps = props.combinedByPriceListSKU.find(
  //       sku => sku._brand === el.brand
  //     )
  //     // console.log(`foundBrandInProps: ${foundBrandInProps?._brand}`)
  //     // console.log(`el._brand: ${el._brand}`)
  //     // console.log(`props.combinedByPriceListSKU: ${props.combinedByPriceListSKU.length}`)
  //     return foundBrandInProps
  //       ? ((inPropsArr = [...inPropsArr, el]), (tempArr = [...tempArr, el]))
  //       : (tempArr = [...tempArr, el])
  //   })
  //   let setIt = (tempArr, inPropsArr) => (
  //     setPriceLists(tempArr), setSelectedPriceLists(inPropsArr)
  //   )
  //   return setIt(tempArr, inPropsArr)
  // }
let break_between_commentedOut_funcs
  // let sortDocsListPropSelections = response => {
  //   let tempArr = []
  //   let inPropsArr = []
  //   let docDeets_idKeyArr = [] //ex: "1WGfBmKDiFdPfwjh8nmqxJI9VJJZ1I2S6BdwQbzmvPwE-PRODUCTS WITH DISCOUNT (A)-Data Sorting with notes for Decrease EPA MOD - Copy of MOD_ Price Proposal Template PRODUCTS Refresh 9 (google format)"
  //   props.combinedByPriceListSKU.map(sku => {
  //     sku?.docDeets?.map(doc => {
  //       let docKey = doc._idKey//.split("-")[0]
  //       let existing_idKey = docDeets_idKeyArr.find(key => key === docKey)
  //       // console.log(`existing_idKey: ${existing_idKey}`)
  //       return existing_idKey
  //         ? docDeets_idKeyArr
  //         : (docDeets_idKeyArr = [...docDeets_idKeyArr, docKey])
  //     })
  //     return docDeets_idKeyArr
  //   })
  //   // console.log(`docDeets_idKeyArr: ${docDeets_idKeyArr}`)
  //   response.map(el => {
  //     el.idKey = `${el.docSheetId}-${el.doc_sheet_name}`
  //     // console.log(`el.docSheetId: ${el.docSheetId}`)

  //     let foundDocInProps = docDeets_idKeyArr.find(key => key === `${el.docSheetId}-${el.doc_sheet_name}-${el.doc_name}`)
  //     // console.log(`foundDocInProps: ${foundDocInProps}`)
  //     // console.log(`el.docSheetId: ${el.docSheetId}`)

  //     //        return foundInDocDeets?._idKey === el?.idKey
  //     //       })
  //     // console.log(`foundDocInProps: ${foundDocInProps?._idKey}`)
  //     // console.log(`el._brand: ${el._brand}`)
  //     // console.log(`props.combinedByPriceListSKU: ${props.combinedByPriceListSKU.length}`)
  //     return foundDocInProps
  //       ? (inPropsArr = [...inPropsArr, el],tempArr = [...tempArr, el])
  //       : (tempArr = [...tempArr, el])
  //   })
  //   let setIt = (tempArr, inPropsArr) => (
  //     setDocLists(tempArr), setSelectedDocsLists(inPropsArr)
  //   )
  //   return setIt(tempArr, inPropsArr)
  // }
  let consumePropsToState = async() => {
    setPriceLists(props.priceLists)
    setSelectedPriceLists(props.selectedPriceLists)
    setDocLists(props.docLists)
    setSelectedDocsLists(props.selectedDocsLists)
    return reduceToSingleSkuList(props.combinedByPriceListSKU)
  }

  useEffect(() => {
    let mounted = true
    if (mounted) {
      // getPriceLists().then(response => {
      //   sortPriceListPropSelections(response)
      // })

      // getDocsLists()
      //   .then(response => {
      //     let tempArr = response.map(el => {
      //       el.idKey = `${el.docSheetId}-${el.doc_sheet_name}`
      //       return el
      //     })
      //     return setDocLists(tempArr)
      //     // sortDocsListPropSelections(response)
      //   })
      //   .then(() => reduceToSingleSkuList(props.combinedByPriceListSKU))
      //   .then(singleSkuArray => sortCurrentGSAskus(singleSkuArray))
      //   .then(singleSkuArray => sortByAction(singleSkuArray))
      //   .then(actions =>
      //     console.log(
      //       `count of items by action\n 
      //       addSkus:${actions.addSkus.length},\n 
      //       deleteSkus:${actions.deleteSkus.length},\n 
      //       priceChangeSkus:${actions.priceChangeSkus.length}`
      //     )
      //   )

      // setPriceLists(props.priceLists)
      // setSelectedPriceLists(props.selectedPriceLists)
      // setDocLists(props.docsLists)
      // setSelectedDocsLists(props.selectedDocsLists)
      // reduceToSingleSkuList(props.combinedByPriceListSKU)
      // sortCurrentGSAskus(singleSkuArray)
      // sortByAction(singleSkuArray)
      consumePropsToState()
        .then(singleSkuArray => sortCurrentGSAskus(singleSkuArray))
        .then(singleSkuArray => sortByAction(singleSkuArray))
        .then(actions =>
          console.log(
            `count of items by action\n 
            ${Object.keys(BrandPriceListObj)}\n 
            addSkus:${actions.addSkus.length},\n 
            deleteSkus:${actions.deleteSkus.length},\n 
            priceChangeSkus:${actions.priceChangeSkus.length}`
          )
        )
    }
    return () => (mounted = false)
  }, [])

  return (
    <div style={style1}>
      <div style={style2}>
        <h4>Welcome to the GSA_processorPage!</h4>
        <h6>Choose an option to assess your documents.</h6>
      </div>

      <ViewSelectionLists
        style={style2}
        viewProps={{
          filteredPriceLists,
          filteredDocLists,
          selectedDocsLists,
          updateSelectedPriceLists,
          updateSelectedDocsLists
        }}
      />
      <ViewSelected
        style={style2}
        viewProps={{
          selectedPriceLists,
          selectedDocsLists,
          selectedFormat,
          updateSelectedPriceLists,
          updateSelectedDocsLists
        }}
      />
      <SelectedFormatTable
        style={style3}
        viewProps={{
          priceLists,
          docLists,
          selectedPriceLists,
          selectedDocsLists,
          gsa_sku_data,
          selectedFormat
        }}
      />
    </div>
  )
}
