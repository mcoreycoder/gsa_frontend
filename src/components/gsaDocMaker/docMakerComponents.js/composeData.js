import washData from '../gsaDocMakerFunks/washData'

export default function composeData (
  selectedPriceLists,
  docLists,
  selectedDocsLists
) {
  let allProducts = []
  selectedPriceLists.map(priceList => {
    priceList.hasProducts?.map(product => {
      product.idKey = priceList.idKey
      return (allProducts = [...allProducts, product])
    })
    //   console.log('allProducts: ', allProducts)
    return allProducts
  })

  // let showAllProducts = allProducts?.map(product => {
  //   return (
  //     <div key={product.price_parent_sku}>
  //       <p>
  //         {product.brand}
  //         {product.price_parent_sku}
  //         {product.price_product_name}
  //         {product.price_msrp}
  //       </p>
  //     </div>
  //   )
  // })

  let allVariants = []
  allProducts.map(product => {
    product.variants === []
      ? (allVariants = [...allVariants, product])
      : product.variants?.map(variant => {
          variant.idKey = product.idKey
          return (allVariants = [...allVariants, variant])
        })
    return allVariants
  })

  // let showAllVariants = allVariants?.map(variant => {
  //   return (
  //     <div key={variant.fullSKU}>
  //       <p>
  //         {`
  //         ${variant.upc_parent_sku}`}
  //         <br />
  //         {`
  //         ${variant.fullSKU}
  //         ${variant.upc_productname}
  //         ${variant.upc_color}
  //         ${variant.upc_size}
  //         `}
  //       </p>
  //     </div>
  //   )
  // })

  let allData = []
  selectedDocsLists.map(doc => {
    doc.hasData?.map(product => {
      product.idKey = `${doc.idKey}-${doc.doc_name}`
      return (allData = [...allData, product])
    })
    return allData
  })

  // let showAllData = allData?.map(product => {
  //   return (
  //     <div key={product.header_column_1}>
  //       <p>{product.header_column_1}</p>
  //     </div>
  //   )
  // })

  let allProductsWashed = washData(allProducts, 'allProducts')
  let allVariantsWashed = washData(allVariants, 'allVariants')
  let allDataWashed = washData(allData, 'allData')

  let compareByProp = (a, b) => {
    if (a < b) {
      return -1
    }
    if (a > b) {
      return 1
    }
    return 0
  }
  // let combinedData = [...allProductsWashed, ...allVariantsWashed, ...allDataWashed]
  let combinedData = [...allProductsWashed]

  let sortedBySKU = combinedData.sort((a, b) =>
    compareByProp(a.price_parent_sku, b.price_parent_sku)
  )

  // let showsortedBySKU = sortedBySKU?.map((product, i) => {
  //   return (
  //     <div style={{ fontSize: '.7em' }} key={i}>
  //       <hr />
  //       <p>
  //         {`
  //           ${product._parent_sku}
  //           ${product._brand}
  //           ${product._product_name}
  //           ${product._msrp}
  //         `}
  //       </p>
  //       <p style={{ fontSize: '.6em' }}>
  //         {`
  //         ${product._source} : ${product._idKey}
  //         `}
  //       </p>
  //       <hr />
  //     </div>
  //   )
  // })

  let combinedByPriceListSKU = allProductsWashed.map(product => {
    let newProductFormat = {
      ...product,
      variantDeets: [],
      docDeets: []
    }
    // console.log(`newProductFormat: `,newProductFormat)

    allVariantsWashed.map(variant => {
      if (newProductFormat._parent_sku === variant._parent_sku) {
        // console.log(`variant: `,variant)
        return (newProductFormat.variantDeets = [
          ...newProductFormat.variantDeets,
          variant
        ])
      }
      return newProductFormat
    })

    allDataWashed.map(docItem => {
      if (newProductFormat._parent_sku === docItem._parent_sku) {
        return newProductFormat.docDeets = [...newProductFormat.docDeets, docItem]
      }
      return newProductFormat
    })

    return newProductFormat
  })

  let showCombinedBySKU = combinedByPriceListSKU?.map((product, i) => {
    let showDocDeets = product.docDeets?.map(docItem => {
      // console.log('docItem:', docItem)
      if (docItem !== undefined) {
        return (
          <div key={i}>
            <div style={{ fontSize: '.59em' }}>
              {docItem._source}
              <br />
              <p style={{ fontSize: '.59em' }}>{docItem._idKey}</p>{' '}
            </div>
            {`${docItem._parent_sku}
            ${docItem._brand}
            ${docItem._product_name}
            ${docItem._msrp}`}
          </div>
        )
      }
    })

    let showVariantDeets = product.variantDeets.map((variant, i) => {
      // console.log('variant:', variant)
      if (variant !== undefined) {
        return (
          <div key={i}>
            <p style={{ fontSize: '.59em' }}>
              {` 
          ${variant._source} : ${variant._idKey}
          `}
            </p>
            {`
  ${variant._oldFormat.fullSKU} 
  ${variant._oldFormat.upc_productname}  
  ${variant._oldFormat.upc_color} 
  ${variant._oldFormat.upc_size}
`}
          </div>
        )
      }
    })

    let countOfVariants = product.variantDeets.length

    return (
      <div style={{ fontSize: '.7em' }} key={i}>
        <hr />
        <p style={{ fontSize: '.6em' }}>
          {` 
          ${product._source} : ${product._idKey}
          `}
        </p>
        <p>
          {`
            ${product._parent_sku} 
            ${product._brand} 
            ${product._product_name}
            ${product._msrp}
          `}
        </p>
        <div style={{ fontSize: '.8em' }}>{showDocDeets}</div>
        <p style={{ fontSize: '.8em' }}>variant count: {countOfVariants}</p>
        <div style={{ fontSize: '.7em' }}>{showVariantDeets}</div>

        <hr />
      </div>
    )
  })

  return (
    <div>
      hello from composeData
      {/* {showAllProducts} */}
      {/* {showAllVariants} */}
      {/* {showAllData} */}
      {/* <hr/><hr/><hr/>{showsortedBySKU}<hr/><hr/><hr/> */}
      <hr />
      <hr />
      <hr />
      {showCombinedBySKU}
      <hr />
      <hr />
      <hr />
    </div>
  )
}
