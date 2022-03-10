import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

let headerStyle = {
  //   paddingTop: `.1em`,
  // paddingBottom: `.5em`,
  // border: `1px solid #a2a2a2`,
  border: '1px solid black',

  backgroundColor: `grey`,
  borderRadius: `25px`,
  display: `flex`,
  justifyContent: `space-evenly`

  // alignItems: `center`,
}

let mainNav = {
  border: '1px solid black',
  borderRadius: `15px`,
  backgroundColor: `grey`,

  padding: `10px 10px`,
  // textTransform: `uppercase`,
  // textAlign: `center`,
  // display: `block`,
  //   color: `#34495e`,
  fontSize: `1.5em`,
  //   flex: `auto`,
  flexDirection: `row-reverse`
}

let selectedMainNav = {
  // position: `fixed`,
  border: '10px solid green',
  borderRadius: `100px`,
  backgroundColor: `black`,

  padding: `10px 10px`,
  // textTransform: `uppercase`,
  // textAlign: `center`,
  // display: `block`,
  //   color: `#34495e`,
  fontSize: `1.5em`,
  //   flex: `auto`,
  flexDirection: `row-reverse`
}

let us_elitegear_logo = {
  //   position: `fixed`,
  border: '1px solid black'
  // left: '18px'
}





export default function MainRouterMenu () {
  const location = useLocation()?.pathname;

  const chooseStyle = (str) => {
    return str === location ? selectedMainNav : mainNav
  }


  return (
    <header style={headerStyle}>
      <h1>
        <img
          style={us_elitegear_logo}
          alt='us-elitegear-logo'
          src='https://cdn.shopify.com/s/files/1/1735/4437/files/us-elite-logo-landscape_06a0d777-82b7-4962-a034-00cc86a6dc4d_x55.png?v=1576742234'
        />
      </h1>

      <h2 style={chooseStyle(`/`)}>
        <Link to='/'>
          Home
        </Link>
      </h2>

      <h2 style={chooseStyle('/pricelists')}>
        <Link to='/pricelists'>
          Price Lists
        </Link>
      </h2>

      <h2 style={chooseStyle('/oldgsa')}>
        <Link to='/oldgsa'>
          Old GSA
        </Link>
      </h2>
      <h2 style={chooseStyle('/gsa_doc_maker')}>
        <Link to='/gsa_doc_maker'>
          GSA Doc Maker
        </Link>
      </h2>

    </header>
  )
}
