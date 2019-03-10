

function time() {
    return new Promise((resolve, reject) => {
        setTimeout(()=>{
            resolve(1)
        }, 1000 )
    })
  
}

async function test() {
    var a = await time()
    alert(a)
}


export default test