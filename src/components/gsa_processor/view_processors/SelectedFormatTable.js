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
  fontSize: '50%'
}
export default function SelectedFormatTable (props) {
  const priceList = props.viewProps.priceLists
  const docLists = props.viewProps.docLists
  const selectedPriceLists = props.viewProps.selectedPriceLists
  const selectedDocsLists = props.viewProps.selectedDocsLists
  const selectedFormat = props.viewProps.selectedFormat

  let selectedFormatDocObjMap = docLists.find(
    el => el?.idKey === selectedFormat?.idKey
  ) // doc obj in docLists state //find on docList for match on idKey and isolate doc
  console.log(`selectedFormatDocObjMap: `, selectedFormatDocObjMap) // header_columns is obj from prop on doc obj in docLists state

  let header_columns = selectedFormatDocObjMap?.header_columns
  console.log(`header_columns: `, header_columns) // header_columns is obj from prop on doc obj in docLists state

  let columnKeys =
    header_columns === undefined ? null : Object.keys(header_columns) // used to map rows by prop by using header_columns[headerNum] or data[headerNum]
  console.log(`columnKeys: `, columnKeys)

  let mapTableHeader = (columnKeys, header_columns, selectedFormatDocObjMap) => {
    //map columnKeys to tableHeaders accessing the obj prop(headerNum) on header_columns obj returning <th key={headerNum}>{header_columns[headerNum]}</th>
    let tableHeaders = columnKeys?.map(headerNum => (
      <th key={headerNum}>{header_columns[headerNum]}</th>
    ))
    tableHeaders?.unshift(<th key={'doc_sheet_name'}>{selectedFormatDocObjMap['doc_sheet_name']}</th>)
    //then return <tr>{tableHeaders}</tr>
    return <tr>{tableHeaders}</tr>
  }

  let mapTableData = (
    selectedPriceLists,
    selectedDocsLists,
    selectedFormat
  ) => {
    let docsArray = []
    let selectedDocObj = {}
    selectedDocsLists.map(el => {
      if (el?.idKey === selectedFormat?.idKey) {
        return (selectedDocObj = el)
      }
      return (docsArray = [...docsArray, el])
    })
    console.log(`docsArray: `, docsArray)
    console.log(`selectedDocObj: `, selectedDocObj)
// thinking I need to washData() to standardize it, like on combinedByPriceListSKU from composeData, should look to address newFormat to include oldFormat prop for original product format?
// maybe pass combinedByPriceListSKU from composeData up to higher state to be used by this component
// if using combinedByPriceListSKU note oldFormat prop for original product format but note headerNums may not align if selected format is off, use _propName for mapping to new output 
// then have a seperate process to reconvert from standardized to selectedFormat 
// by reverse engineering the washData() process use the property:header# mapping to create a header#:property map
// header#:property map can then be used to feed priceList data to convert to selectedFormat
// then map array to below tabelRows
    let tableRows = selectedDocObj?.hasData?.map((item,i) => {
      let tableRow = columnKeys?.map(headerNum => {
        return <td key={headerNum}>{item[headerNum]}</td>
        // return <td key={headerNum}><button>{item[headerNum]}</button></td>
      })
      tableRow?.unshift(<td key={'doc_sheet_name'}>{selectedFormatDocObjMap['doc_sheet_name']}</td>)

      return <tr key={i}>{tableRow}</tr>
    })

    return tableRows
  }

  let showTableHeader = mapTableHeader(columnKeys, header_columns, selectedFormatDocObjMap)
  let showTableRows = mapTableData(
    selectedPriceLists,
    selectedDocsLists,
    selectedFormat
  )

  return (
    <div >
      {`Hello from SelectedFormatTable`}
      <div style={style2}>
        <div>
          selectedPriceLists.length:{' '}
          {selectedPriceLists[0] === 'selectedPriceLists'
            ? null
            : selectedPriceLists.length}
        </div>
        <div>
          selectedDocsLists.length:{' '}
          {selectedDocsLists[0] === 'selectedDocsLists'
            ? null
            : selectedDocsLists.length}
        </div>
        <div>selectedFormat: {selectedFormat?.doc_name}</div>
      </div>

      <hr />

      <table style={style3}>
        <thead>{showTableHeader}</thead>
        <tbody>{showTableRows}</tbody>
      </table>
    </div>
  )
}
