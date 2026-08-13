import { Routes, Route } from 'react-router-dom';

import InvoicesList from '../pages/InvoicesList';
import UploadInvoice from '../pages/UploadInvoice';
import InvoiceDetail from '../pages/InvoiceDetail';

/* ------------------ Code ------------------ */

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<InvoicesList />} />
      <Route path="/upload" element={<UploadInvoice />} />
      <Route path="/:id" element={<InvoiceDetail />} />
    </Routes>
  );
};

export default Routing;
