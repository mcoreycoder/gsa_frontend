// import React, { useState, useEffect } from 'react'
// import PriceLists from './PriceLists'
import React, { useState, useEffect } from 'react'
import apiCaller from './functions/apiCaller'

let getPriceLists = () =>
  apiCaller({ route: `/sheets/pricelists`, method: `GET` })
let getDocsLists = () =>
  apiCaller({ route: `/sheets/gsa_docslists`, method: `GET` })
let getProductData = brandsArr =>
  apiCaller({ route: `/sheets/products/?brands=${brandsArr}`, method: `GET` })
let getDocData = docsArr =>
  apiCaller({ route: `/sheets/gsa_docsdata/?docs=${docsArr}`, method: `GET` })

export default function OldGSA () {
  const [priceLists, setPriceLists] = useState(['priceLists'])
  const [docsLists, setDocsLists] = useState(['docsLists'])

  const [selectedPriceLists, setSelectedPriceLists] = useState([
    `selectedPriceLists`
  ])
  const [selectedDocsLists, setSelectedDocsLists] = useState([
    `selectedDocsLists`
  ])

  // Pricelist/Brand section
  let isBrandSelected = brand =>
    selectedPriceLists.find(el => el.brand === brand)

  let addSelectedPriceList = brand => {
    if (isBrandSelected(brand) === undefined) {
      // console.log(`addSelectedPriceList: adding ${brand} to selectedLists`)
      let addBrand = {
        brand: brand,
        displayProducts: false,
        hasProducts: ['empty']
      }
      let updateList =
        selectedPriceLists[0] === `selectedPriceLists`
          ? [addBrand]
          : [...selectedPriceLists, addBrand]
      setSelectedPriceLists(updateList)
    }
    // console.log(`addSelectedPriceList: ${brand} is in selectedLists`)
  }

  let clearSelectedPriceList = brand => {
    if (brand === `clearAll` || selectedPriceLists.length === 1) {
      return setSelectedPriceLists(['selectedPriceLists'])
    }
    return setSelectedPriceLists(
      selectedPriceLists.filter(el => el.brand !== brand)
    )
  }

  let sendPriceListSelections = async selectedBrands => {
    let updateLists = selectedPriceLists
    for (let i = 0; i < selectedBrands.length; i++) {
      if (selectedBrands[i].hasProducts[0] === 'empty') {
        let updateIndex = updateLists.indexOf(selectedBrands[i])
        await getProductData(selectedBrands[i].brand).then(res => {
          updateLists[updateIndex].hasProducts = [...res]
          updateLists[updateIndex].displayProducts = true
        })
      }
    }

    setSelectedPriceLists([]) //have to clear state and reload to prompt rerender since it is a property of an object being updated but the list itself is unchanged
    return setSelectedPriceLists(updateLists)
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
            <br />
            {brand.current_gsa_price_list_name}
            <br />
          </button>
        </div>
      )
    })

    return brandsMapped
  }

  let displayBrand = brandObj => {
    let hasProductsListed = isBrandSelected(brandObj.brand)
    if (hasProductsListed.hasProducts[0] === 'empty') {
      return sendPriceListSelections([brandObj])
    } else {
      let updateLists = selectedPriceLists.map(el => {
        if (el.brand === brandObj.brand) {
          el.displayProducts = !el.displayProducts
        }
        return el
      })
      return setSelectedPriceLists(updateLists)
    }
  }

  let mapSelectedPriceLists = arr => {
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
            {selectedPriceLists[0] === 'selectedPriceLists'
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

  // Docs section
  let isDocSelected = doc =>
    selectedDocsLists.find(
      //   el =>
      //     el.category === doc.category &&
      //     el.doc_name === doc.doc_name &&
      //     el.doc_sheet_name === doc.doc_sheet_name
      el =>
        el.docSheetId === doc.docSheetId &&
        el.doc_sheet_name === doc.doc_sheet_name
    )

  let addSelectedDocsList = doc => {
    if (isDocSelected(doc) === undefined) {
      // console.log(`addSelectedPriceList: adding ${brand} to selectedLists`)
      let addDoc = {
        docSheetId: doc.docSheetId,
        category: doc.category,
        doc_notes: doc.doc_notes,
        doc_link: doc.doc_link,
        doc_name: doc.doc_name,
        doc_sheet_name: doc.doc_sheet_name,
        displayData: false,
        hasData: ['empty']
      }
      let updateList =
        selectedDocsLists[0] === `selectedDocsLists`
          ? [addDoc]
          : [...selectedDocsLists, addDoc]
      setSelectedDocsLists(updateList)
    }
    // console.log(`addSelectedPriceList: ${brand} is in selectedLists`)
  }

  let clearSelectedDocsLists = docObj => {
    if (docObj === `clearAll` || selectedDocsLists.length === 1) {
      return setSelectedDocsLists(['selectedDocsLists'])
    }
    return setSelectedDocsLists(
      selectedDocsLists.filter(
        el =>
          el.docSheetId + el.doc_sheet_name !==
          docObj.docSheetId + docObj.doc_sheet_name
      )
    )
  }

  let sendDocListSelections = async selectedDocs => {
    let updateLists = selectedDocsLists
    for (let i = 0; i < selectedDocs.length; i++) {
      if (selectedDocs[i].hasData[0] === 'empty') {
        let updateIndex = updateLists.indexOf(selectedDocs[i])
        await getDocData(
          JSON.stringify({
            docSheetId: selectedDocs[i].docSheetId,
            doc_sheet_name: selectedDocs[i].doc_sheet_name
          })
        ).then(res => {
          updateLists[updateIndex].hasData = [...res]
          updateLists[updateIndex].displayData = true
        })
      }
    }

    setSelectedDocsLists(['selectedDocsLists']) //have to clear state and reload to prompt rerender since it is a property of an object being updated but the list itself is unchanged, had to update to show 'empty' or it broke other logic in the code
    return setSelectedDocsLists(updateLists)
  }

  let mapDocsLists = arr => {
    let docsMapped = arr.map((doc, i) => {
      return (
        <div key={i}>
          <button
            onClick={e => {
              e.preventDefault()
              addSelectedDocsList({
                docSheetId: doc.docSheetId,
                category: doc.category,
                doc_notes: doc.doc_notes,
                doc_link: doc.doc_link,
                doc_name: doc.doc_name,
                doc_sheet_name: doc.doc_sheet_name
              })
            }}
          >
            {doc.category} <br />
            {doc.doc_name} <br />
            {doc.doc_sheet_name} <br />
          </button>
        </div>
      )
    })

    return docsMapped
  }

  let displayDocData = docObj => {
    let hasProductsListed = isDocSelected(docObj)
    if (hasProductsListed.hasData[0] === 'empty') {
      return sendDocListSelections([docObj])
    } else {
      let updateLists = selectedDocsLists.map(el => {
        if (el.docSheetId === docObj.docSheetId && el.doc_sheet_name === docObj.doc_sheet_name) {
          el.displayData = !el.displayData
        }
        return el
      })
      setSelectedDocsLists(['selectedDocsLists'])
      return setSelectedDocsLists(updateLists)
    }
  }

  let mapSelectedDocsLists = arr => {
    let docsMapped = arr.map((docObj, i) => {
      return (
        <div key={i}>
          {docObj.category} <br />
          {docObj.doc_name} <br />
          {docObj.doc_sheet_name} <br />
          <button
            onClick={e => {
              e.preventDefault()
              displayDocData(docObj)
            }}
          >
            {selectedDocsLists[0] === 'selectedDocsLists'
              ? null
              : docObj.displayData === true
              ? `Hide Data`
              : `View Data`}
          </button>
          <button
            onClick={e => {
              e.preventDefault()
              clearSelectedDocsLists(docObj)
            }}
          >
            Remove
          </button>
        </div>
      )
    })

    return docsMapped
  }

  // compile selected Price lists and Docs section
  // will need to use all parts of state
  // priceLists & docsLists for mapping links and doc headers to create <th>'s
  // selectedPriceLists & selectedDocsLists for creating <td>'s for data

  let makeTable = (chosenDocs, chosenPriceLists) => {
    let tableHeadersObj =
      chosenDocs[0] !== `selectedDocsLists`
        ? docsLists.filter(
            el =>
              chosenDocs[0].docSheetId === el.docSheetId &&
              chosenDocs[0].doc_sheet_name === el.doc_sheet_name
          )[0].header_columns
        : null
    // console.log('tableHeadersObj:', tableHeadersObj)
    let createTableHeaders = () => {
      if (chosenDocs[0] !== `selectedDocsLists`) {
        let headerTitles = Object.keys(tableHeadersObj).map(header_column => {
          return tableHeadersObj[header_column]
        })
        headerTitles = ['doc_notes', 'doc_name', 'doc_sheet_name', ...headerTitles]

        let mapHeaderTitles = headerTitles.map((header_column, i) => {
          return (
            <th key={i} colSpan='1' style={{ border: '1px solid blue' }}>
              {header_column}
            </th>
          )
        })

        return mapHeaderTitles
      }
    }

    let createTableData = () => {
      let itemData = []

      chosenDocs.map((doc, i) => {
        if (
          chosenDocs[0] !== `selectedDocsLists` &&
          doc.hasData[0] !== 'empty' &&
          doc.displayData !== false
        ) {
          doc.hasData.map((item, j) => {
            let newItem = {
              doc_notes: doc.doc_notes,
              doc_name: doc.doc_name,
              doc_sheet_name: doc.doc_sheet_name
              // ...item
            }

            let propMatcher = () => {
              let checkForPropsObj = docsLists.filter(
                el =>
                  doc.docSheetId === el.docSheetId &&
                  doc.doc_sheet_name === el.doc_sheet_name
              )[0].header_columns
              //   console.log('checkForPropsObj', checkForPropsObj)
              let checkForPropsObjKeys = Object.keys(checkForPropsObj)
              let checkForPropsObjValues = Object.values(checkForPropsObj)
              let tableHeadersObjValues = Object.values(tableHeadersObj)

              tableHeadersObjValues.map(headerVal => {
                // let foundProp = checkForPropsObjValues.find(propVal => propVal === headerVal)
                let foundPropIndex = checkForPropsObjValues.indexOf(headerVal)
                // console.log(`foundProp: `, foundProp)
                // console.log(`foundPropIndex: `, foundPropIndex)
                if (foundPropIndex !== -1) {
                  let formatedHeaderVal = headerVal
                    .toLowerCase()
                    .split(' ')
                    .join('_')
                  newItem = {
                    ...newItem,
                    [formatedHeaderVal]:
                      item[checkForPropsObjKeys[foundPropIndex]] //item[checkForPropsObjKeys[x]]
                  }
                  // console.log(`newItem: `, newItem)
                  //    console.log(`item[checkForPropsObjKeys[foundPropIndex]]: `, item[checkForPropsObjKeys[foundPropIndex]])
                  return newItem
                }

                return newItem
              })
            }
            propMatcher()

            itemData = [...itemData, newItem]
            itemData.sort((a, b) => {
              // let sortBy = MFGPART
              let sortBy = 'mfgpart'
              // let sortBy = 'mfgname'
              if (a[sortBy] < b[sortBy]) {
                //will need to refactor to make more dynamic
                return -1
              }
              if (a[sortBy] > b[sortBy]) {
                //will need to refactor to make more dynamic
                return 1
              }
              return 0
            })
          })
        }
      })

      chosenPriceLists.map((pricelist, i) => {
        if (
          chosenPriceLists[0] !== `selectedPriceLists` &&
          pricelist.hasProducts[0] !== 'empty' &&
          pricelist.displayProducts !== false
        ) {
          pricelist.hasProducts.map((item, j) => {
            let newItem = {
              brand: item.brand,
              priceListName: item.current_gsa_price_list_name
              //   ...item //breaks because it cannot map if props dont match
            }

            let connectProps = item => {
              let match_header_columns = docsLists.filter(
                el => el.doc_sheet_name === 'Keys'
              )[0].header_columns

              let matchDocHeadersDataArr = selectedDocsLists.filter(
                el => el.doc_sheet_name === 'Keys'
              )[0].hasData

              let matchObjKeys = Object.keys(match_header_columns)
              let matchObjValues = Object.values(match_header_columns)
              let itemObjKeys = Object.keys(item)
              let itemObjValues = Object.values(item)
              let itemVariantsObjKeys = Object.keys(item.variants)
              let itemVariantsObjValues = Object.values(item.variants)
              let tableHeadersObjValues = Object.values(tableHeadersObj)

              tableHeadersObjValues.map(headerVal => {
                console.log('headerVal:', headerVal)
                let formatedHeaderVal = headerVal.toLowerCase().split(' ').join('_')
                let matchedPropIndex = matchObjValues.indexOf(headerVal) //use to check possition to match keyHeadersObj
                
                let propVal = matchDocHeadersDataArr.map(keyHeadersObj => {
                  let keyHeadersObjVals = Object.values(keyHeadersObj) 
                  // console.log('keyHeadersObjVals', keyHeadersObjVals[matchedPropIndex]) // output to match item prop to get matching data ex:'price_parent_sku', 'upc_parent_sku', 'MFR PART NO'
                  
                  let itemObjKeysPropIndex = itemObjKeys.indexOf(keyHeadersObjVals[matchedPropIndex])
                  // console.log('itemObjKeysPropIndex', itemObjKeysPropIndex) // seems to be consistant indexing for item prop that matches
                  // console.log('itemObjValues', itemObjValues[itemObjKeysPropIndex]) // seems to be pulling correct values back from pricelist details

                  if(itemObjKeysPropIndex !== -1){
                    // console.log('itemPropIndex', itemPropIndex) 
                    // console.log('itemPropIndex', itemObjValues[itemPropIndex]) 
                    // console.log('formatedHeaderVal', formatedHeaderVal) 
                    console.log('itemObjValues', `${[formatedHeaderVal]}: ${itemObjValues[itemObjKeysPropIndex]}`) // seems to be pulling correct values back from pricelist details

                  // return  itemObjValues[itemObjKeysPropIndex]
                  }
                  
                  return  itemObjValues[itemObjKeysPropIndex]

                })
              

                newItem = {
                  ...newItem,
                  // [formatedHeaderVal]: itemObjValues[itemObjKeysPropIndex]
                  // [formatedHeaderVal]: headerVal //only for testing
                  [formatedHeaderVal]: propVal //only for testing
                }
                // console.log(`newItem`,newItem)
                return newItem
              })
              return newItem
            }

            connectProps(item)
            itemData = [...itemData, newItem]
            itemData.sort((a, b) => {
              // let sortBy = MFGPART
              let sortBy = 'mfgpart'
              // let sortBy = 'mfgname'
              if (a[sortBy] < b[sortBy]) {
                //will need to refactor to make more dynamic
                return -1
              }
              if (a[sortBy] > b[sortBy]) {
                //will need to refactor to make more dynamic
                return 1
              }
              return 0
            })
          })
        }
      })

      return itemData.map((item, i) => {
        let rowData = Object.keys(item).map((prop, j) => {
          return (
            <td key={`rowData${j}`} style={{ border: '1px solid orange' }}>
              {item[prop]}
            </td>
          )
        })
        return <tr key={`row${i}`}>{rowData}</tr>
      })
    }
    //     let createTableData = () => {
    //       let tabelRow = chosenDocs.map((doc, i) => {
    //         if (
    //           chosenDocs[0] !== `selectedDocsLists` &&
    //           doc.hasData[0] !== 'empty'
    //         ) {
    //              let allRows = doc.hasData.map((item,j)=>{
    // let rowData = Object.keys(item).map(prop => {
    //     return <td style={{border:'1px solid orange'}}>{item[prop]}</td>

    // })
    // rowData = [<td style={{border:'1px solid orange'}}>{doc.doc_notes} {doc.doc_name}</td>, ...rowData]
    //                  return <tr>
    //                      {rowData}
    //                  </tr>

    //              })
    //              return allRows
    //         }
    //       })
    //       return tabelRow
    //     }

    let showHeader = createTableHeaders()
    let showData = createTableData()
    return (
      <table
        style={{
          position: 'absolute',
          left: 0,
          border: '1px solid green',
          fontSize: `12px`,
          backgroundColor: 'black'
        }}
      >
        <thead>
          <tr>
            {/* <th colspan='1' style={{border:'1px solid blue'}}>header 1</th>
          <th colspan='2' style={{border:'1px solid blue'}}>header 2</th>
          <th colspan='3' style={{border:'1px solid blue'}}>header 3</th> */}
            {showHeader}
          </tr>
        </thead>
        <tbody>
          <tr>
            {/* <td style={{border:'1px solid orange'}}>row 1, column 1</td>
          <td style={{border:'1px solid orange'}}>row 1, column 2</td>
          <td style={{border:'1px solid orange'}}>row 1, column 3</td>
          <td style={{border:'1px solid orange'}}>row 1, column 4</td>
          <td style={{border:'1px solid orange'}}>row 1, column 5</td>
          <td style={{border:'1px solid orange'}}>row 1, column 6</td> */}
          </tr>
          <tr>
            {/* <td style={{border:'1px solid orange'}}>row 2, column 1</td>
          <td style={{border:'1px solid orange'}}>row 2, column 2</td>
          <td style={{border:'1px solid orange'}}>row 2, column 3</td>
          <td style={{border:'1px solid orange'}}>row 2, column 4</td> */}
          </tr>
          {showData}
        </tbody>
      </table>
    )
  }

  // create display variables
  let displayPriceList = mapPriceLists(priceLists)
  let displayDocsList = mapDocsLists(docsLists)
  let displayselectedPriceLists = mapSelectedPriceLists(selectedPriceLists)
  let displayselectedDocsLists = mapSelectedDocsLists(selectedDocsLists)
  let displayTable = makeTable(selectedDocsLists, selectedPriceLists)

  useEffect(() => {
    let mounted = true
    // implement to make call and get price list when component is rendering
    getPriceLists().then(response => {
      if (mounted) {
        setPriceLists(response)
      }
    })
    getDocsLists().then(response => {
      if (mounted) {
        setDocsLists(response)
      }
    })

    return () => (mounted = false)
  }, [])

  return (
    <div>
      selected Price Lists:
      {selectedPriceLists[0] === 'selectedPriceLists'
        ? null
        : displayselectedPriceLists}
      <hr />
      selected Docs:
      {selectedDocsLists[0] === 'selectedDocsLists'
        ? null
        : displayselectedDocsLists}
      <hr />
      GSA Price Lists:
      {displayPriceList}
      <hr />
      GSA Docs:
      {displayDocsList}
      <hr />
      Table:
      {displayTable}
      <hr />
    </div>
  )
}
