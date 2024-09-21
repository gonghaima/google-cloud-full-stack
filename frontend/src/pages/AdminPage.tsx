import React from 'react';
import { USER } from '../types';

interface AdminPageProps {
  authUser: USER | null;
}

function AdminPage({ authUser }: AdminPageProps) {
  console.log('authUser: ', authUser);
  return <div className="content-container">AdminPage</div>;
}

export default AdminPage;
