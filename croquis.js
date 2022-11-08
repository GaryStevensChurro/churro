const $i = (x) => document.getElementById(x);
const $c = (x) => document.getElementsByClassName(x);


(function () {
    for (var i = 0; i < 10; i++) {
        const dom_row = document.createElement("tr");
        dom_row.id = i;
        dom_row.innerHTML = `
        <td id="o${i}"><b class="kdratio">${i}</b></td>
        <td id="sl${i}"></td>
        <td id="sn${i}" class="expandir"></td>
        <td id="sa${i}"></td>
        <td id="hc${i}"></td>
        <td id="rc${i}" class="expandir"></td>
        <td id="rb${i}" class="expandir"></td>
        <td id="kdra${i}"></td>
        <td id="kdrb${i}"></td>
        <td id="ia${i}" class="expandir"></td>
        <td id="ib${i}" class="expandir"></td>
        <td id="ic${i}" class="expandir"></td>
        <td id="id${i}" class="expandir"></td>
        <td id="ie${i}" class="expandir"></td> `;
        document.getElementsByClassName("table-rows")[0].append(dom_row);
    }

    document.querySelectorAll("tr:nth-child(11) td").forEach(function (e) { e.style.background = "red" });

})();


if (navigator.clipboard) {
    $i("pegar").style.display = "inline"
    $i("pegar").addEventListener("click", function(){
        navigator.clipboard.readText().then( t => {
            $i("input1").value =  t;
            leerPlayers();
        })
        .catch(error => {
            console.log("error:", error);
        })
    })
}
else {
    console.log("no tiene");
}


$i("input1").addEventListener("submit", function (e) {
    var rx = new RegExp(/"(.+?)"\W+(STEAM\S+)\W+\d+:\d+\W+(\d+)/gs);

    var mensaje = `${e.target.value}`
    var id32 = []; for (match of mensaje.matchAll(rx)) {
        id32.push({
            nombre: match[1],
            id32: match[2],
            ping: match[3]
        })
    }
    playersPreview(id32);
})

function playersPreview(ids) {
    $c("players-preview")[0].innerHTML = "";
    var equipoAEl = document.createElement("div");
    equipoAEl.innerHTML = "";
    if (ids.length == 10) {
        equipoAEl.innerHTML = "<h2>Escoger Equipo</h2>"
    }
    else if (ids.length < 10) {
        equipoAEl.innerHTML = `<h2>${ids.length} jugadores</h2>`

    }

    equipoAEl.style.cssText = "text-align:center;color:white;"
    for (var p of ids) {
        var playerEl = document.createElement("div");
        playerEl.classList.add("jugador-preview");
        playerEl.innerHTML = `<a href="#"><p>${p.nombre}</p></a>`;
        playerEl.dataset.nombre = p.nombre;
        playerEl.dataset.id32 = p.id32;
        playerEl.dataset.ping = p.ping;
        playerEl.style.cssText = "";
        playerEl.addEventListener("click", function (e) {
            this.classList.toggle("selected-preview-player");
            selected = $c("selected-preview-player").length;
            if (selected == 5) $c("readyornot")[0].style.cssText = "display: flex; flex-flow: column;";
            else if (selected < 5 || selected > 5) $c("readyornot")[0].style.cssText = "display: none;";
        })
        $c("players-preview")[0].appendChild(playerEl);
    }
    $c("players-preview")[0].prepend(equipoAEl);
}

function obtenerdata() {
    statsmulti();
    $c("tableizer-table")[0].style.display = "block";
    $c("players-preview")[0].style.display = "none";
    $c("readyornot")[0].style.display = "none";
}

/***
 *     .----------------.  .----------------.  .----------------.  .----------------.  .----------------. 
 *    | .--------------. || .--------------. || .--------------. || .--------------. || .--------------. |
 *    | |    _______   | || |  _________   | || |      __      | || |  _________   | || |    _______   | |
 *    | |   /  ___  |  | || | |  _   _  |  | || |     /  \     | || | |  _   _  |  | || |   /  ___  |  | |
 *    | |  |  (__ \_|  | || | |_/ | | \_|  | || |    / /\ \    | || | |_/ | | \_|  | || |  |  (__ \_|  | |
 *    | |   '.___`-.   | || |     | |      | || |   / ____ \   | || |     | |      | || |   '.___`-.   | |
 *    | |  |`\____) |  | || |    _| |_     | || | _/ /    \ \_ | || |    _| |_     | || |  |`\____) |  | |
 *    | |  |_______.'  | || |   |_____|    | || ||____|  |____|| || |   |_____|    | || |  |_______.'  | |
 *    | |              | || |              | || |              | || |              | || |              | |
 *    | '--------------' || '--------------' || '--------------' || '--------------' || '--------------' |
 *     '----------------'  '----------------'  '----------------'  '----------------'  '----------------' 
 */




async function statsmulti() {

    jugadores = $c("jugador-preview");

    var equipoA = [];
    var equipoB = [];

    for (var o = 0; o < jugadores.length; o++) {
        if (jugadores[o].classList.contains("selected-preview-player")) {
            equipoA.push([jugadores[o].dataset.nombre, jugadores[o].dataset.id32, jugadores[o].dataset.ping]);
        }
        else {
            equipoB.push([jugadores[o].dataset.nombre, jugadores[o].dataset.id32, jugadores[o].dataset.ping]);
        }
    }

    var sv_peticion = "";

    for (var iea = 0; iea < equipoA.length; iea++) sv_peticion += `data[${iea}][0]=${equipoA[iea][0]}&data[${iea}][1]=${equipoA[iea][1]}&data[${iea}][2]=${equipoA[iea][2]}&`;
    for (var ieb = 0; ieb < equipoB.length; ieb++) sv_peticion += `data[${ieb + 5}][0]=${equipoB[ieb][0]}&data[${ieb + 5}][1]=${equipoB[ieb][1]}&data[${ieb + 5}][2]=${equipoB[ieb][2]}&`;

    var params = encodeURIComponent(sv_peticion).replaceAll("%3D", "=").replaceAll("%26", "&");


    await window.fetch("http://csgostats.gg/player/multi?" + params)
        .then(r => {
            return r.text()
        })
        .then(texto => {
            var p = new DOMParser()
            var doc = p.parseFromString(texto, "text/html")

            respuesta = {};

            //document.querySelector('[data-type-row="wins"]').children[0].innerText

            for (var i = 0; i < 10; i++) {
                var a = i;
                if (i > 4) {
                    a++;
                }
                respuesta[i] = {
                    nombre: doc.querySelectorAll('[data-name]')[i].dataset.name,
                    update: doc.querySelector('[data-type-row="last_game"]').children[a].innerText.trim(),
                    imagen: doc.getElementById("players-wrapper").getElementsByTagName("img")[i].src,
                    rango: doc.querySelectorAll('[data-rank-value]')[i].dataset.rankValue,
                    compes: doc.querySelector('[data-type-row="wins"]').children[a].innerText.trim(),
                    profile: doc.querySelectorAll('.player-name')[i].nextElementSibling.children[0].href
                }
            }

            for (var i = 0; i < 10; i++) {
                $i(`sn${i}`).innerHTML = `<h5 class="nombre-jugador">${respuesta[i].nombre}</h5>`;
                $i(`sa${i}`).innerHTML = `<a target="_blank" href="${respuesta[i].profile}"><img title="${respuesta[i].update} updated" src="${respuesta[i].imagen}" style="width: 50px; height: 50px;"></a>`;
                $i(`rc${i}`).innerHTML = `<img class="rank" title="${respuesta[i].compes} competitivas ganadas" src="https://static.csgostats.gg/images/ranks/${respuesta[i].rango}.png">`;
            }

            for (var a = 0; a < 5; a++) { for (var i of document.getElementById(`${a}`).getElementsByTagName("td")) { i.style.background = "#287755" } }
            for (var b = 5; b < 10; b++) { for (var i of document.getElementById(`${b}`).getElementsByTagName("td")) { i.style.background = "#005b93" } }


        })



    moreinfo(respuesta)

}

for (var i = 0; i < 10; i++) {
    if ($i("o" + i).innerText != "") {
        $i("btn1").getElementsByTagName("button")[0].classList.add("enabled");
    }
}


/***
 *     .----------------.  .----------------.  .----------------.  .-----------------. .----------------. 
 *    | .--------------. || .--------------. || .--------------. || .--------------. || .--------------. |
 *    | |      __      | || |    _______   | || |  ____  ____  | || | ____  _____  | || |     ______   | |
 *    | |     /  \     | || |   /  ___  |  | || | |_  _||_  _| | || ||_   \|_   _| | || |   .' ___  |  | |
 *    | |    / /\ \    | || |  |  (__ \_|  | || |   \ \  / /   | || |  |   \ | |   | || |  / .'   \_|  | |
 *    | |   / ____ \   | || |   '.___`-.   | || |    \ \/ /    | || |  | |\ \| |   | || |  | |         | |
 *    | | _/ /    \ \_ | || |  |`\____) |  | || |    _|  |_    | || | _| |_\   |_  | || |  \ `.___.'\  | |
 *    | ||____|  |____|| || |  |_______.'  | || |   |______|   | || ||_____|\____| | || |   `._____.'  | |
 *    | |              | || |              | || |              | || |              | || |              | |
 *    | '--------------' || '--------------' || '--------------' || '--------------' || '--------------' |
 *     '----------------'  '----------------'  '----------------'  '----------------'  '----------------' 
 */




async function moreinfo(respuesta) {
    for (var i = 0; i < 10; i++) {
        var profile = respuesta[i].profile;
        var id = profile.match(/(\d+)/)[1]
        await steamlevel(id, i)
        await stats(id, i, "global")
        await stats(id, i, "range")
        await getProfile(id, i)
    }

    //getMatchDataInfo("info");
}

async function steamlevel(id, i) {
    // OBTENER DE LA PAGINA DE DE STEAMREP UN JSON CON CIERTA INFORMACIÓN
    const epoch = parseInt(new Date().valueOf().toString().slice(0, -3)) + 350;
    const url = `https://steamrep.com/util.php?op=getSteamProfileInfo&id=${id}&tm=${epoch}`;
    return window.fetch(url).then(r => {
        if (r.status == "200") {
            return r.text();
        }
    })
        .then(res => {
            var datos = JSON.parse(res);

            var years = new Date().getYear() - new Date(datos.membersince).getYear()

            if (parseInt(datos.steamlevel) < 10) datos.steamlevel = "0" + datos.steamlevel;

            if (parseInt(datos.steamlevel) == 0) datos.steamlevel = "00";

            var nivel = (datos.steamlevel) ? `<span class="year-style">${datos.steamlevel}</span>` : "";

            $i(`sl${i}`).innerHTML = `${nivel}`;;

        })
        .catch(e => {
            $i("sl" + i).innerHTML = `<i class="error" onclick="steamlevel(${id},${i})">Retry</i>`;
        })
}

async function getProfile(id, i) {

    const base = "https://faceitfinder.com/profile/";

    return fetch(base + id)
        .then(r => {
            if (r.status == "200") {
                return r.text();
            }
        })
        .then(info => {
            var parser = new DOMParser()
            var doc = parser.parseFromString(info, "text/html")

            var privado = "private"

            // var name = doc.getElementsByClassName("account-steam-name")[0].innerText
            // var trust = doc.getElementsByClassName("account-steam-trust")[0].title

            var account = doc.getElementsByClassName("account-steaminfo-row-value")[0].innerHTML

            if (account == "Private") {
                account = {
                    "estado": privado,
                    "creado": privado,
                    "desde": privado,
                    "horascs": privado,
                    "horascs2": privado,
                    "logros": privado,
                    "amigos": privado

                }
            } else {
                account = {
                    "estado": doc.getElementsByClassName("account-steaminfo-row-value")[0].innerText,
                    "creado": doc.getElementsByClassName("account-steaminfo-row-value")[1].innerText,
                    "desde": doc.getElementsByClassName("account-steaminfo-row-value")[2].innerText,
                    "horascs": doc.getElementsByClassName("account-steaminfo-row-value")[3].innerText,
                    "horascs2": doc.getElementsByClassName("account-steaminfo-row-value")[4].innerText,
                    "logros": doc.getElementsByClassName("account-steaminfo-row-value")[5].innerText,
                    "amigos": doc.getElementsByClassName("account-steaminfo-row-value")[6].innerText

                }
            }

            if (account.horascs != privado) {
                $i("hc" + i).innerHTML = `<i class="horas-counter">${account.horascs}</i>`;
            }
            else {
                $i("hc" + i).innerHTML = `<i class="prohibido">Pirv</i>`;
            }

            if (account.desde != privado) {
                var fecha_mal = account.desde;
                var efecha = /(\d{2})\.(\d{2})\.(\d{4})/;
                var fecha_corregida = `${efecha.exec(fecha_mal)[2]}-${efecha.exec(fecha_mal)[1]}-${efecha.exec(fecha_mal)[3]}`
                var years = new Date().getYear() - new Date(fecha_corregida).getYear();
                $i("hc" + i).innerHTML += `<i class="year-style">${years} años</i>`;
            }
            else {
                $i("hc" + i).innerHTML += ``;
            }



        })
        .catch(e => {
            $ID("hc" + i).innerHTML = $ID("hc" + i).innerHTML = `<i class="error" onclick="getProfile(${id},${i})">Reintentar</i>`;
        })
}

async function stats(id, i, type) {
    var url = "http://csgostats.gg/player/"

    var error = false;


    if (type == "global") {
        url += `${id}`;
        if (error) console.log(url);
    }
    else if (type == "range") {
        var ahora = Math.floor(Date.now() / 1000) + 40000;
        var start = ahora - 2592000;  // 2592000 = segundos (30 dias)
        url += `${id}?type=comp&date_start=${start}&date_end=${ahora}`;
    }

    window.fetch(url)
        .then(r => {
            return r.text()
        })
        .then(texto => {
            var p = new DOMParser()
            var doc = p.parseFromString(texto, "text/html")

            console.log(url);

            if (error) error = false;

            var kdratio = 0;
            var totalgames = 0;

            try {
                kdratio = doc.querySelector("#kpd").children[0].innerHTML.trim()
                totalgames = doc.getElementsByClassName("total-stat")[0].getElementsByClassName("total-value")[0].innerText
            }
            catch (e) {
                console.log(e);
            }

            var bestRank = `https://static.csgostats.gg/images/ranks/${respuesta[i].rango}.png`;

            try {
                bestRank = doc.getElementsByClassName("player-ranks")[0].getElementsByTagName("div")[0].children[0].src;
            }
            catch (e) {
                console.log(e);
            }


            $i("rb" + i).innerHTML = `<img class="rank grey" src="${bestRank}"></img>`;

            (type == "global") ? $i("kdra" + i).innerHTML = `<i class="kdratio">${kdratio}</i><br><i>${totalgames}</i>` : $i("kdrb" + i).innerHTML = `<i class="kdratio">${kdratio}</i><br><i>${totalgames}</i>`;

            if (type == "global") storeMatchData(doc, i);

            var kdrab = true, kdrbb = true;
            var mrg = true, mrp = true;

            for (var a = 0; a < 10; a++) {
                if ($i("kdra" + a).innerText == "") { kdrab = false }
                if ($i("kdrb" + a).innerText == "") { kdrbb = false }
            }

            if (kdrab) { if (!$i("btn2").getElementsByTagName("button")[0].classList.contains("enabled")) $i("btn2").getElementsByTagName("button")[0].classList.add("enabled"); }
            if (kdrbb) { if (!$i("btn3").getElementsByTagName("button")[0].classList.contains("enabled")) $i("btn3").getElementsByTagName("button")[0].classList.add("enabled"); }

            for (var b = 0; b < 10; b++) {
                if ($i("rc" + b).innerHTML == "") {
                    mrg = false;
                }
                if ($i("rb" + b).innerHTML == "") {
                    mrp = false;
                }
            }

            if (mrg) {
                var mrga = 0;
                var mrgab = 0;
                for (var ct = 0; ct < 5; ct++) {
                    mrga += parseInt($i("rc" + ct).getElementsByTagName("img")[0].src.match(/(\d+)/)[1])
                }
                for (var ctb = 5; ctb < 10; ctb++) {
                    mrgab += parseInt($i("rc" + ctb).getElementsByTagName("img")[0].src.match(/(\d+)/)[1])
                }
                $i("mediaA").innerHTML = `
                    <div class="media-actual">
                    <div class="A">
                        <img src="https://static.csgostats.gg/images/ranks/${Math.floor(mrga / 5)}.png" />
                        </div>
                        <p class="vs">VS</p>
                        <div class="B">
                        <img src="https://static.csgostats.gg/images/ranks/${Math.floor(mrgab / 5)}.png" />
                        </div>
                    </div>
                `
            }

            if (mrp) {
                var mrgb = 0;
                var mrgbz = 0;
                for (var tt = 0; tt < 5; tt++) {
                    mrgb += parseInt($i("rb" + tt).getElementsByTagName("img")[0].src.match(/(\d+)/)[1])
                }
                for (var tta = 5; tta < 10; tta++) {
                    mrgbz += parseInt($i("rb" + tta).getElementsByTagName("img")[0].src.match(/(\d+)/)[1])
                }

                $i("mediaB").innerHTML = `
                    <div class="media-pasado">
                        <div class="A">
                         <img src="https://static.csgostats.gg/images/ranks/${Math.round(mrgb / 5)}.png" />
                         </div>
                        <p class="vs">VS</p>
                        <div class="B">
                         <img src="https://static.csgostats.gg/images/ranks/${Math.round(mrgbz / 5)}.png" />
                         </div>
                        </div>
                         `
            }





        }).catch(e => {
            console.log(e);
            error = true;
            console.log(respuesta[i].profile);
            console.log(i);
            var id = respuesta[i].profile.match(/(\d+)/)[1]
                (type == "global") ? $i("kdra" + i).innerHTML = `<i class="error" onclick="stats(${id},${i},'global')">Reintentar</i>` : $i("kdrb" + i).innerHTML = `<i class="error" onclick="stats(${id},${i},'range')">Reintentar</i>`;
        })

}

var infoPartidas = {};

function storeMatchData(documento, indice) {
    var partidas = [];
    for (var z = 0; z < 5; z++) {
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


/***
 *     .----------------.  .----------------.  .----------------.  .----------------.  .----------------. 
 *    | .--------------. || .--------------. || .--------------. || .--------------. || .--------------. |
 *    | |    _______   | || |  _________   | || |     ____     | || |  _______     | || |  _________   | |
 *    | |   /  ___  |  | || | |  _   _  |  | || |   .'    `.   | || | |_   __ \    | || | |_   ___  |  | |
 *    | |  |  (__ \_|  | || | |_/ | | \_|  | || |  /  .--.  \  | || |   | |__) |   | || |   | |_  \_|  | |
 *    | |   '.___`-.   | || |     | |      | || |  | |    | |  | || |   |  __ /    | || |   |  _|  _   | |
 *    | |  |`\____) |  | || |    _| |_     | || |  \  `--'  /  | || |  _| |  \ \_  | || |  _| |___/ |  | |
 *    | |  |_______.'  | || |   |_____|    | || |   `.____.'   | || | |____| |___| | || | |_________|  | |
 *    | |              | || |              | || |              | || |              | || |              | |
 *    | '--------------' || '--------------' || '--------------' || '--------------' || '--------------' |
 *     '----------------'  '----------------'  '----------------'  '----------------'  '----------------' 
 */


function getMatchDataInfo(tipo, t) {

    if (!t.classList.contains("enabled")) {
        return;
    }


    if (tipo == "info") {
        for (var i = 0; i < 10; i++) {
            for (var a = 0; a < 5; a++) {
                var z = a
                if (a == 0) a = "e";
                if (a == 1) a = "d";
                if (a == 2) a = 'c';
                if (a == 3) a = 'b';
                if (a == 4) a = 'a';

                var timehoras = infoPartidas[i][z].time;

                if (timehoras.search(/\Whours\W/) != -1) timehoras = timehoras.replace("hours ago", "hrs");
                if (timehoras.search(/1\Wday\Wago/) != -1) timehoras = timehoras.replace("1 day ago", "ayer");
                if (timehoras.search(/1st/) != -1 || timehoras.search(/2nd/) != -1 || timehoras.search(/\drd/) != -1 || timehoras.search(/\dth/) != -1) {

                    timehoras = timehoras.replace(/st|nd|rd/, "").slice(4);
                }

                $i("i" + a + i).innerHTML = `<b class="marcador">${infoPartidas[i][z].resultado_texto}</i><br> 
                                            <p class="mapa">${infoPartidas[i][z].mapa}</p><br>
                                            <i>${timehoras}</i>`;
                a = z
            }
        }
    }
    if (tipo == "kdr") {
        for (var i = 0; i < 10; i++) {
            for (var a = 0; a < 5; a++) {
                var z = a
                if (a == 0) a = "e";
                if (a == 1) a = "d";
                if (a == 2) a = 'c';
                if (a == 3) a = 'b';
                if (a == 4) a = 'a';
                $i("i" + a + i).innerHTML = `<b class="marcador">${infoPartidas[i][z].kills} K<br><i class="mapa">${infoPartidas[i][z].assists} A</i><br><i>${infoPartidas[i][z].deaths} D</i></b>`;
                a = z
            }
        }
    }
    if (tipo == "adr") {
        for (var i = 0; i < 10; i++) {
            for (var a = 0; a < 5; a++) {
                var z = a
                if (a == 0) a = "e";
                if (a == 1) a = "d";
                if (a == 2) a = 'c';
                if (a == 3) a = 'b';
                if (a == 4) a = 'a';
                $i("i" + a + i).innerHTML = `<b class="marcador">${infoPartidas[i][z].adr}</b>`;
                a = z
            }
        }
    }
    if (tipo == "hs") {
        for (var i = 0; i < 10; i++) {
            for (var a = 0; a < 5; a++) {
                var z = a
                if (a == 0) a = "e";
                if (a == 1) a = "d";
                if (a == 2) a = 'c';
                if (a == 3) a = 'b';
                if (a == 4) a = 'a';
                $i("i" + a + i).innerHTML = `<b class="marcador">${infoPartidas[i][z].hs}</b>`;
                a = z
            }
        }
    }
    if (tipo == "hltv") {
        for (var i = 0; i < 10; i++) {
            for (var a = 0; a < 5; a++) {
                var z = a
                if (a == 0) a = "e";
                if (a == 1) a = "d";
                if (a == 2) a = 'c';
                if (a == 3) a = 'b';
                if (a == 4) a = 'a';
                $i("i" + a + i).innerHTML = `<b class="marcador">${infoPartidas[i][z].hltv}</b>`;
                a = z
            }
        }
    }

    for (var i = 0; i < 10; i++) {
        for (var a = 0; a < 5; a++) {
            var z = a
            if (a == 0) a = "e";
            if (a == 1) a = "d";
            if (a == 2) a = 'c';
            if (a == 3) a = 'b';
            if (a == 4) a = 'a';
            var yo = infoPartidas[i][z].resultado_texto.match(/(\d+):(\d+)/)[1];
            var rival = infoPartidas[i][z].resultado_texto.match(/(\d+):(\d+)/)[2];
            // $i("i"+ a + i).style.background= ;
            $i("i" + a + i).style.background = (parseInt(yo) == 15 && parseInt(rival) == 15) ? "#a5a5a5" : (parseInt(yo) > parseInt(rival)) ? "#a9f1a6" : "#f1aba6";
            a = z
        }
    }

}


/***
 *     .----------------.  .----------------.  .----------------.  .----------------. 
 *    | .--------------. || .--------------. || .--------------. || .--------------. |
 *    | |    _______   | || |     ____     | || |  _______     | || |  _________   | |
 *    | |   /  ___  |  | || |   .'    `.   | || | |_   __ \    | || | |  _   _  |  | |
 *    | |  |  (__ \_|  | || |  /  .--.  \  | || |   | |__) |   | || | |_/ | | \_|  | |
 *    | |   '.___`-.   | || |  | |    | |  | || |   |  __ /    | || |     | |      | |
 *    | |  |`\____) |  | || |  \  `--'  /  | || |  _| |  \ \_  | || |    _| |_     | |
 *    | |  |_______.'  | || |   `.____.'   | || | |____| |___| | || |   |_____|    | |
 *    | |              | || |              | || |              | || |              | |
 *    | '--------------' || '--------------' || '--------------' || '--------------' |
 *     '----------------'  '----------------'  '----------------'  '----------------' 
 */


function sortTable(n, t) {

    if (!t.classList.contains("enabled")) {
        return;
    }

    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;



    table = document.getElementsByClassName("table-rows")[0];

    switching = true;

    //Set the sorting direction to ascending:

    dir = "asc";


    /*Make a loop that will continue until no switching has been done:*/

    while (switching) {

        //start by saying: no switching is done:

        switching = false;

        rows = table.rows;

        /*Loop through all table rows (except the first, which contains table headers):*/

        for (i = 0; i < (rows.length - 1); i++) {

            //start by saying there should be no switching:

            shouldSwitch = false;

            /*Get the two elements you want to compare, one from current row and one from the next:*/

            x = rows[i].getElementsByTagName("TD")[n];

            y = rows[i + 1].getElementsByTagName("TD")[n];

            /*check if the two rows should switch place, based on the direction, asc or desc:*/

            if (dir == "asc") {

                if (parseFloat(x.getElementsByClassName("kdratio")[0].innerHTML) > parseFloat(y.getElementsByClassName("kdratio")[0].innerHTML)) {

                    //if so, mark as a switch and break the loop:

                    shouldSwitch = true;

                    break;

                }

            } else if (dir == "desc") {

                if (parseFloat(x.getElementsByClassName("kdratio")[0].innerHTML) < parseFloat(y.getElementsByClassName("kdratio")[0].innerHTML)) {

                    //if so, mark as a switch and break the loop:

                    shouldSwitch = true;

                    break;

                }

            }

        }

        if (shouldSwitch) {

            /*If a switch has been marked, make the switch and mark that a switch has been done:*/

            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);

            switching = true;

            //Each time a switch is done, increase this count by 1:

            switchcount++;

        } else {

            /*If no switching has been done AND the direction is "asc", set the direction to "desc" and run the while loop again.*/

            if (switchcount == 0 && dir == "asc") {

                dir = "desc";

                switching = true;

            }

        }

    }

}