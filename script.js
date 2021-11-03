const gridArray = [];

let button = document.getElementById("createGridButton");
let savebutton =  document.getElementById("save");
let container = document.getElementById("gridContainer");
let rij;
let kolom;

//Het maken van het grid
button.addEventListener("click", ()=> {
    rij = document.getElementById("rij").value;
    kolom = document.getElementById("kolom").value;

    //informatie die we aan elk blokje mee willen geven
    let tilesize;
    let borderSize = 2;
    let tileCount = rij * kolom;
    
    if(rij >= kolom){
        tilesize = 500/rij;
        console.log("ik doe nu gedeelt door rij" + rij + kolom)
    } 
    if(kolom > rij) {
        tilesize = 500/kolom;
        console.log("ik doe nu gedeeld door kolom" + rij + kolom)
    }

    //Dit haalt een eerder gebouwd grid weg.
    for(let i = container.children.length-1; i > 0; i--){
        container.removeChild(container.children[i]);
    }
    
    for(let i = 0; i < tileCount; i++){
        
        let tiles = document.createElement("div");
        
        //informatie over die de tiles mee krijgen
        tiles.className = "tile";
        tiles.style.width = tilesize + "px";
        tiles.style.height = tilesize + "px";
        tiles.style.borderWidth = borderSize + "px";
        tiles.style.backgroundColor = "grey";
        
        //maken van kolommen
        tiles.style.left = (i % kolom) * (tilesize+borderSize) + "px";
    
        //maken van rijen
        tiles.style.top = Math.floor(i / kolom) * (tilesize+borderSize) + "px";
        tiles.style.backgroundColor= colorDict["default"];
        
        //de plek waar het grid in komt neemt het gemaakte blokje als Child
        container.appendChild(tiles);

        //reset waypoint teller
        currentUnit.value = 1;


    }

})


//Functie die elke kleur vervangt voor het begrip wat er aan is gekoppeld
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

//ActiveSelector is de kleur die te geven aan een blokje in het grid
let activeSelector = "default";

//Het balkje met alle mogelijk te geven kleuren
let selectorHolder = document.getElementById("mapPalette");

//Het aanroepen tot het maken van elk van de selectors
addTileSelector('spawnpoint', 'red');
addTileSelector('path', 'yellow');
addTileSelector('waypoint', 'blue');
addTileSelector('buildable', 'green');
addTileSelector('default', 'lightgrey');


//De fuctie die een selector kan maken
function addTileSelector(name, color){
    
    let tileSelector = document.createElement("div");
    //alle informatie wat er mee gegeven moet worden aan het element
    let size = 60;
    let margin = 30;
    tileSelector.id = name;
    tileSelector.className = 'selector';
    tileSelector.style.width = size + "px";
    tileSelector.style.height = size + "px";
    tileSelector.style.backgroundColor = color;
    tileSelector.style.left = selectorHolder.children.length * (size + margin) + margin + "px";
    
    //elke selector krijgt een titelbalk mee
    let selectorTitle = document.createElement("p");
    selectorTitle.innerHTML = name;
    selectorTitle.id = "selectorTitle";
    
    
    //Het balkje 'selectorholder' neemt het net gemaakte element als child
    selectorHolder.appendChild(tileSelector);
    if(name == "waypoint"){
        let unit = document.createElement('input');
        unit.type = "number";
        unit.min = "1"
        unit.value = 1;
        unit.className = "unit";
        unit.id = "masterUnit"
        tileSelector.appendChild(unit);
    }
    tileSelector.appendChild(selectorTitle);
    
}

clickSelectors();
clickGridTiles();

//functie die de actieve selector aanpast
function clickSelectors(){
    if(selectorHolder.children.length > 0){
        
        selectorHolder.addEventListener("click", (e) =>{
            if(e.target.id != "mapPalette" && e.target.className != "unit"){
                
                //ActiveSelector vernaderen naar de zojuist geklikte
                if( e.target.id != "selectorTitle"){
                    activeSelector = e.target.id;
                
                    //Weghalen van borders van alle selectors
                    for(let i=0;i<selectorHolder.children.length;i++){
                        selectorHolder.children[i].style.borderWidth = "1px";
                        selectorHolder.children[i].style.boxShadow = "0px 0px 0px 0px";
                    }

                    //Border aanpassen van ActiveSelector zodat zichtbaar is welke actief is
                    e.target.style.borderWidth = "2.5px";
                    e.target.style.boxShadow = "0px 0px 2px 2px purple";
                }
                if (e.target.id == "selectorTitle") {
                    console.log(e.target.parentElement.id)
                    activeSelector = e.target.parentElement.id;
                
                    //Weghalen van borders van alle selectors
                    for(let i=0;i<selectorHolder.children.length;i++){
                        selectorHolder.children[i].style.borderWidth = "1px";
                        selectorHolder.children[i].style.boxShadow = "0px 0px 0px 0px";
                    }

                    //Border aanpassen van ActiveSelector zodat zichtbaar is welke actief is
                    e.target.parentElement.style.borderWidth = "2.5px";
                    e.target.parentElement.style.boxShadow = "0px 0px 2px 2px purple";
                }
            }
        })
    }
}


//key-value pairs
let colorDict = {spawnpoint: "red", path:"yellow", waypoint:"blue", buildable:"green", default:"lightgrey"}

let currentUnit = document.getElementById("masterUnit");
//Functie om blokjes in het grid clickbaar te maken
function clickGridTiles(){
    container.addEventListener('click', (e) =>{
        if(e.target.getAttribute('id')!="gridContainer" && e.target.getAttribute('id')!="unit"){
                        
            //nummer toevoegen wanneer het om WAYPOINT gaat
            let unit;
            if(activeSelector == "waypoint" && e.target.children.length != 1) {
                unit = document.createElement('input');
                unit.type = "number";
                unit.min = "1"
                unit.value = currentUnit.value;
                unit.className = "unit";
                unit.id = "unit";
                currentUnit.value ++;
                selectorUnit = currentUnit;
                e.target.appendChild(unit);
            } 

            //nummer weghalen in tile wanneer je de kleur aanpast
            if(e.target.getAttribute('id') === 'waypoint' && e.target.children.length == 1) {
                e.target.removeChild(e.target.children[0]);
                currentUnit.value --;
            }
            
            //het geklikte blokje neemt de kleur van de ActiveSelector over
            e.target.style.backgroundColor = colorDict[activeSelector];
            //het blokje krijgt de huide kleur-value-pair als id mee
            e.target.setAttribute('id', activeSelector);
            
            //blokje krijgt getal als value
            e.target.setAttribute('value', currentUnit.value -1)
            //getal in waypoint in het pallet wordt aangepast naar het nieuwe huidige waypoint-getal
            currentUnit.setAttribute("value", currentUnit.value);
            
        }
    })
}


//functie voor SAVEBUTTON
savebutton.addEventListener("click", ()=> {

    //width data in losse array stoppen
    let widthData = [];
    let gridDimensie = kolom;
    widthData.push("width: " + gridDimensie);
    
    //lege Array waar info van elk blokje in komt
    let tileData = [];
    for(let i = 0; i < container.children.length; i++){
        
        let color = container.children[i].style.backgroundColor;
        let tileUnit = container.children[i].getAttribute('value');
        
        //Functie aanroepen die de key-value voor elke kleur vervangt
        let type = getKeyByValue(colorDict, color);

        if(type == "waypoint"){
            console.log("dit is een waypoint");
            type += ": " + tileUnit;
        }
        
        //info per blokje wordt in array geduwd
        tileData.push("type"+ ": " + type);
    }

    //de twee array's combineren
    let arrayForSave = widthData.concat([tileData]);
    //laten zien in console wat de inhoud is van de Array
    console.log(arrayForSave);
    
    //Storing data
    let finishedLevel = JSON.stringify(arrayForSave);
    console.log(finishedLevel);




    //download("map.json", finishedLevel)


});

function download(filename, text) {
    let a = document.createElement("a");
    a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    a.setAttribute('download', filename);

    console.log(a);

    a.style.display = 'none';
    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);
}