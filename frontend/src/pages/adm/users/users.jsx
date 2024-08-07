import './users.css'
import Sidebar from '../../../components/Drawer'
import Button from '@mui/material/Button';

import { getUsers, deleteUser } from '../../../services/APIservice'
import { useEffect, useState } from 'react'
import React from 'react'
import { getUsersByCpf } from '../../../services/APIservice'
const users = () => {

  let cpf = localStorage.getItem('cpf')


  const [search, setSearch] = useState([])
  const [users, setUsers] = useState([])

  function getButton() {
    getUsers({ nome: search, email: search, cpf: search }).then(data => {
      setUsers(data);
    }).catch(err => console.log("deu erro :(", err))
  }

  function verificar123 () {
    if (cpf == null || cpf == undefined) {
      window.location.href = '/login'
    }
    getUsersByCpf(cpf).then(data => {
      if (data.papel == 'user'){
        window.location.href = "/Usuarios/LivrosUsers"
        return;
      } if (data.papel == 'adm') {
        return
      }
    })
  }

  useEffect(() => {
    verificar123()
    getButton()
  }, [])


  async function deletar(id) {
    console.log(id)
    await deleteUser(id)
    getButton()
  }

  function redirecionarUpdate(cpf) {
    window.location.href = `/Adm/Atualizar/${cpf}`
  }

  const formatDate = (date) => {
    const formattedDate = new Date(date);
    const day = formattedDate.getDate().toString().padStart(2, '0');
    const month = (formattedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = formattedDate.getFullYear().toString();
    return `${day}/${month}/${year}`;
  }

  function sair() {
    localStorage.clear();
    window.location.href = "/Login"
}

  return (
    <>
      <div className="header">
        <Sidebar />
        <div className="text">
                USUARIOS
            </div>
            <button className='button1 delete' onClick={sair} >sair</button>

      </div>
      <div className="users">
        <div className="top">
          <input type="text" className="input" onChange={(e) => { setSearch(e.target.value) }} />
          <Button variant="contained" color="success" onClick={getButton} className='sucess' >Pesquisar</Button>
          
        </div>

        <div className="cardWrap">
          {users.map((user) => (
            <div className='card' key={user.cpf}>
              <div className="nome">
                {user.nome}
              </div>
              <div className="cpf">
                {user.cpf}
              </div>
              <div className="email">
                {user.email}
              </div>
              <div className="telefone">
                {user.telefone}
              </div>
              <div className="papel">
                {user.papel}
              </div>

              <div className="criado">
                {formatDate(user.createdAt)}
              </div>
              <div className="button">
              <button value={user.cpf} id='delete' className='button1 delete' onClick={() => deletar(user.cpf)}> Deletar </button>
              <button value={user.cpf} id='edit' className='button1 edit' onClick={() => redirecionarUpdate(user.cpf)}> Editar </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>

  )
}

export default users