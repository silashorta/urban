import React, { useState, useEffect } from 'react';
import './App.css';
import logo from '../public/logo.png';
import unidecode from 'unidecode';

import { CiSearch } from "react-icons/ci";
import { FaUser, FaUserFriends } from "react-icons/fa";
import { BiBuildingHouse } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
import { TbHomeMinus } from "react-icons/tb";
import Modal from './Components/Modal';
import { FaRegSquareMinus } from "react-icons/fa6";
import { FaRegPlusSquare } from "react-icons/fa";


function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [moradores, setMoradores] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUnidade, setSelectedUnidade] = useState(null);
  const [newDependente, setNewDependente] = useState({ nome: '', tipo: '' });

  const toggleModal = (index) => {
    setSelectedUnidade(index);
    setIsOpen(!isOpen);
  };

console.log(moradores[selectedUnidade])

const submitAlteracoes = async () => {
  try {
    const moradorId = moradores[selectedUnidade].id;

    // Mapeia os dependentes para incluí-los no objeto moradorAtualizado
    const dependentesAtualizados = moradores[selectedUnidade].Dependentes.map(dependente => ({
      nome: dependente.nome,
      tipo: dependente.tipo
    }));

    console.log(dependentesAtualizados)

    // Cria o objeto moradorAtualizado com os dados atualizados do morador e seus dependentes
    const moradorAtualizado = {
      nome: moradores[selectedUnidade].nome,
      tipo: moradores[selectedUnidade].tipo,
      bloco: moradores[selectedUnidade].bloco,
      apartamento: moradores[selectedUnidade].apartamento,
      Dependentes: dependentesAtualizados // Inclui os dependentes atualizados no objeto
    };

    console.log(moradorAtualizado)

    
    const response = await fetch(`http://silashortadev.com.br/morador/${moradorId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(moradorAtualizado), // Envia os dados atualizados do morador, incluindo os dependentes
    });
    
    const data = await response.json();
    console.log('Dados atualizados:', data);
    setIsOpen(false); // Fecha o modal após o envio bem-sucedido
  } catch (error) {
    console.error('Erro ao enviar dados:', error);
  }
};


  const handleInputChange = (e, field) => {
    const value = e.target.value;
    const updatedMoradores = [...moradores];
    updatedMoradores[selectedUnidade][field] = value;
    setMoradores(updatedMoradores);
  };

  // Função para adicionar um novo dependente
  const addDependente = () => {
    const updatedMoradores = [...moradores];
    updatedMoradores[selectedUnidade].Dependentes.push(newDependente);
    setMoradores(updatedMoradores);
    // Limpa os campos de entrada do novo dependente após adicioná-lo
    setNewDependente({ nome: '', tipo: '' });
  };

  // Função para remover um dependente
  const removeDependente = (dependenteIndex) => {
    const updatedMoradores = [...moradores];
    updatedMoradores[selectedUnidade].Dependentes.splice(dependenteIndex, 1);
    setMoradores(updatedMoradores);
  };

  // Função para lidar com a alteração dos dados dos dependentes
  const handleDependenteChange = (e, dependenteIndex, field) => {
    const { value } = e.target;
    const updatedMoradores = [...moradores];
    updatedMoradores[selectedUnidade].Dependentes[dependenteIndex][field] = value;
    setMoradores(updatedMoradores);
  };



  useEffect(() => {
    fetch('http://silashortadev.com.br/morador')
      .then(response => response.json())
      .then(data => {
        setMoradores(data);
      })
      .catch(error => console.error('Erro ao buscar moradores:', error));
  }, []);

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
  };

// Função para remover acentos e pontuação de uma string
function normalizeString(str) {
  return unidecode(str).toLowerCase().replace(/[^\w\s]/g, '');
}

const filteredData = moradores.filter(item => {
  // Se o termo de pesquisa estiver vazio, mostrar toda a lista
  if (!searchTerm) return true;

  // Normalizar o termo de pesquisa
  const normalizedSearchTerm = normalizeString(searchTerm);

  // Verificar se o nome, o número do apartamento ou o nome dos dependentes contêm o termo de pesquisa
  return normalizeString(item.nome).includes(normalizedSearchTerm) ||
    (item.apartamento && item.apartamento.toString().includes(searchTerm)) ||
    (item.Dependentes && item.Dependentes.length > 0 && item.Dependentes.some(dependente => normalizeString(dependente.nome).includes(normalizedSearchTerm)));
});

  

  return (
    <div>
      <section className='flex flex-wrap justify-center items-center'>
        <img src={logo} alt="" />
        <h2 className='text-4xl font-bebas-neue text-gray-800'>Cadastro de Moradores</h2>
      </section>
      <section className='flex flex-col gap-4 md:p-16 lg:px-48 bg-gray-200 font-montserrat'>
        <div className='flex'>
          <input type="search" name="" id="" placeholder='Digite o nome, apt...'
            className='w-full my-4 ml-2 p-2 rounded-lg placeholder:text-gray-800 bg-white'
            value={searchTerm}
            onChange={handleSearch} />
          <div className='flex items-center justify-center mr-2 ml-1 text-gray-600 text-2xl'
            onClick={handleSearch}>
            <CiSearch />
          </div>
        </div>
        {filteredData.length === 0 ? (
          <div className="min-h-screen text-gray-600 text-xl text-center">Nenhum registro encontrado.</div>
        ) : (
          filteredData.map((item, index) => (
            <div key={index} className='flex flex-col gap-2 m-2 p-4 lg:p-8 bg-gray-50 rounded-lg'>
              <div className='flex gap-6'>
                <div className='flex gap-1'>
                  <div className='flex items-center text-2xl text-gray-900'>
                    <BiBuildingHouse />
                  </div>
                  <div className='font-semibold'>Bloco: </div>
                  <div className='font-bold'>{item.bloco}</div>
                </div>
                <div className='flex gap-1'>
                  <div className='font-semibold'>Apartamento:</div>
                  <div className='font-bold'>{item.apartamento}</div>
                </div>
              </div>
              <hr className='my-2' />
              <div className='flex flex-col gap-1 items-start'>
                <div className='flex gap-2 items-center text-gray-900'>
                  <FaUser />
                  <div className='font-semibold text-gray-900'>{item.tipo}</div>
                </div>
                <div>
                  <div className='font-bold uppercase'>{item.nome}</div>
                </div>
              </div>
              <div>
              </div>
              <hr className='my-2' />
              {item.Dependentes && item.Dependentes.length > 0 ? (
                <div>
                  <div className='flex flex-col gap-2'>
                    <div className='flex gap-2 items-center text-gray-900'>
                      <FaUserFriends className='text-xl' />
                      <div className='uppercase font-semibold'>Dependentes</div>
                    </div>
                    <div className='flex flex-col'>
                      {item.Dependentes.map((dependente, dependenteIndex) => (
                        <div key={dependenteIndex}>
                          <div className='uppercase'>
                            <span className='text-gray-800'>{dependente.nome}</span> - <span className='text-gray-500'>{dependente.tipo}</span>
                          </div>
                        </div>
                      ))}
                      <hr className='my-2' />
                    </div>
                  </div>
                </div>
              ) : null}
              <div className='flex gap-4'>
                <button onClick={() => toggleModal(index)}>
                  <FaEdit className='text-2xl cursor-pointer text-gray-800 hover:text-amber-600 duration-300 hover:scale-110' />
                </button>
                <TbHomeMinus className='text-2xl  font-bold cursor-pointer text-gray-800 hover:text-red-600 duration-300 hover:scale-110' />
              </div>
            </div>
          ))
        )}
        {isOpen && selectedUnidade !== null && (
          <Modal isOpen={isOpen} onClose={toggleModal}>
            <div className="sm:flex sm:items-start">
              <div className="mt-3  sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Editar Unidade {filteredData[selectedUnidade].apartamento} - Bloco {filteredData[selectedUnidade].bloco}</h3>
                <div className="mt-2">
                  <div className="flex flex-col gap-1 text-sm text-gray-500">
                    <div>
                      <input type='text'
                        value={filteredData[selectedUnidade].nome}
                        onChange={(e) => handleInputChange(e, 'nome')}
                        placeholder='Nome'
                        className='w-full border p-1 text-gray-800 rounded' />
                    </div>
                    <div>
                      <input type='text'
                        value={filteredData[selectedUnidade].tipo}
                        onChange={(e) => handleInputChange(e, 'tipo')}
                        placeholder='Tipo'
                        className='w-full border p-1 text-gray-800 rounded' />
                    </div>
                    {/* Adicione outras informações conforme necessário */}
                  </div>
                  {filteredData[selectedUnidade].Dependentes.map((dependente, dependenteIndex) => (
                    <div key={dependenteIndex} className="mt-2">
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <div className="flex flex-col gap-1 bg-slate-50 p-2 rounded">
                          <div className="flex items-center gap-2">
                            <div className="text-black">Nome:</div>
                            <input
                              type="text"
                              className="p-1 border rounded bg-slate-50 uppercase"
                              value={dependente.nome}
                              onChange={(e) => handleDependenteChange(e, dependenteIndex, 'nome')}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-black">Tipo:</div>
                            <input
                              type="text"
                              className="p-1 border rounded bg-slate-50 uppercase"
                              value={dependente.tipo}
                              onChange={(e) => handleDependenteChange(e, dependenteIndex, 'tipo')}
                            />
                          </div>
                        </div>
                        <div
                          className="text-red-500 hover:text-red-700 text-xl hover:scale-110 hover:cursor-pointer duration-200"
                          onClick={() => removeDependente(dependenteIndex)}
                        >
                          <FaRegSquareMinus />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div>
                    <FaRegPlusSquare
                      className="text-slate-800 hover:text-black text-2xl hover:cursor-pointer hover:scale-110 duration-200 my-4"
                      onClick={addDependente}
                    />
                  </div>
                </div>
              </div>
            </div>
            <button type='submit' onClick={submitAlteracoes}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm my-4 px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm">
              Salvar Alterações
            </button>
          </Modal>
        )}
      </section>
    </div>
  );
}

export default App;
