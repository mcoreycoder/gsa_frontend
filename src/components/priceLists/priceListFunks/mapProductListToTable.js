
export default function mapProductListToTable (selectedProductsArray) {
  // console.log('mapProductListToTable selectedListsArray:', selectedProductsArray)

  let tableDataObject = {
    // object to construct table columns(objKeys 'keep consistant to data model coming in') and rows (objValues)
    brand: null,
    price_parent_sku: null,
    price_product_name: null,
    price_wholesale: null,
    price_gsa_cost: null,
    price_msrp: null,
    price_gsa_map: null,
    price_coo: null
  }
  let tableHeaders = Object.keys(tableDataObject)

  // let productList = selectedListsArray.map(priceList => {
  //   let newList = []
  //   if (priceList !== 'selectedLists') {
  //     //if (priceList !== 'Default State')
  //     let tempList = priceList.hasProducts.map(product => {
  //       if (product !== 'empty') {
  //         let newProduct = {}
  //         tableHeaders.map(header => {
  //           return (newProduct = {
  //             ...newProduct,
  //             [header]: product[header]
  //           })
  //         })

  //         return newProduct
  //       }
  //     })
  //     console.log('productList newList:', newList)

  //     return (newList = [...newList, ...tempList])
  //   }
  //   return newList
  // }) // may want to add sorting of the list here or call sort function before passing productList to the display

  let createTableData = (tableHeadersArray, productsArray) => {
    if (productsArray !== undefined) {
     return productsArray.map((product, i) => {
        let dataColumns = tableHeadersArray.map(headerLabel => {
          if (product !== undefined) {
            return <td key={headerLabel}> {product[headerLabel]}</td>
          }
          return "product is undefined"
        })
        let dataRow = <tr key={i}>{dataColumns}</tr>
        return dataRow
      })
    }
  }

  let createHeaderRow = tableHeadersArray => {
    let headerColumns = tableHeadersArray.map(headerLabel => {
      return <th key={headerLabel}>{headerLabel}</th>
    })

    let headerRow = <tr>{headerColumns}</tr>

    return headerRow
  }

  let createTableFoot = tableHeadersArray => {
    let footColumns = tableHeadersArray.map(headerLabel => {
      return <td key={headerLabel}>footer {headerLabel}</td>
    })

    let footRow = <tr>{footColumns}</tr>

    return footRow
  }

  let showTableHeaders = createHeaderRow(tableHeaders)
  let showTableData = createTableData(tableHeaders, selectedProductsArray)
  let showTableFoot = createTableFoot(tableHeaders)

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
      <thead
        style={{
          position: 'relative',
          left: 0,
          border: '1px solid yellow',
          fontSize: `12px`,
          backgroundColor: 'grey'
        }}
      >
        
        {showTableHeaders}
      </thead>
      <tbody
        style={{
          position: 'relative',
          left: 0,
          border: '1px solid yellow',
          fontSize: `12px`,
          backgroundColor: 'green'
        }}
      >
        
        {showTableData}
      </tbody>
      <tfoot
        style={{
          position: 'relative',
          left: 0,
          border: '1px solid yellow',
          fontSize: `12px`,
          backgroundColor: 'blue'
        }}
      >
        
        {showTableFoot}
      </tfoot>
    </table>
  )
}
