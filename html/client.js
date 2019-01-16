function searchData(userInput){
    if (userInput && userInput!== ''){
        let titleArea = document.getElementById("mainTitle");
        let textDiv = document.getElementById("content-area")

        //show searching message
        titleArea.innerHTML = 'Searching on Food2Fork...'

        console.log('search requested!');

        let requestObj = {
            food: userInput,
            operation: "search food"
        }
        let requestJSON = JSON.stringify(requestObj);
        $.post("searchRequest", requestJSON, function (data, status){
            document.getElementById("food").value = '';
            //console.log("data: " + data)
            let responseObj = JSON.parse(data)
            console.log(responseObj.data)
            let foods = JSON.parse(responseObj.data)
            //console.log(foods.recipes)

            titleArea.innerHTML = 'Search result for: ' + userInput;
            textDiv.innerHTML = '\n'
            for (let food of foods.recipes){
                textDiv.innerHTML += `<div id="foodDiv">\n\t<img id="foodImg" src="${food.image_url}"width='200' height='200'>\n\t<a id="foodTitle" href="${food.f2f_url}" target="_blank"> ${food.title}</a>\n</div>\n`
            }
            // deal with respond obj！
        })
    }
}

function handleSearch(){
    let userInput = document.getElementById("food").value;

    searchData(userInput);
}

$(document).ready(function() {
    let URL = new URLSearchParams(window.location.search);
    console.log("current URL: " + URL.toString());

    if(URL.has('ingredients')){
        let userInput = URL.get('ingredients');
        console.log("Searching via URL: " + userInput);

        searchData(userInput);
    }
})
