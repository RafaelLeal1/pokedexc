let pokemons = [];  
const pokemonList = document.getElementById('pokemonList');  
const loadMoreButton = document.getElementById('loadMoreButton');  
const maxRecords = 151;  
const limit = 10;  
let offset = 0; 

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>
            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <img src="${pokemon.photo}" alt="${pokemon.name}" onclick="showPokemonDetails(${pokemon.number})">
            </div>
        </li>
    `;
}

function loadPokemonItems(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((fetchedPokemons = []) => {
        pokemons = [...pokemons, ...fetchedPokemons];  

        const newHtml = fetchedPokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;

         
        updateIframeContent();
    });
}



function updateIframeContent() {
    const iframe = document.querySelector('iframe');

    if (iframe) {
        const currentIframePokemon = parseInt(iframe.src.split('=')[1]);
        const currentIframePokemonIndex = pokemons.findIndex(pokemon => pokemon.number === currentIframePokemon);

        if (currentIframePokemonIndex !== -1) {
            const nextPokemonIndex = currentIframePokemonIndex + 1;

            if (nextPokemonIndex < pokemons.length) {
                const nextPokemon = pokemons[nextPokemonIndex];
                const pokemonUrl = `cardpokemon.html?id=${nextPokemon.number}`;

                iframe.src = pokemonUrl;
            }
        }
    }
}

 /* Atualizar  o número do ID no iframe depois do Load  */ 

loadPokemonItems(offset, limit);

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNextPage = offset + limit;

    if (qtdRecordsWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItems(offset, newLimit);

        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItems(offset, limit);
    }
});
