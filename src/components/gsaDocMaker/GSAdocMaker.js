import React, { useState, useEffect } from 'react'
import {
  getPriceLists,
  getProductData,
  getDocsLists,
  getDocData
} from './gsaDocMakerFunks/apiCalls'
import docOptions from './docMakerComponents.js/docOptions'
import selections from './docMakerComponents.js/selections'
import composeData from './docMakerComponents.js/composeData'

export default function GSAdocMaker (props) {
  const [priceLists, setPriceLists] = useState(['priceLists'])
  const [docLists, setDocLists] = useState(['docsLists'])
  const [selectedPriceLists, setSelectedPriceLists] = useState([
    `selectedPriceLists`
  ])
  const [selectedDocsLists, setSelectedDocsLists] = useState([
    `selectedDocsLists`
  ])

  let updateSelectedPriceLists = async (newlySelected, action) => {
    let newListArray
    let newObj =
      action === 'delete'
        ? newlySelected
        : {
          idKey: newlySelected.google_price_list_file
              .replaceAll('https://docs.google.com/spreadsheets/d/', '')
              .split('/edit')[0],
            brand: newlySelected.brand,
            displayProducts: true,
            hasProducts: await getProductData([newlySelected.brand]).then(res => res)
          }
    if (selectedPriceLists[0] === 'selectedPriceLists') {
      newListArray = [newObj]
    } else {
      action === 'delete'
        ? (newListArray = selectedPriceLists.filter(el => el.idKey !== newObj.idKey))
        : (newListArray = [...selectedPriceLists, newObj])
    }
    if (newListArray[0] === undefined) {
      newListArray[0] = 'selectedPriceLists'
    }
    return setSelectedPriceLists(newListArray)
  }

  let updateSelectedDocsLists = async (newlySelected, action) => {
    let newList
    let newObj =
      action === 'delete'
        ? newlySelected
        : {
          idKey: `${newlySelected.docSheetId}-${newlySelected.doc_sheet_name}`,
            doc_name: newlySelected.doc_name,
            displayProducts: true,
            hasData: await getDocData(JSON.stringify({
              docSheetId: newlySelected.docSheetId,
              doc_sheet_name: newlySelected.doc_sheet_name
            })).then(res => res)
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
      let found = selectedList?.find(selection => selection.idKey === el.idKey)
      return el.idKey !== found?.idKey
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
  let showData = composeData(
    selectedPriceLists,
    docLists, 
    selectedDocsLists,
  )

  

  useEffect(() => {
    let mounted = true
    if (mounted) {
      getPriceLists().then(response => {
        let tempArr = response.map(el => {
          el.idKey = `${el.google_price_list_file
            .replaceAll('https://docs.google.com/spreadsheets/d/', '')
            .split('/edit')[0]}`
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
      <h3>Hello from GSAdocMaker</h3>
      <div>{showSelectOptions}</div>
      <div>{showSelections}</div>
      <hr/><hr/><p>Show Data Below</p><hr/><hr/>
      <div>{showData}</div>
    </div>
  )
}
