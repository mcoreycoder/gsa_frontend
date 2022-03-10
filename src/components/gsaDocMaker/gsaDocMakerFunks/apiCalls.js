import apiCaller from '../../functions/apiCaller'

export function getPriceLists () {
  return apiCaller({ route: `/sheets/pricelists`, method: `GET` })
}
export function getProductData (brandsArr) {
  return apiCaller({
    route: `/sheets/products/?brands=${brandsArr}`,
    method: `GET`
  })
}

export function getDocsLists () {
  return apiCaller({ route: `/sheets/gsa_docslists`, method: `GET` })
}
export function getDocData (docsArr) {
  return apiCaller({
    route: `/sheets/gsa_docsdata/?docs=${docsArr}`,
    method: `GET`
  })
}
export default {
  getPriceLists,
  getProductData,
  getDocsLists,
  getDocData
}
