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


export default function ViewSelected (props) {
    let selectedPriceLists = props.viewProps.selectedPriceLists
    let selectedDocsLists = props.viewProps.selectedDocsLists
    let selectedFormat = props.viewProps.selectedFormat
    let updateSelectedPriceLists = props.viewProps.updateSelectedPriceLists
    let updateSelectedDocsLists = props.viewProps.updateSelectedDocsLists
    // console.log("ViewSelected selectedFormat:",selectedFormat)

    let mapSelectedPriceLists = list => {
      let listItem = list?.map((el, i) => {
        return (
          <li key={i}>
            {el.brand}
            {/* <button
              onClick={e => {
                //   console.log("el:",el)
                e.preventDefault()
                updateSelectedPriceLists(el, 'delete')
              }}
            >
              Remove
            </button> */}
          </li>
        )
      })
      return list[0] === 'selectedPriceLists' ? null : <ul>{listItem}</ul>
    }
  
    let mapSelectedDocsLists = list => {
      let listItem = list?.map((el, i) => {
        return (
          <li key={i}>
            {el.doc_name} - {el.doc_sheet_name}
            {/* <button
              onClick={e => {
                //   console.log("el:",el)
                e.preventDefault()
                updateSelectedDocsLists(el, 'delete')
              }}
            >
              Remove
            </button> */}
          </li>
        )
      })
      return list[0] === 'selectedDocsLists' ? null : <ul>{listItem}</ul>
    }
    
    let mapSelectedFormat = formatObj => {
        // console.log('mapSelectedFormat formatObj: ', formatObj)
        if(formatObj === undefined){return <div>No format selected</div> }
      let listItem = <li key={"formatObj"}>
            {formatObj.doc_name} - {formatObj.doc_sheet_name}
            <button
              onClick={e => {
                  // console.log("formatObj:",formatObj)
                e.preventDefault()
                updateSelectedDocsLists(formatObj, 'select format')
              }}
            >
              Remove
            </button>
          </li>
      return <ul>{listItem}</ul>
    }
  
    let showPriceLists = mapSelectedPriceLists(selectedPriceLists)
    let showDocLists = mapSelectedDocsLists(selectedDocsLists)
    let showFormat = mapSelectedFormat(selectedFormat)
  

  
  
    return (
      <div style={style1}>
        {/* docMakerNav
          <hr /> */}
        <div style={style2}>
          Selected Price Lists:
          {showPriceLists}
        </div>
        <div style={style3}>
          Selected Documents:
          {showDocLists}
        </div>
        <div style={style3}>
          Selected Format:
          {showFormat}
        </div>
      </div>
    )
  }
  