//puts background source on page for home and user page

let loadSource = ()=>{
    let sourcediv = c('div')
    sourcediv.className = 'sources'
    let p = c('p')
    p.innerText = "Background is from 'Forsaken Castle' by Duck Block Games"

    sourcediv.append(p)
    document.body.append(sourcediv)
}