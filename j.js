function storeMatchData(documento, indice) {
    var partidas = [];
    for (var z= 0; z< 5; z++) {
        var partida = documento.getElementById("player-matches").getElementsByClassName("table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr")[z];
        var col = partida.getElementsByTagName("td");
        partidas.push({
            time: col[0].innerText.trim(),
            resultado_color: getComputedStyle(col[3]).color,
            resultado_texto: col[3].innerText.trim(),
            mapa: col[2].innerText.match(/de_(.+)/)[1],
            kills: col[6].innerHTML.trim(),
            deaths: col[7].innerText.trim(),
            assists: col[8].innerHTML.trim(),
            variation: col[9].innerText.trim(),
            hs: col[10].innerText.trim(),
            adr: col[11].innerText.trim(),
            hltv: col[20].innerText.trim(),
            viewLink: col[21].getElementsByTagName("a")[0].href
        })

    }

    if (partidas.length == 10) {
        $i("btn4").getElementsByClassName("btn").forEach(e => e.classList.add("enabled"))
    }
    infoPartidas[indice] = partidas;

}