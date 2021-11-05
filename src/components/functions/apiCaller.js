
//apiCaller takes an object with route, method, and body(optional).
export default async function apiCaller (routeInput) {
    let data = { method: routeInput.method }
    //do a check for a body may want to do a check for GET or DELETE method since those should not have a body
    if (routeInput.body) {
      // data = { ...data, body: routeInput.body }
      data = { ...data,headers: {
        'Content-Type': 'application/json',
      },
       body: JSON.stringify(routeInput.body) 
      }
    }
    // await console.log(
    //   `apiCaller() data: \n`,
    //   data
    // )

  
    let handleCall = await fetch(`http://localhost:5000${routeInput.route}`, data)
      .then(res => res.json())
      // below is just for checking res data
      .then(data => {
        // console.log(`res data is array?: ${Array.isArray(data)}`)
        // !Array.isArray(data)
        //   ? console.log(`apiCaller() - Object res data: ${Object.entries(data)}`)
        //   : data.map(obj =>
        //       console.log(`apiCaller() - Array res data ${obj._id}`)
        //     )
        return data
      })
  
    return await handleCall
  }
 
  