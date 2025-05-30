// Função para carregar a tabela a partir do localStorage
function carregarTabela() {
  const dados = JSON.parse(localStorage.getItem('financas')) || [];
  const tbody = document.querySelector('table tbody');
  tbody.innerHTML = ''; // limpa a tabela

  dados.forEach(({ item, valor, dia, status }, index) => {
    const tr = document.createElement('tr');

    // transforma a data em formato brasileiro
    const dataFormatada = new Date(dia).toLocaleDateString('pt-BR');

    tr.innerHTML = `
      <td>${item}</td>
      <td>R$ ${Number(valor).toFixed(2).replace('.', ',')}</td>
      <td>${dataFormatada}</td>
      <td>
        <select data-index="${index}" class="status-select">
          <option value="não pago" ${status.toLowerCase() === 'não pago' ? 'selected' : ''}>Não Pago</option>
          <option value="pago" ${status.toLowerCase() === 'pago' ? 'selected' : ''}>Pago</option>
        </select>
      </td>
      <td><button data-index="${index}" class="remover-btn">Remover</button></td>
    `;

    tbody.appendChild(tr);
    atualizarSaida();
  });

  // Adiciona os eventos de mudança no select para atualizar o status
  document.querySelectorAll('.status-select').forEach(select => {
    select.addEventListener('change', (e) => {
      const idx = e.target.getAttribute('data-index');
      atualizarStatus(idx, e.target.value);
    });
  });

  // Adiciona eventos para remover itens
  document.querySelectorAll('.remover-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const idx = e.target.getAttribute('data-index');
      removerItem(idx);
    });
  });
}

// Função para adicionar um novo item
function adicionarItem() {
  const item = document.getElementById('item').value.trim();
  const valor = parseFloat(document.getElementById('valor').value);
  const dia = document.getElementById('dia').value;
  const status = document.getElementById('state').value;

  if (!item || isNaN(valor) || !dia || !status) {
    alert('Preencha todos os campos corretamente!');
    return;
  }

  const dados = JSON.parse(localStorage.getItem('financas')) || [];

  dados.push({ item, valor, dia, status });

  localStorage.setItem('financas', JSON.stringify(dados));

  carregarTabela();
  atualizarSaida();

  // Limpa os campos
  document.getElementById('item').value = '';
  document.getElementById('valor').value = '';
  document.getElementById('dia').value = '';
  document.getElementById('state').value = 'não pago'; // resetar para padrão
}

// Atualiza o status de um item no localStorage
function atualizarStatus(index, novoStatus) {
  const dados = JSON.parse(localStorage.getItem('financas')) || [];
  if (dados[index]) {
    dados[index].status = novoStatus;
    localStorage.setItem('financas', JSON.stringify(dados));
  }
}

// Remove um item da lista
function removerItem(index) {
  const dados = JSON.parse(localStorage.getItem('financas')) || [];
  dados.splice(index, 1);
  localStorage.setItem('financas', JSON.stringify(dados));
  carregarTabela();
  atualizarSaida();
}

// Evento no botão adicionar
document.getElementById('teste').addEventListener('click', adicionarItem);

// Carrega tabela ao abrir a página
window.onload = () => {
  carregarTabela();
  atualizarSaida();

  const salarioSalvo = localStorage.getItem('salario');
  if (salarioSalvo !== null) {
    document.getElementById('salario').value = salarioSalvo;
    atualizarRestante(); // calcula com base no salário salvo
  }
};

document.getElementById('salario').addEventListener('input', (e) => {
  const valor = parseFloat(e.target.value) || 0;
  localStorage.setItem('salario', valor);
  atualizarRestante();
});


// Valores
function atualizarSaida() {
  const dados = JSON.parse(localStorage.getItem('financas')) || [];
  const totalSaida = dados.reduce((soma, item) => soma + Number(item.valor), 0);
  document.querySelector('.saida').textContent = `R$ ${totalSaida.toFixed(2).replace('.',',')}`;

  atualizarRestante();
}

function atualizarRestante() {
  const salarioInput = document.getElementById('salario');
  const salario = parseFloat(salarioInput.value) || 0;

  const dados = JSON.parse(localStorage.getItem('financas')) || [];
  const totalSaida = dados.reduce((soma, item) => soma + Number(item.valor), 0);

  const restante = salario - totalSaida;

  document.querySelector('.total').textContent = `R$ ${restante.toFixed(2).replace('.', ',')}`;
}


document.getElementById('salario').addEventListener('input', atualizarRestante);