import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import fs from "fs";

const port = 3000;
const app = express();

const listPokemonUrl = "https://ex.traction.one/pokedex/pokemon";
const pokemonJsonData = fs.readFileSync('pokemonNames.json', 'utf8');
const pokemonNameData = JSON.parse(pokemonJsonData);

var pokemonDataList = [];
var pokemonNameList = [];

function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
}

function checkNameInList(name) {
    for (var i=0; i<pokemonNameList.length; i++){
        if (name === pokemonNameList[i]){
            console.log(`${name} is valid`);
            return true;
        }
    }
    return false;
}

// middlewares
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

for (var i=1; i<=301; i++){
    pokemonNameList.push(pokemonNameData[`${i}`]);
}

// route -> "/"
app.get("/", (req, res) => {
    res.render("home.ejs", {pokemonData: pokemonDataList[0]});
});

app.post("/", async (req, res) => {
    var pokemonName = toTitleCase(req.body.pokemonName);
    console.log(pokemonName);
    if (checkNameInList(pokemonName)){
        try {
            setTimeout(async function(){
                const response = await axios.get(listPokemonUrl + '/' + pokemonName);
                console.log(`Data retrieved for ${pokemonName}`);
                pokemonDataList = response.data;
                res.redirect("/");
            }, 5000);

        } catch (error) {
            console.error(error);
            res.redirect("/oops");
        }
    }else {
        res.redirect("/oops");
    }
});

// route -> "/oops"
app.get("/oops", (req, res) => {
    res.render("oops.ejs");
});

// route -> "/list"
app.get("/list", (req, res) => {
    res.render("list.ejs", {list: pokemonNameList});
});

// route -> "/info"
app.get("/info", (req, res) => {
    res.render("info.ejs", {data: pokemonDataList[0]});
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});