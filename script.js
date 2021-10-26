const gridArray = [];

let button = document.getElementById("createGridButton");
let savebutton =  document.getElementById("save");
let container = document.getElementById("gridContainer");


//Het maken van het grid
button.addEventListener("click", ()=> {
    let rij = document.getElementById("rij").value;
    let kolom = document.getElementById("kolom").value;

    //informatie die we aan elk blokje mee willen geven
    let tilesize = 40;
    let borderSize = 2;
    let tileCount = rij * kolom;
    
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
    let size = 40;
    let margin = 20;
    tileSelector.id = name;
    tileSelector.className = 'selector';
    tileSelector.style.width = size + "px";
    tileSelector.style.height = size + "px";
    tileSelector.style.backgroundColor = color;
    tileSelector.style.left = selectorHolder.children.length * (size + margin) + margin + "px";

    //Het balkje 'selectorholder' neemt het net gemaakte element als child
    selectorHolder.appendChild(tileSelector);
}

clickSelectors();
clickGridTiles();

//functie die de actieve selector aanpast
function clickSelectors(){
    if(selectorHolder.children.length > 0){
        
        selectorHolder.addEventListener("click", (e) =>{
            if(e.target.id != "mapPalette"){
                
                //ActiveSelector vernaderen naar de zojuist geklikte
                activeSelector = e.target.id;

                //Weghalen van borders van alle selectors
                for(let i=0;i<selectorHolder.children.length;i++){
                    selectorHolder.children[i].style.borderWidth = "1px";
                    selectorHolder.children[i].style.boxShadow = "0px 0px 0px 0px"
                }

                //Border aanpassen van ActiveSelector zodat zichtbaar is welke actief is
                e.target.style.borderWidth = "2.5px";
                e.target.style.boxShadow = "0px 0px 2px 2px purple"
            }
        })
    }
}


//key-value pairs
let colorDict = {spawnpoint: "red", path:"yellow", waypoint:"blue", buildable:"green", default:"lightgrey"}


//Functie om blokjes in het grid clickbaar te maken
function clickGridTiles(){
    container.addEventListener('click', (e) =>{
        if(e.target.getAttribute('id')!="gridContainer"){
            
            //het geklikte blokje neemt de kleur van de ActiveSelector over
            e.target.style.backgroundColor = colorDict[activeSelector];
        }
    })
}


let tileData = [];
//functie voor SAVEBUTTON
savebutton.addEventListener("click", ()=> {
    
    //functie test
    console.log('Grid is saved');
    
    //lege Array waar info van elk blokje in komt
    
    
    for(let i = 0; i < container.children.length; i++){
        
        let color = container.children[i].style.backgroundColor;
        
        //Functie aanroepen die de key-value voor elke kleur vervangt
        let type = getKeyByValue(colorDict, color);
        
        //info per blokje wordt in array geduwd
        tileData.push(type);

        

    }
    //laten zien in console wat de inhoud is van de Array
    console.log(tileData);
    
    //Storing data
    let finishedLevel = JSON.stringify(tileData);
    console.log(finishedLevel);

    download(finishedLevel, "map", "application/json");


});

function download (data, filename, type) {
    let downloadHolder = document.getElementsByClassName("bovenBalkRechts");
    let file = new Blob([data], {type: type});
    let a = document.createElement('a');
    let url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    console.log(url)
    downloadHolder.appendChild(a);
}


// map.json