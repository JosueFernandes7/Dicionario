let main = document.querySelector('main')
let buscaPalavra = document.getElementById('buscar');
let footer = document.querySelector('footer')
const container = document.querySelector('.container')
buscaPalavra.addEventListener('change', carregarDicionario)
// console.log(palavraBuscada);


function renderizarSignificado(significados, div) {
  for ({ partOfSpeech, definitions } of significados) {
    const significado = document.createElement('div')
    significado.classList.add('significado')
    significado.innerHTML +=
      ` <div class="caixa">
        <h2>${partOfSpeech}</h2>
        <div class="line"></div>
      </div>`
    const exemplos = document.createElement('div')
    const ul = document.createElement('ul')
    exemplos.classList.add('exemplos')
    exemplos.innerHTML = `<h3>Meaning</h3>`
    for ({ definition } of definitions) {
      ul.innerHTML += `<li>${definition}</li>`
    }
    exemplos.append(ul)
    significado.append(exemplos)
    div.append(significado)
  }
}
function renderizarMain(palavra, fonetica, significados) {
  main.classList.add('content')
  main.innerHTML = `
  <div class="fonetica">
    <h1 class="result">${palavra}</h1>
    <span>${fonetica}</span>
  </div>`
  const classesDePalavras = document.createElement('div')
  classesDePalavras.classList.add('classesDePalavras')
  renderizarSignificado(significados,classesDePalavras)
  main.append(classesDePalavras)
  main.innerHTML += `<div class="line"></div>`

}
function renderizarFooter() {

}
async function carregarDicionario({ target }) {
  const word = target.value
  target.value = ""
  const url = "https://api.dictionaryapi.dev/api/v2/entries/en/"
  const response = await fetch(`${url}${word}`)
  const json = await response.json()
  let data = json[0]
  if (data) {
    const linkDicionario = data.sourceUrls[0];
    const fonetica = data.phonetic;
    const palavra = data.word
    const significados = data.meanings.map(({ partOfSpeech, definitions }) => {
      return { partOfSpeech, definitions }
    });
    renderizarMain(palavra, fonetica, significados)
    // renderizarFooter()
    // console.log(significados);
  }
}
async function carregarCor() {
  const url = "http://api.creativehandles.com/getRandomColor"
  const response = await fetch(url)
  const json = await response.json()
  const { color } = json
  console.log(color);
  document.documentElement.style.setProperty('--primary-color', color)
}
carregarCor()

// async function loadTranslation(texto) {
//   // traduz de inglês para português
//   linguagemNativa = 'en-US'
//   linguagemTraducao = 'pt-BR'
//   const maxCaracteresPermitidos = 500
//   let traducao = ""
//   if(texto.length > maxCaracteresPermitidos) {
//     let contador = Math.ceil(texto.length / maxCaracteresPermitidos)
//     for(let i = 0; i < contador; i++) {
//       textoCortado = texto.slice(i * maxCaracteresPermitidos, (i + 1) * maxCaracteresPermitidos)
//       traducao += textoCortado
//       const response = await fetch(`https://api.mymemory.translated.net/get?q=${textoCortado}&langpair=${linguagemNativa}|${linguagemTraducao}`)
//       const data = await response.json()
//       traducao += data.responseData.translatedText
//     }
//   } else if (texto.length != 0) {
//     const response = await fetch(`https://api.mymemory.translated.net/get?q=${texto}&langpair=${linguagemNativa}|${linguagemTraducao}`)
//     const data = await response.json()
//     traducao += data.responseData.translatedText
//   }
//   console.log("\n\n"+traducao);
//   return traducao ? traducao : null
// }