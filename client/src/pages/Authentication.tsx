import React, { useContext, useEffect, useState } from 'react';

import FormLogin from '@/components/FormLogin';
import FormRegister from '@/components/FormRegister';

const Authentication = () => {
  const [formLogin, setFormLogin] = useState(true);

  return <div>{formLogin ? <FormLogin /> : <FormRegister />}</div>;
};

export default Authentication;
