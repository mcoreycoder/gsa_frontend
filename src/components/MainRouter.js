import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
import MainRouterMenu from './MainRouterMenu'

import Home from './Home'
import OldGSA from './OldGSA'
import PriceLists from './priceLists/PriceLists'
import GSAdocMaker from './gsaDocMaker/GSAdocMaker'


export default function MainRouter () {
  
  return (
    <div>
      <Router>
        <nav>
          <MainRouterMenu/>
        </nav>

        <Switch>
          {/* <Route path='/controler' component={Controler} /> */}
          {/* <Route path='/rfq' render={()=> (<RFQ2 myProps={myProps} />)} />  */}
          
          <Route path='/gsa_doc_maker' component={GSAdocMaker} />
          <Route path='/pricelists' component={PriceLists} />
          <Route path='/oldgsa' component={OldGSA} />

          <Route path='/' component={Home} />

        </Switch>
      </Router>
    </div>
  )
}
