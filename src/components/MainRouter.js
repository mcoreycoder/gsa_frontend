import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
import MainRouterMenu from './MainRouterMenu'

import Home from './Home'


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

          <Route path='/' component={Home} />

        </Switch>
      </Router>
    </div>
  )
}
