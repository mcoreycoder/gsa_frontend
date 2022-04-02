import React from 'react'

export default function docOptions (
  priceLists,
  docLists,
  updateSelectedPriceLists,
  updateSelectedDocsLists
) {
  console.log('docOptions func')

  let mapPriceLists = list => {
    let listItem = list?.map((el, i) => {
      return (
        <li key={i}>
          <button
            onClick={e => {
              //   console.log("el:",el)
              e.preventDefault()
              updateSelectedPriceLists(el)
            }}
          >
            {el.brand}
          </button>
        </li>
      )
    })
    return <ul key={listItem.idKey}>{listItem}</ul>
  }

  let mapDocLists = list => {
    let listItem = list?.map((el, i) => {
      return (
        <li key={i}>
          <button
            onClick={e => {
              //   console.log("el:",el)
              e.preventDefault()
              updateSelectedDocsLists(el)
            }}
          >
            {el.doc_name} - {el.doc_sheet_name}
          </button>
        </li>
      )
    })
    return <ul key={listItem.idKey}>{listItem}</ul>
  }

  let showPriceLists = mapPriceLists(priceLists)
  let showDocLists = mapDocLists(docLists)

  let style1 = {
    display: 'flex',
    flexDirection: 'row'
    // transform: 'scale(0.5) translate(0%, 0%)'
  }
  let style2 = {
    flex: 'auto',
    flexDirection: 'inherit',
    width: '100%',

    transform: 'scale(0.5) translate(0%, 0%)'
  }
  let style3 = {
    flex: 'auto',
    flexDirection: 'inherit',
    // width: '250%',

    transform: 'scale(0.5) translate(0%, 0%)'
  }

  return (
    <div style={style1}>
      {/* docMakerNav
      <hr /> */}
      <div style={style2}>Price Lists:{showPriceLists}</div>
      <div style={style3}>Documents:{showDocLists}</div>
    </div>
  )
}
