// https://tailwindcomponents.com/component/hoverable-table
import { getOrdersByUser, getPaginatedOrders, getUsers } from '@/actions';
import { Title } from '@/components';
import clsx from 'clsx';

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { IoCardOutline } from 'react-icons/io5';
import { UsersTable } from './ui/UsersTable';

export default async function AdminUsersPage() {

  const { ok, users } = await getUsers();
  if(!ok){
    redirect('/auth/login');
  } 

  return (
    <>
      <Title title="Usuarios" subTitle='' className='' />

      <div className="mb-10">
        <UsersTable users={users!} /> 
      </div>
    </>
  );
}