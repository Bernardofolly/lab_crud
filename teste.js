class Livro {
    constructor(id, titulo, autor, anoPublicacao, disponivel = true) {
        this.id = id;
        this.titulo = titulo;
        this.autor = autor;
        this.anoPublicacao = anoPublicacao;
        this.disponivel = disponivel;
    }

    detalhes() {
        return `${this.id} - ${this.titulo} por ${this.autor}, publicado em ${this.anoPublicacao}. Disponível: ${this.disponivel}`;
    }
}

class Biblioteca {
    constructor() {
        this.livros = [];
        this.carregarDados();
    }

    adicionarLivro(livro) {
        this.livros.push(livro);
        this.salvarDados();
    }

    listarLivros() {
        return this.livros;
    }

    atualizarLivro(id, novosDados) {
        const livro = this.livros.find(l => l.id === id);
        if (livro) {
            Object.assign(livro, novosDados);
            this.salvarDados();
        }
    }

    removerLivro(id) {
        this.livros = this.livros.filter(l => l.id !== id);
        this.salvarDados();
    }

    salvarDados() {
        localStorage.setItem('biblioteca', JSON.stringify(this.livros));
    }

    carregarDados() {
        const dados = JSON.parse(localStorage.getItem('biblioteca'));
        if (dados) {
            this.livros = dados.map(l => new Livro(l.id, l.titulo, l.autor, l.anoPublicacao, l.disponivel));
        }
    }
}

const biblioteca = new Biblioteca();

document.getElementById('bookForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = Date.now();
    const titulo = document.getElementById('title').value;
    const autor = document.getElementById('author').value;
    const ano = document.getElementById('year').value;

    const livro = new Livro(id, titulo, autor, ano);
    biblioteca.adicionarLivro(livro);
    atualizarTabela();
    e.target.reset();
});

function atualizarTabela() {
    const tbody = document.querySelector('#bookTable tbody');
    tbody.innerHTML = '';
    biblioteca.listarLivros().forEach(livro => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${livro.id}</td>
            <td>${livro.titulo}</td>
            <td>${livro.autor}</td>
            <td>${livro.anoPublicacao}</td>
            <td>${livro.disponivel ? 'Sim' : 'Não'}</td>
            <td>
                <button class="action" onclick="editarLivro(${livro.id})">Editar</button>
                <button class="action" onclick="excluirLivro(${livro.id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function editarLivro(id) {
    const novosDados = { disponivel: false }; // Exemplo: alterando a disponibilidade
    biblioteca.atualizarLivro(id, novosDados);
    atualizarTabela();
}

function excluirLivro(id) {
    biblioteca.removerLivro(id);
    atualizarTabela();
}

atualizarTabela();
