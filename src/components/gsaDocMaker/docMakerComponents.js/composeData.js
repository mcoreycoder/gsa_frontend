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
    return allProducts
  })
  //   console.log('allProducts: ', allProducts)

  let showAllProducts = allProducts?.map(product => {
    return (
      <div key={product.price_parent_sku}>
        <p>
          {product.brand}
          {product.price_parent_sku}
          {product.price_product_name}
          {product.price_msrp}
        </p>
      </div>
    )
  })

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

  let showAllVariants = allVariants?.map(variant => {
    return (
      <div key={variant.fullSKU}>
        <p>
          {`
          ${variant.upc_parent_sku}`}
          <br />
          {`
          ${variant.fullSKU}
          ${variant.upc_productname}
          ${variant.upc_color}
          ${variant.upc_size}
          `}
        </p>
      </div>
    )
  })

  let allData = []
  selectedDocsLists.map(doc => {
    doc.hasData?.map(product => {
      product.idKey = `${doc.idKey}-${doc.doc_name}`
      return (allData = [...allData, product])
    })
    return allData
  })

  let showAllData = allData?.map(product => {
    return (
      <div key={product.header_column_1}>
        <p>{product.header_column_1}</p>
      </div>
    )
  })

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

  let showsortedBySKU = sortedBySKU?.map((product, i) => {
    return (
      <div style={{ fontSize: '.7em' }} key={i}>
        <hr />
        <p>
          {`
            ${product.price_parent_sku} 
            ${product.brand} 
            ${product.price_product_name}
            ${product.price_msrp}
          `}
        </p>
        <p style={{ fontSize: '.6em' }}>
          {` 
          ${product.source} : ${product.idKey}
          `}
        </p>
        <hr />
      </div>
    )
  })

  let combinedByPriceListSKU = allProductsWashed.map(product => {
    let newProductFormat = {
      ...product,
      variantDeets: [],
      docDeets: []
    }

    newProductFormat.variantDeets = allVariantsWashed.map(variant => {
      if (newProductFormat.price_parent_sku === variant.upc_parent_sku) {
        return variant
      }
    })

    newProductFormat.docDeets = allDataWashed.map(docItem => {
      if (newProductFormat.price_parent_sku === docItem.price_parent_sku) {
        return docItem
      }
    })

    return newProductFormat
  })

  let showCombinedBySKU = combinedByPriceListSKU?.map((product, i) => {
    let showDocDeets = product.docDeets?.map(docItem => {
      // console.log('docItem:', docItem)
      if (docItem !== undefined) {
        return (
          <p>
            <p style={{ fontSize: '.59em' }}>
              {` 
          ${docItem.source} : ${docItem.idKey}
          `}
            </p>
            {`
  ${docItem.price_parent_sku} 
  ${docItem.brand} 
  ${docItem.price_product_name}
  ${docItem.price_msrp}
`}
          </p>
        )
      }
    })

    let showVariantDeets = product.variantDeets.map(variant => {
      console.log('variant:', variant)
      if (variant !== undefined) {
        return (
          <div>
            <p style={{ fontSize: '.59em' }}>
              {` 
          ${variant.source} : ${variant.idKey}
          `}
            </p>
            {`
  ${variant.fullSKU} 
  ${variant.upc_productname}  
  ${variant.upc_color} 
  ${variant.upc_size}
`}
          </div>
        )
      }
    })

    let countOfVariants = product.variants.length

    return (
      <div style={{ fontSize: '.7em' }} key={i}>
        <hr />
        <p style={{ fontSize: '.6em' }}>
          {` 
          ${product.source} : ${product.idKey}
          `}
        </p>
        <p>
          {`
            ${product.price_parent_sku} 
            ${product.brand} 
            ${product.price_product_name}
            ${product.price_msrp}
          `}
        </p>
        <p style={{ fontSize: '.8em' }}>{showDocDeets}</p>
        {/* <p style={{ fontSize: '.7em' }}>{showVariantDeets}</p> */}
        <p style={{ fontSize: '.8em' }}>variant count: {countOfVariants}</p>

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
