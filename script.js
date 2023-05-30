const main = document.querySelector('main');
const buscaPalavra = document.getElementById('buscar');
const footer = document.querySelector('footer');
const container = document.querySelector('.container');
const palavraNaoEncontrada = document.querySelector('.palavraNaoEncontrada');

buscaPalavra.addEventListener('change', carregarDicionario);

async function renderizarSignificado(significados, div) {
  for (const { partOfSpeech, definitions } of significados) {
    const significado = document.createElement('div');
    significado.classList.add('significado');
    significado.innerHTML = `
      <div class="caixa">
        <h2>${await loadTranslation(partOfSpeech) ?? partOfSpeech}</h2>
        <div class="line"></div>
      </div>
    `;
    const exemplos = document.createElement('div');
    const ul = document.createElement('ul');
    exemplos.classList.add('exemplos');
    exemplos.innerHTML = `<h3>Significados</h3>`;
    for (const { definition } of definitions) {
      ul.innerHTML += `<li>${await loadTranslation(definition) ?? definition}</li>`;
    }
    exemplos.append(ul);
    significado.append(exemplos);
    div.append(significado);
  }
}


async function renderizarMain(palavra, fonetica, significados) {
  main.classList.add('content');
  main.innerHTML = `
    <div class="fonetica">
      <h1 class="result">${await loadTranslation(palavra) ?? palavra}</h1>
      <span>${await loadTranslation(fonetica) ?? fonetica}</span>
    </div>
  `;
  const classesDePalavras = document.createElement('div');
  classesDePalavras.classList.add('classesDePalavras');
  await renderizarSignificado(significados, classesDePalavras);
  main.append(classesDePalavras);
  main.innerHTML += `<div class="line"></div>`;
}

function renderizarFooter(linkDicionario) {
  footer.classList.add('content');
  footer.innerHTML = `
    <footer class="content">
      <a href="${linkDicionario}">${linkDicionario}</a>
    </footer>
  `;
}

async function carregarDicionario({ target }) {
  const word = target.value;
  target.value = '';
  const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
  let data = null
  try {
    const response = await fetch(`${url}${word}`);
    if (!response.ok) throw new Error("Erro no fetch")
    const json = await response.json();
    data = json[0];
  } catch (erro) {
    console.log(erro.message);
  }
  if (data) {
    const linkDicionario = data.sourceUrls[0];
    const fonetica = data.phonetic;
    const palavra = data.word;
    const significados = data.meanings.map(({ partOfSpeech, definitions }) => ({
      partOfSpeech,
      definitions,
    }));
    await renderizarMain(palavra, fonetica, significados);
    renderizarFooter(linkDicionario);

    palavraNaoEncontrada.innerHTML = '';
  } else {
    main.innerHTML = '';
    footer.innerHTML = '';
    palavraNaoEncontrada.innerHTML = `
      <span>😕</span>
      <div>Palavra Não Encontrada</div>
    `;
  }
}

async function carregarCor() {
  const url = 'https://www.thecolorapi.com/random';
  const response = await fetch(url);
  const json = await response.json();
  const { hex } = json;
  const color = hex.value;
  document.documentElement.style.setProperty('--primary-color', color);
}

window.addEventListener('load', carregarCor);

// Não foi implementado.

async function loadTranslation(texto) {
  // const response = await fetch(`https://api.mymemory.translated.net/get?q=${texto}&langpair=en-US|pt-BR`)
  // const data = await response.json();
  // return data.responseData.translatedText;
}
