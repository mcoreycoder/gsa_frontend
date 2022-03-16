import React, { useState, useEffect } from 'react'
import {
  getPriceLists,
  getProductData,
  getDocsLists,
  getDocData
} from './gsaDocMakerFunks/apiCalls'
import docOptions from './docMakerComponents.js/docOptions'
import selections from './docMakerComponents.js/selections'

export default function GSAdocMaker (props) {
  const [priceLists, setPriceLists] = useState(['priceLists'])
  const [docLists, setDocLists] = useState(['docsLists'])
  const [selectedPriceLists, setSelectedPriceLists] = useState([
    `selectedPriceLists`
  ])
  const [selectedDocsLists, setSelectedDocsLists] = useState([
    `selectedDocsLists`
  ])

  let updateSelectedPriceLists = (newlySelected, action) => {
    let newList
    let newObj =
      action === 'delete'
        ? newlySelected
        : {
            id: newlySelected.google_price_list_file
              .replaceAll('https://docs.google.com/spreadsheets/d/', '')
              .split('/edit')[0],
            brand: newlySelected.brand,
            displayProducts: true
          }
    if (selectedPriceLists[0] === 'selectedPriceLists') {
      newList = [newObj]
    } else {
      action === 'delete'
        ? (newList = selectedPriceLists.filter(el => el.id !== newObj.id))
        : (newList = [...selectedPriceLists, newObj])
    }
    if (newList[0] === undefined) {
      newList[0] = 'selectedPriceLists'
    }
    return setSelectedPriceLists(newList)
  }

  let updateSelectedDocsLists = (newlySelected, action) => {
    let newList
    let newObj =
      action === 'delete'
        ? newlySelected
        : {
            id: newlySelected.docSheetId,
            doc_name: newlySelected.doc_name,
            displayProducts: true
          }
    if (selectedDocsLists[0] === 'selectedDocsLists') {
      newList = [newObj]
    } else {
      action === 'delete'
        ? (newList = selectedDocsLists.filter(el => el !== newObj))
        : (newList = [...selectedDocsLists, newObj])
    }
    if (newList[0] === undefined) {
      newList[0] = 'selectedDocsLists'
    }
    return setSelectedDocsLists(newList)
  }

  let filterOptionsbySelected = (optionsList, selectedList) => {
    let filteredOptions = optionsList.filter(el => {
      if (el.google_price_list_file !== undefined) {
        el.id = el.google_price_list_file
          .replaceAll('https://docs.google.com/spreadsheets/d/', '')
          .split('/edit')[0]
      }
      if (el.docSheetId !== undefined) {
        el.id = el.docSheetId
      }
      let found = selectedList.find(selection => selection.id === el.id)
      return el.id !== found?.id
    })
    return filteredOptions
  }

  let showSelectOptions = docOptions(
    filterOptionsbySelected(priceLists, selectedPriceLists),
    filterOptionsbySelected(docLists, selectedDocsLists),
    updateSelectedPriceLists,
    updateSelectedDocsLists
  )
  let showSelections = selections(
    selectedPriceLists,
    selectedDocsLists,
    updateSelectedPriceLists,
    updateSelectedDocsLists,
    getProductData,
    getDocData
  )

  useEffect(() => {
    let mounted = true
    if (mounted) {
      getPriceLists().then(response => {
        console.log('setting pricelists')
        setPriceLists(response)
      })
      getDocsLists().then(response => {
        console.log('setting doclists')
        setDocLists(response)
      })
    }
    return () => (mounted = false)
  }, [])

  return (
    <div>
      <h3>Hello from GSAdocMaker</h3>
      <div>{showSelectOptions}</div>
      <div>{showSelections}</div>
    </div>
  )
}
