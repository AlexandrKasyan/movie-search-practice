"use strict";

let page = 1;
let count = 1;
let titleMovie = "dream";
let listMovie = "";

async function getMoveiListByTitle (result ) {
    document.getElementById("slider__items").innerHTML = '';

    
    await result.Search.forEach( async element => { 
        let imdbRating = await getImdbRating(element.imdbID);
        await insertMovie(element, imdbRating.imdbRating)
    });
    
    setTimeout(function () {
        document.getElementById("slider__items").innerHTML = listMovie;

        start();

    }, 500);
}

async function getMoveiListByTitle1 (result) {
    
    await result.Search.forEach( async element => { 
        let imdbRating = await getImdbRating(element.imdbID);
        await insertMovie(element, imdbRating.imdbRating)
    });
    
    setTimeout(function () {
        document.getElementById("slider__items").innerHTML = listMovie;

    }, 500);
}



function nextPage() {
    count+=1;
    if(count%7==0){
        page+=1
        checkQuery(false)
    }
   
}

async function checkQuery(flac) {
    // Default options are marked with *
    console.log("page" + page)
    console.log(titleMovie)
    try {
        const response = await fetch(`https://www.omdbapi.com/?s=${titleMovie}&page=${page}&apikey=9b67fc54`);
        let result = await response.json();

        if (!response.ok) {
            document.getElementById('error-box').innerHTML = 'Ошибка сети/или не правильный адрес';
          throw new Error('Ответ сети был не ok.');
        }
        else if (result.Response=="False"){
            document.getElementById('error-box').innerHTML = 'Повашему запросу ничего не найдено';
          throw new Error('Повашему запросу ничего не найдено');

        }
        else {
            if(flac == true)
            getMoveiListByTitle(result)
            else if (flac == false)
            getMoveiListByTitle1(result)

        }
      } catch (error) {
        console.log('Возникла проблема с вашим запросом: ', error.message);
      }
}
async function insertMovie(element, imdbRating){
    
   listMovie +=`
        <div class="slider__item " id="${element.imdbID}">
            <p class="name__movie">${element.Title}</p>
            <p class="poster__movie"><img src="${element.Poster}" onclick="moreInfo('${element.imdbID}')"></p>
            <p class="year__movie">${element.Year}</p>              
            <p class="movie-info" id="info${element.imdbID}" onclick="hiddeInfo('${element.imdbID}')"></p>              
                               
        </div>
        `
}

async function moreInfo(imdbID){
    let movieInfo = await getImdbRating(imdbID)
    document.getElementById("info"+imdbID).innerHTML=`
        <p class="title__movie">${movieInfo.Title}</p>
        <p class="genre__movie">Жанр: ${movieInfo.Genre}</p>
        <p class="country__movie">Страна: ${movieInfo.Country}</p>
        <p class="actors__movie">В ролях: ${movieInfo.Actors}</p>              
        <p class="score"><i class="fa fa-star"></i>${movieInfo.imdbRating} IMDb</p>
                          
    `;
    document.getElementById("info"+imdbID).style.display="block";
}

function hiddeInfo(imdbID){
    //await getImdbRating(imdbID)
    document.getElementById("info"+imdbID).style.display="none";
}

function start(){
    console.log("cnhfhn");
    var elms = document.querySelectorAll('.slider');
    for (var i = 0, len = elms.length; i < len; i++) {
      
      new ChiefSlider(elms[i], {
        loop: false, 
        refresh: false
      });
    }
}
 async function getImdbRating(id){
    let response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=9b67fc54`);
    let result =  await response.json();

    return result;
    
}

async function translete(text) {
    let response = await fetch(`https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20200322T155651Z.de98a60e6a99185e.089aea4237b51c6db082c966f27a7895cd1e8b44&text=${text}&lang=ru-en`);
    let result =  await response.json();
    console.log(result.message);
    return await result.message;
}

function search(){
    document.getElementById("error-box").innerHTML="";
    document.getElementById("slider__items").innerHTML = '';
    titleMovie = document.getElementById('search').value;
    listMovie = '';
    page = 1;
    count = 1;
    checkQuery(true);
}

checkQuery(true);




