const url = 'https://gist.githubusercontent.com/josejbocanegra/b1873c6b7e732144355bb1627b6895ed/raw/d91df4c8093c23c41dce6292d5c1ffce0f01a68b/newDatalog.json'
window.onload = () => {
    let header = document.querySelector('h1')
    fetch(url).then( (response) =>
        response.json()
    )
    .then( (json) => {
        header.textContent = "Events"
        document.body.appendChild(header)
        let table = document.createElement("table")
        let tHead = document.createElement("tr")
        let th1 = document.createElement("th")
        th1.textContent = "#"
        let th2 = document.createElement("th")
        th2.textContent = "Events"
        let th3 = document.createElement("th")
        th3.textContent = "Squirrel"
        tHead.appendChild(th1)
        tHead.appendChild(th2)
        tHead.appendChild(th3)
        table.appendChild(tHead)
        let matrixes = {}
        let nSquirrel = 0
        let i = 1
        for (element of json) {
            let row = document.createElement("tr")
            let data1 = document.createElement("td")
            data1.textContent = String(i)
            let data2 = document.createElement("td")
            data2.textContent = String(element.events)
            let data3 = document.createElement("td")
            data3.textContent = String(element.squirrel)
            row.appendChild(data1)
            row.appendChild(data2)
            row.appendChild(data3)
            if (element.squirrel) {
                row.style.backgroundColor = "red"
                nSquirrel++
            }
            table.appendChild(row)
            for (activity of element.events) {
                let m_value = element.squirrel ? "tp" : "fn"
                if (!matrixes.hasOwnProperty(activity))
                    matrixes[activity] = {tp:0, fn:0}
                matrixes[activity][m_value]++
            }
            i++
        }
        i--
        document.body.appendChild(table)
        let corrHead = document.createElement('h1')
        corrHead.textContent = "Correlation of Events"
        document.body.appendChild(corrHead)
        let table2 = document.createElement('table')
        let tHead2 = document.createElement('tr')
        let hashtg = document.createElement('th')
        hashtg.textContent = "#"
        tHead2.appendChild(hashtg)
        let tEvents = document.createElement('th')
        tEvents.textContent = "Events"
        tHead2.appendChild(tEvents)
        let tCorr = document.createElement('th')
        tCorr.textContent = "Correlation"
        tHead2.appendChild(tCorr)
        table2.appendChild(tHead2)
        for (activity in matrixes) {
            let tp = matrixes[activity]["tp"]
            let fn = matrixes[activity]["fn"]
            let fp = nSquirrel - tp
            let tn = i - nSquirrel - fn
            matrixes[activity]["corr"] = (tp*tn - fp*fn)/Math.sqrt((tp+fp)*(tp+fn)*(tn+fp)*(tn+fn))
        }
        let sorted = Object.entries(matrixes).sort((a,b) => {
            let dif = a[1]["corr"] - b[1]["corr"]
            if (dif > 0)
                return -1
            else if (dif < 0)
                return 1
            else
                return 0
        })
        let j = 1
        for (element of sorted) {
            let row = document.createElement('tr')
            let col1 = document.createElement('td')
            col1.textContent = String(j)
            row.appendChild(col1)
            let col2 = document.createElement('td')
            col2.textContent = element[0]
            row.appendChild(col2)
            let col3 = document.createElement('td')
            col3.textContent = String(element[1]["corr"])
            row.appendChild(col3)
            table2.appendChild(row)
            j++
        }
        document.body.appendChild(table2)
    })
    .catch( (error) => {
        console.log(error)
        header.textContent = "Error: No se pudo cargar el contenido"
        header.style.color = "red"
        let desc = document.createElement('p')
        desc.textContent = error
        document.body.appendChild(desc)
    })
}