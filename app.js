// CLIENT ID

const clientId =
"d434fe096a224ab6ad560281023179f7";


// CLIENT SECRET

const clientSecret =
"10de6df0e440414c9c698021d29b70e4";


const input =
document.getElementById("busqueda");


const boton =
document.getElementById("boton");


const imagenArtista =
document.getElementById("imagen-artista");

const nombreArtista =
document.getElementById("nombre-artista");

const oyentes =
document.getElementById("oyentes");

const seguidores =
document.getElementById("seguidores");

const popularidad =
document.getElementById("popularidad");

const bio =
document.getElementById("bio");

const historia =
document.getElementById("historia");

const canciones =
document.getElementById("canciones");


boton.addEventListener("click", () => {

    buscarArtista();

});


async function obtenerToken(){

    const respuesta =
    await fetch(
        "https://accounts.spotify.com/api/token",
        {

            method: "POST",

            headers: {

                "Content-Type":
                "application/x-www-form-urlencoded",

                Authorization:
                "Basic " +
                btoa(clientId + ":" + clientSecret)

            },

            body:
            "grant_type=client_credentials"

        }
    );

    const datos =
    await respuesta.json();

    return datos.access_token;

}


async function buscarArtista(){


    const artista =
    input.value;


    const token =
    await obtenerToken();


    const url =
    `https://api.spotify.com/v1/search?q=${artista}&type=artist&limit=1`;


    const respuesta =
    await fetch(url, {

        headers: {

            Authorization:
            `Bearer ${token}`

        }

    });


    const datos =
    await respuesta.json();


    const artist =
    datos.artists.items[0];


    if(!artist){

        nombreArtista.innerHTML =
        "Artista no encontrado";

        return;

    }


    const artistId =
    artist.id;


    const tracksRespuesta =
    await fetch(

        `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=MX`,

        {

            headers: {

                Authorization:
                `Bearer ${token}`

            }

        }

    );


    const tracksDatos =
    await tracksRespuesta.json();


    const topCanciones =
    tracksDatos.tracks.slice(0,5);


    let imagen = "";

    if(artist.images.length > 0){

        imagen =
        artist.images[0].url;

    }


    const oyentesMensuales =
    Math.floor(
        artist.followers.total * 2.3
    ).toLocaleString();


    const textoBio =
    `
    ${artist.name} es un artista reconocido
    mundialmente dentro de Spotify gracias
    a sus millones de reproducciones y
    canciones populares.
    `;


    const textoHistoria =
    `
    ${artist.name} ha logrado posicionarse
    como uno de los artistas más escuchados
    dentro de la industria musical moderna.
    `;


    imagenArtista.src =
    imagen;

    nombreArtista.innerHTML =
    artist.name;

    oyentes.innerHTML =
    `${oyentesMensuales} oyentes mensuales`;

    seguidores.innerHTML =
    `${artist.followers.total.toLocaleString()} seguidores`;

    popularidad.innerHTML =
    `${artist.popularity}/100`;

    bio.innerHTML =
    textoBio;

    historia.innerHTML =
    textoHistoria;


    canciones.innerHTML = "";


    topCanciones.forEach(cancion => {

        canciones.innerHTML += `

        <li>
            ${cancion.name}
        </li>

        `;

    });

}