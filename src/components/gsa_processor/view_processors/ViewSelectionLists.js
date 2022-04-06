import React from 'react'

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

export default function ViewSelectionLists (props) {
  let priceLists = props.viewProps.filteredPriceLists
  let docLists = props.viewProps.filteredDocLists
  let formatOptions = props.viewProps.selectedDocsLists
  let updateSelectedPriceLists = props.viewProps.updateSelectedPriceLists
  let updateSelectedDocsLists = props.viewProps.updateSelectedDocsLists

  let mapPriceLists = list => {
    // console.log('mapPriceLists list: ', list)
    let listItems = list?.map((el, i) => {
      return (
        <li key={i}>
          {/* <button
            onClick={e => {
              //   console.log("el:",el)
              e.preventDefault()
              updateSelectedPriceLists(el)
            }}
          > */}
            {el.brand}
          {/* </button> */}
        </li>
      )
    })
    return <ul>{listItems}</ul>
  }

  let mapDocLists = list => {
    let listItem = list?.map((el, i) => {
      return (
        <li key={i}>
          {/* <button
            onClick={e => {
              e.preventDefault()
              updateSelectedDocsLists(el, 'add selection')
            }}
          > */}
            {el.doc_name}
            {el.doc_sheet_name}
          {/* </button> */}
        </li>
      )
    })
    return <ul>{listItem}</ul>
  }

  let mapFormatOptions = list => {
    let listItem = list?.map((el, i) => {
      let check4Allowed = doc_name => {
        let allowableFormats = [
          'IPRICE',
          'IOPTIONS',
          'IPROD',
          'Refresh 9',
          'CPL'
        ]
        let allowed
        allowableFormats.map(allowable => {
          if (doc_name?.includes(allowable)) {
            return (allowed = doc_name.includes(allowable))
          }
        })
        return allowed
      }
      if (check4Allowed(el.doc_name)) {
        return (
          <li key={i}>
            <button
              onClick={e => {
                //   console.log("el:",el)
                e.preventDefault()
                // updateSelectedDocsLists(el)
                // would need to add logic to this func to handle this process,
                // might be better to use different func to handle this
                updateSelectedDocsLists(el, 'select format')
              }}
            >
              {el.doc_name}
              <br />
              {el.doc_sheet_name}
            </button>
          </li>
        )
      }
    })
    return <ul>{listItem}</ul>
  }

  let showPriceLists = mapPriceLists(priceLists)
  let showDocLists = mapDocLists(docLists)
  let showFormatOptions = mapFormatOptions(formatOptions)

  return (
    <div style={style1}>
      <div style={style2}>Missing Price Lists Data:</div>
      <div style={style2}>{showPriceLists}</div>

      <div style={style2}>Missing Document Data:</div>
      <div style={style2}>{showDocLists}</div>

      <div style={style2}>Select Table Format:</div>
      <div style={style2}>{showFormatOptions}</div>
    </div>
  )
}
