"use client"

import { createUser, deleteUser, getUsers } from "../services/user.service";
import { useEffect, useState } from "react";
import styles from "./page.module.css"
import UserModel from "../models/user.model";

export default function Usuario() {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [user, setUser] = useState<Partial<UserModel>>({
    //lastname: "",
    //name: "",
    //email: "",
    //password: ""
  });

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers();
      setUsers(data);
    }

    fetchUsers();
  }) 

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await createUser(user);
    console.log(response);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user,
      [e.target.placeholder]: e.target.value,
    });
  };

  const deleteSelectedUser = async (ci: string) => {  
    const response = await deleteUser(ci);
    console.log(response);
  }

 /* return (
    <div className={styles.user_page}>
      { <form onSubmit={onSubmit} className={styles.user_form}>
      <input type="text" placeholder="name" value={user.name} onChange={handleChange} />
      <input type="text" placeholder="lastname" value={user.lastname} onChange={handleChange} />
      <input type="email" placeholder="email" value={user.email} onChange={handleChange} />
      <input type="password" placeholder="password" value={user.password} onChange={handleChange} />
      <button className={styles.user_card_delete_button} type="submit">Crear Usuario</button>
    </form>
    <div className={styles.user_container}>
      { users.map((user: any) => (
        <div className={styles.user_card} key={user.ci}>
          <h1 className={styles.user_data}>Usuario: {user.name}</h1>
          <p>Email: {user.email}</p>
          <button className={styles.user_card_delete_button} onClick={() => deleteSelectedUser(user.ci)}>Eliminar</button>
        </div> }
        )) }
      </div>
    </div>
  );*/
}