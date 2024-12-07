import { useEffect, useState } from 'react';
import './App.css';
import Formulario from './Formulario';
import Tabela from './Tabela';

function App() {


  //Objeto produto
  const produto = {
    id: 0,
    nome: '',
    marca: ''
  }


  // UseState
  const [btnCadastrar, setBtnCadastrar] = useState(true);
  const [produtos, setProdutos] = useState([]);
  const [objProduto, setObjProduto] = useState(produto);

  // UseEffect
  useEffect(() => {
    fetch("http://localhost:8080/listar")
      .then(retorno => retorno.json())
      .then(retorno_convertido => setProdutos(retorno_convertido));
  }, []);

  //Obter dados do formulario
  const aoDigitar = (e) => {
    setObjProduto({ ...objProduto, [e.target.name]: e.target.value })
  }

  //Cadastrar produto
  const cadastrar = () => {
    fetch('http://localhost:8080/cadastrar', {
      method: 'post',
      body: JSON.stringify(objProduto),
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(retorno => retorno.json())
      .then(retorno_convertido => {
        if (retorno_convertido.mensagem !== undefined) {
          alert(retorno_convertido.mensagem);
        } else {
          setProdutos([...produtos, retorno_convertido]);
          alert('Produto cadastrado com sucesso!');
          limparFormulario();
        }
      })
  }


  //Alterar produto
  const alterar = () => {
    fetch('http://localhost:8080/alterar', {
      method: 'put',
      body: JSON.stringify(objProduto),
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(retorno => retorno.json())
      .then(retorno_convertido => {
        if (retorno_convertido.mensagem !== undefined) {
          alert(retorno_convertido.mensagem);
        } else {

          //Mensagem
          alert('Produto cadastrado com sucesso!');

          //Copia do vetor de produtos
          let vetorTempo = [...produtos];

          //Pegar a posição no vetor
          let indice = vetorTempo.findIndex((p) => {
            return p.id === objProduto.id;
          });

          //Alterar o produto do vetor temporario
          vetorTempo[indice] = objProduto;

          //Atualizando vetor
          setProdutos(vetorTempo);

          //Limpar formulário
          limparFormulario();
        }
      })
  }

  //Remover produto
  const remover = () => {
    fetch('http://localhost:8080/remover/' + objProduto.id, {
      method: 'delete',
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json'
      }
    })
      .then(retorno => retorno.json())
      .then(retorno_convertido => {

        //Aviso de exclusão
        alert(retorno_convertido.mensagem);

        //Copia do vetor de produtos
        let vetorTempo = [...produtos];

        //Pegar a posição no vetor
        let indice = vetorTempo.findIndex((p) => {
          return p.id === objProduto.id;
        });

        //Remover o produto do vetor temporario
        vetorTempo.splice(indice, 1);

        //Atualizando vetor
        setProdutos(vetorTempo);

        //Limpar formulario
        limparFormulario();
      })
  }


  //Limpar formulário
  const limparFormulario = () => {
    setObjProduto(produto);
    setBtnCadastrar(true);
  }

  //Selecionar produto
  const selecionarProduto = (indice) => {
    setObjProduto(produtos[indice]);
    setBtnCadastrar(false);
  }

  // Retorno
  return (
    <div>
      <Formulario botao={btnCadastrar} eventoTeclado={aoDigitar} cadastrar={cadastrar} obj={objProduto} cancelar={limparFormulario} remover={remover} alterar={alterar}/>
      <Tabela vetor={produtos} selecionar={selecionarProduto} />
    </div>
  );
}

export default App;
