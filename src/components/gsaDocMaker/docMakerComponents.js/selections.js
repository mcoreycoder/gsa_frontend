export default function selections (
  selectedPriceLists,
  selectedDocsLists,
  updateSelectedPriceLists,
  updateSelectedDocsLists,
  getProductData,
  getDocData
) {
  console.log('selections func')

  let mapSelectedPriceLists = list => {
    let listItem = list?.map((el, i) => {
      return (
        <li key={i}>
          {el.brand}
          <button
            onClick={e => {
              //   console.log("el:",el)
              e.preventDefault()
              updateSelectedPriceLists(el, 'delete')
            }}
          >
            Remove
          </button>
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
          <button
            onClick={e => {
              //   console.log("el:",el)
              e.preventDefault()
              updateSelectedDocsLists(el, 'delete')
            }}
          >
            Remove
          </button>
        </li>
      )
    })
    return list[0] === 'selectedDocsLists' ? null : <ul>{listItem}</ul>
  }

  let showPriceLists = mapSelectedPriceLists(selectedPriceLists)
  let showDocLists = mapSelectedDocsLists(selectedDocsLists)

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
      <div style={style2}>
        Selected Price Lists:
        {showPriceLists}
      </div>
      <div style={style3}>
        Selected Documents:
        {showDocLists}
      </div>
    </div>
  )
}
