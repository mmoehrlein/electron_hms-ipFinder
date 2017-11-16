console.log('Hello World');

let haus;
let zimmer;

const info = document.querySelector('#info');

const liste = document.querySelector('#liste');
liste.addEventListener('click', (e)=>{
    console.log(e.target.innerHTML.valueOf());
    const infocard = document.createElement('div');
    infocard.className = 'card z-depth-5';
});

const hausbox = document.querySelector('#haus');
hausbox.addEventListener("change", ()=>{
    console.log(hausbox.value);
    haus = hausbox.value;
    updateList(haus, zimmer);
});

