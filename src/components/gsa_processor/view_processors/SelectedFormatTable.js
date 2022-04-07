import mapProp2headerNum from '../data_processors/mapProp2headerNum'

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
let styleTable = {
  fontSize: '50%',
  position: 'absolute',
  left: 0,
  border: '1px solid green',
  fontSize: `12px`,
  backgroundColor: 'black'
}
let styleTableHead = {
  position: 'relative',
  left: 0,
  border: '1px solid yellow',
  fontSize: `12px`,
  backgroundColor: 'grey'
}
let styleTableBody = {
  position: 'relative',
  left: 0,
  border: '1px solid yellow',
  fontSize: `12px`,
  backgroundColor: '#669999'
}

export default function SelectedFormatTable (props) {
  const priceList = props.viewProps.priceLists
  const docLists = props.viewProps.docLists
  const selectedPriceLists = props.viewProps.selectedPriceLists
  const selectedDocsLists = props.viewProps.selectedDocsLists
  const gsa_sku_data = props.viewProps.gsa_sku_data
  const selectedFormat = props.viewProps.selectedFormat

  let selectedFormatDocObjMap = docLists?.find(
    el => el?.idKey === selectedFormat?.idKey
  ) // doc obj in docLists state //find on docList for match on idKey and isolate doc
  // console.log(`selectedFormatDocObjMap: `, selectedFormatDocObjMap) // header_columns is obj from prop on doc obj in docLists state

  let header_columns = selectedFormatDocObjMap?.header_columns
  // console.log(`header_columns: `, header_columns) // header_columns is obj from prop on doc obj in docLists state

  let columnKeys =
    header_columns === undefined ? null : Object.keys(header_columns) // used to map rows by prop by using header_columns[headerNum] or data[headerNum]
  // console.log(`columnKeys: `, columnKeys)

  let mapTableHeader = (
    columnKeys,
    header_columns,
    selectedFormatDocObjMap
  ) => {
    //map columnKeys to tableHeaders accessing the obj prop(headerNum) on header_columns obj returning <th key={headerNum}>{header_columns[headerNum]}</th>
    let tableHeaders = columnKeys?.map(headerNum => (
      <th key={headerNum}>{header_columns[headerNum]}</th>
    ))
    tableHeaders?.unshift(<th key={'doc_sheet_name'}>{'doc_sheet_name'}</th>)
    tableHeaders?.unshift(<th key={'_source'}>{'_source'}</th>)
    //then return <tr>{tableHeaders}</tr>
    return <tr>{tableHeaders}</tr>
  }

  let mapTableData = (docLists, gsa_sku_data, selectedFormat) => {
    let docsArray = []
    let selectedDocObj = {}
    // fills vars above
    selectedDocsLists.map(el => {
      if (el?.idKey === selectedFormat?.idKey) {
        return (selectedDocObj = el)
      }
      return (docsArray = [...docsArray, el])
    })
    let iOptionsCheck = Boolean(selectedDocObj.doc_name?.includes('IOPTIONS'))
    // console.logs and notes
    // console.log(`iOptionsCheck: `, iOptionsCheck)
    // console.log(`docsArray: `, docsArray)
    // console.log(`selectedDocObj: `, selectedDocObj)
    // thinking I need to washData() to standardize it, like on combinedByPriceListSKU from composeData, should look to address newFormat to include oldFormat prop for original product format?
    // maybe pass combinedByPriceListSKU from composeData up to higher state to be used by this component
    // if using combinedByPriceListSKU note oldFormat prop for original product format but note headerNums may not align if selected format is off, use _propName for mapping to new output
    // then have a seperate process to reconvert from standardized to selectedFormat
    // by reverse engineering the washData() process use the property:header# mapping to create a header#:property map
    // header#:property map can then be used to feed priceList data to convert to selectedFormat
    // then map array to below tabelRows

    let skuRows = gsa_sku_data?.map((item, i) => {
      if(item._idKey){
        let itemHeaderNum = mapProp2headerNum(item, docLists, selectedDocObj)
        let tableRow = columnKeys?.map(headerNum => {
          return <td key={headerNum}>{itemHeaderNum[headerNum]}</td>
          // return <td key={headerNum}><button>{item[headerNum]}</button></td>
        })
        tableRow?.unshift(<td key={'_brand'}>{item['_brand']}</td>)
        tableRow?.unshift(
          <td key={'_source'}>{item['_source'] ? item['_source'] : 'null'}</td>
        )
  
        return <tr key={i}>{tableRow}</tr>
      }
      
    })
    let variantRows = gsa_sku_data?.map((item, i) => {
      return item.variantDeets?.map(variant => {
        let itemWithVariant = { ...item, variant }
        let itemHeaderNum = mapProp2headerNum(
          itemWithVariant,
          docLists,
          selectedDocObj
        )
        let tableRow = columnKeys?.map(headerNum => {
          return <td key={headerNum}>{itemHeaderNum[headerNum]}</td>
          // return <td key={headerNum}><button>{item[headerNum]}</button></td>
        })
        tableRow?.unshift(<td key={'_brand'}>{item['_brand']}</td>)
        tableRow?.unshift(
          <td key={'_source'}>{item['_source'] ? item['_source'] : 'null'}</td>
        )

        return <tr key={i}>{tableRow}</tr>
      })
    })

    // let tableRows = (iOptionsCheck && variantRows) ? variantRows : skuRows
    let tableRows = (iOptionsCheck && variantRows) ? variantRows : skuRows
    return tableRows
  }

  let showTableHeader = mapTableHeader(
    columnKeys,
    header_columns,
    selectedFormatDocObjMap
  )
  let showTableRows = mapTableData(docLists, gsa_sku_data, selectedFormat)

  return (
    <div>
      Hello from SelectedFormatTable
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
      <table style={styleTable}>
        <thead style={styleTableHead}>{showTableHeader}</thead>
        <tbody style={styleTableBody}>{showTableRows}</tbody>
      </table>
    </div>
  )
}
