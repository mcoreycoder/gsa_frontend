import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import MainRouterMenu from './MainRouterMenu'

import Home from './Home'
import OldGSA from './OldGSA'
import PriceLists from './priceLists/PriceLists'
import GSAdocMaker from './gsaDocMaker/GSAdocMaker'
import GSA_processorPage from './gsa_processor/GSA_processorPage'

export default function MainRouter () {
  const [combinedByPriceListSKU, setByPriceLists] = useState([
    'combinedByPriceListSKU'
  ])

  let navMenu = {
    position: 'sticky',
    top: '0',
    transform: 'scale(0.75) translate(0%, -15%)'
  }
  let activeComponentStyle = {
    position: 'relative'
    // transform: "scale(0.5) translate(-90%, -15%)",
  }

  let send2MainRouterState = array => setByPriceLists(array)

  return (
    <div>
      <Router>
        <nav style={navMenu}>
          <MainRouterMenu />
        </nav>

        <Switch style={activeComponentStyle}>
          {/* <Route path='/controler' component={Controler} /> */}
          {/* <Route path='/rfq' render={()=> (<RFQ2 myProps={myProps} />)} />  */}

          {/* <Route path='/gsa_doc_maker' component={GSAdocMaker} /> */}
          <Route path='/gsa_doc_maker' render={()=> (<GSAdocMaker send2MainRouterState={send2MainRouterState} />)} /> 
          {/* <Route path='/gsa_processor' component={GSA_processorPage} /> */}
          <Route path='/gsa_processor' render={()=> (<GSA_processorPage combinedByPriceListSKU={combinedByPriceListSKU} />)} /> 

          <Route path='/pricelists' component={PriceLists} />
          <Route path='/oldgsa' component={OldGSA} />

          <Route path='/' component={Home} />
        </Switch>
      </Router>
    </div>
  )
}
