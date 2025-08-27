const selectMoneda = document.querySelector('#moneda');
const selectCriptomonedas = document.querySelector('#criptomonedas');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: ''
}

//Creamos un promise
const obtenerCriptomonedas = criptomonedas => new Promise ( resolve => {
    resolve(criptomonedas);
});

document.addEventListener('DOMContentLoaded', () =>{
    //Cargamos las criptomonedas
    consultarCriptomonedas();
    formulario.addEventListener('submit', submitFormulario);
    selectMoneda.addEventListener('change', leerValor);
    selectCriptomonedas.addEventListener('change', leerValor);

});


function leerValor(e){
    objBusqueda[e.target.name] = e.target.value;
}


function submitFormulario(e){
    e.preventDefault();

    //Validamos
    const {moneda, criptomoneda} = objBusqueda;

    if(moneda === '' || criptomoneda === ''){
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }

    consultarApi();
}

function consultarApi(){
    const {moneda, criptomoneda} = objBusqueda;
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    Spinner();

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(cotizacion => 
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]));
}

function mostrarCotizacionHTML(cotizacion){
    limpiarHTML(resultado);
    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;
    const precio = document.createElement('P');
    precio.classList.add('precio');
    precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('P');
    precioAlto.innerHTML = `Precio más alto del dia: <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement('P');
    precioBajo.innerHTML = `Precio más bajo del dia: <span>${LOWDAY}</span>`;

    const ultimasHoras = document.createElement('P');
    ultimasHoras.innerHTML = `Variación ultimas horas: <span>${CHANGEPCT24HOUR}</span>`;

    const ultimaActualizacion = document.createElement('P');
    ultimaActualizacion.innerHTML = `Ultima actualización: <span>${LASTUPDATE}</span>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);
}

function consultarCriptomonedas(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptomonedas(resultado.Data))
        .then(criptomonedas => cargarSelectCriptomonedas(criptomonedas))
}


function cargarSelectCriptomonedas(criptomonedas){
    criptomonedas.forEach( cripto => {
        const {FullName, Name} = cripto.CoinInfo;

        const option = document.createElement('OPTION');
        option.value = Name;
        option.textContent = FullName;
        selectCriptomonedas.appendChild(option);
    });
}

function mostrarAlerta(mensaje){
    //Para no repetir mensajes
    const existeAlerta = document.querySelector('.error');

        if(!existeAlerta){
            const alerta = document.createElement('DIV');
            alerta.classList.add('error');
            alerta.textContent=mensaje;
            formulario.appendChild(alerta);

            setTimeout(() =>{
                alerta.remove();
            }, 3000);
    }   


}

function Spinner(){
    limpiarHTML(resultado);
    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner');

    divSpinner.innerHTML=`
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;
    resultado.appendChild(divSpinner);
}

function limpiarHTML(selector){
    while(selector.firstChild){
        selector.removeChild(selector.firstChild);
    }
}
