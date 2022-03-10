import React, { useState, useEffect } from 'react'
import {getPriceLists} from './gsaDocMakerFunks/apiCalls'


export default function GSAdocMaker (props) {
    const [priceLists, setPriceLists] = useState(['priceLists'])


    useEffect(() => {
        let mounted = true
        // implement to make call and get price list when component is rendering
        getPriceLists().then(response => {
          if (mounted) {
            setPriceLists(response)
          }
        })
        return () => (mounted = false)
      }, [])

  return <div>
      <h3>Hello from GSAdocMaker</h3>
  </div>
}
