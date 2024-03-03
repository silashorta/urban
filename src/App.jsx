import React, { useState, useEffect } from 'react';
import './App.css';
import logo from '../public/logo.png';

import { CiSearch } from "react-icons/ci";
import { FaUser, FaUserFriends } from "react-icons/fa";
import { BiBuildingHouse } from "react-icons/bi";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [moradores, setMoradores] = useState([]);

  useEffect(() => {
    fetch('https://silashortadev.com.br:21098/morador')
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
    
    const filteredData = moradores.filter(item => {
      // Se o termo de pesquisa estiver vazio, mostrar toda a lista
      if (!searchTerm) return true;
      
      // Verificar se o nome, o número do apartamento ou o nome dos dependentes contêm o termo de pesquisa

    return item.nome.toLowerCase().includes(searchTerm) ||
      (item.apartamento && item.apartamento.toString().includes(searchTerm)) ||
      (item.dependentes && item.dependentes.length > 0 && item.dependentes.some(dependente => dependente.nome.toLowerCase().includes(searchTerm)));
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
        {filteredData && filteredData.length === 0 ? (
          <div className="min-h-screen text-gray-600 text-xl text-center">Nenhum registro encontrado.</div>
        ) : (
          filteredData && filteredData.map((item, index) => (
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
                <FaEdit className='text-2xl cursor-pointer text-gray-800 hover:text-amber-600 duration-300 hover:scale-110' />
                <MdDelete className='text-2xl cursor-pointer text-gray-800 hover:text-red-600 duration-300 hover:scale-110' />
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default App;
