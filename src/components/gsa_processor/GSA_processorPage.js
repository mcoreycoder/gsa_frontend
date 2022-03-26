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

export default function GSA_processorPage () {
  const [priceLists, setPriceLists] = useState(['priceLists'])
  const [docLists, setDocLists] = useState(['docsLists'])
  const [selectedPriceLists, setSelectedPriceLists] = useState([
    `selectedPriceLists`
  ])
  const [selectedDocsLists, setSelectedDocsLists] = useState([
    `selectedDocsLists`
  ])
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
      setSelectedPriceLists(newListArray)
      newObj.hasProducts = await getProductData([newlySelected.brand]).then(
        res => res
      )
      newListArray = newListArray.filter(el => el.idKey !== newObj.idKey)
      newListArray = [...newListArray, newObj]
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
      let currentFormatObj =  {...newListArray[formatedIndex]} 
      let newlySelectedIndex = newListArray.indexOf(newlySelected)

      if (formatedIndex !== -1) {
        currentFormatObj.formatSelection = !currentFormatObj.formatSelection
        newListArray[formatedIndex] = currentFormatObj
      }
      
      newListArray[newlySelectedIndex].formatSelection = !newlySelected.formatSelection
      
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

      setSelectedDocsLists(newListArray)

      newObj.hasData = await getDocData(
        JSON.stringify({
          docSheetId: newlySelected.docSheetId,
          doc_sheet_name: newlySelected.doc_sheet_name
        })
      ).then(res => res)
      newListArray = newListArray.filter(el => el.idKey !== newObj.idKey)

      newListArray = [...newListArray, newObj]

      return setSelectedDocsLists(newListArray)
    }

    return console.log('end updateSelectedDocsLists()')
  }

  let filterOptionsbySelected = (optionsList, selectedList) => {
    let filteredOptions = optionsList.filter(el => {
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

  useEffect(() => {
    let mounted = true
    if (mounted) {
      getPriceLists().then(response => {
        let tempArr = response.map(el => {
          el.idKey = `${
            el.google_price_list_file
              .replaceAll('https://docs.google.com/spreadsheets/d/', '')
              .split('/edit')[0]
          }`
          return el
        })
        setPriceLists(tempArr)
      })
      getDocsLists().then(response => {
        let tempArr = response.map(el => {
          el.idKey = `${el.docSheetId}-${el.doc_sheet_name}`
          return el
        })
        setDocLists(tempArr)
      })
    }
    return () => (mounted = false)
  }, [])

  return (
    <div>
      <h4>Welcome to the GSA_processorPage!</h4>
      <h6>Choose an option to assess your documents.</h6>

      <ViewSelectionLists
        viewProps={{
          filteredPriceLists,
          filteredDocLists,
          selectedDocsLists,
          updateSelectedPriceLists,
          updateSelectedDocsLists
        }}
      />
      <ViewSelected
        viewProps={{
          selectedPriceLists,
          selectedDocsLists,
          selectedFormat,
          updateSelectedPriceLists,
          updateSelectedDocsLists
        }}
      />
    </div>
  )
}
