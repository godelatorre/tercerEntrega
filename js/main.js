class Participante {
    constructor(nombre, apellido, email, numeroElegido) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.numeroElegido = numeroElegido;
    }
}

//Utilice localStorage solo para guardar los participantes que fueron ganadores cada vez que se hace click en el boton reiniciar

let participantes = JSON.parse(localStorage.getItem("participantes")) || [];
let numerosElegidos = JSON.parse(localStorage.getItem("numerosElegidos")) || {};

const formularioParticipante = document.getElementById("formularioParticipante");

const agregarParticipante = () => {
    const nombre = document.getElementById("nombre").value;
    const apellido = document.getElementById("apellido").value;
    const email = document.getElementById("email").value;
    const numeroElegido = parseInt(document.getElementById("numeroElegido").value);

    const participante = new Participante(nombre, apellido, email, numeroElegido);
    participantes.push(participante);

    if (numerosElegidos[numeroElegido]) {
        numerosElegidos[numeroElegido].push(participante);
    } else {
        numerosElegidos[numeroElegido] = [participante];
    }

    localStorage.setItem("participantes", JSON.stringify(participantes));
    localStorage.setItem("numerosElegidos", JSON.stringify(numerosElegidos));

    formularioParticipante.reset();

    if (participantes.length >= 3) {
        realizarSorteo();
        document.getElementById("btnReiniciar").disabled = false;
    }
};

const reiniciarPagina = () => {
    localStorage.removeItem("participantes");
    localStorage.removeItem("numerosElegidos");

    participantes = [];
    numerosElegidos = {};

    const resultadoElement = document.querySelector("#resultado");
    resultadoElement.innerHTML = "";

    formularioParticipante.reset();

    document.getElementById("btnReiniciar").disabled = true; 
};

document.getElementById("formularioParticipante").addEventListener("submit", (event) => {
    event.preventDefault();
    if (participantes.length < 3) {
        agregarParticipante();
    }
});

document.getElementById("btnReiniciar").addEventListener("click", reiniciarPagina);

//A continuacion cree una funcion relizarSorteo para que una vez que se realice cada sorteo, los ganadores se almacenen en el localStorage, para que al final podamos tener la lista de dichos ganadores y asi repartir los premios.

const realizarSorteo = () => {
    const numeroGanador = Math.floor(Math.random() * 3) + 1;
    let ganadores = numerosElegidos[numeroGanador] || [];

    if (ganadores.length > 0) {
        localStorage.setItem("ganadores", JSON.stringify(ganadores));
    } else {
        localStorage.removeItem("ganadores");
    }

    let mensajeFinal = `El número ganador es el ${numeroGanador}. El ganador es: `;
    mensajeFinal = ganadores.reduce((mensaje, ganador) => `${mensaje}${ganador.nombre} ${ganador.apellido} (${ganador.email}), `, mensajeFinal);

    const resultadoElement = document.querySelector("#resultado");
    resultadoElement.innerHTML = <p>${mensajeFinal}</p>;
};