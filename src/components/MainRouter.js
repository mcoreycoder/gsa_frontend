import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import MainRouterMenu from './MainRouterMenu'

import Home from './Home'
import OldGSA from './OldGSA'
import PriceLists from './priceLists/PriceLists'
import GSAdocMaker from './gsaDocMaker/GSAdocMaker'
import GSA_processorPage from './gsa_processor/GSA_processorPage'

export default function MainRouter () {
  let navMenu = {
    position: "sticky",
    top: "0",
  transform: "scale(0.75) translate(0%, -15%)",
  }
  let activeComponentStyle = {
    position: "relative",
    // transform: "scale(0.5) translate(-90%, -15%)",
  }

  return (
    <div>
      <Router>
        <nav style={navMenu}>
          <MainRouterMenu />
        </nav>

        <Switch style={activeComponentStyle}>
          {/* <Route path='/controler' component={Controler} /> */}
          {/* <Route path='/rfq' render={()=> (<RFQ2 myProps={myProps} />)} />  */}

          <Route path='/gsa_doc_maker' component={GSAdocMaker} />
          <Route path='/pricelists' component={PriceLists} />
          <Route path='/oldgsa' component={OldGSA} />
          <Route path='/gsa_processor' component={GSA_processorPage} />

          <Route path='/' component={Home} />
        </Switch>
      </Router>
    </div>
  )
}
