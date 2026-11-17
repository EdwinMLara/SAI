import { Routes, Route } from 'react-router-dom';

import SalesNotesList from '../pages/SalesNotesList';
import CreateSalesNote from '../pages/CreateSalesNote';
import SalesNoteDetail from '../pages/SalesNoteDetail';
import UpdateFiscalStamp from '../pages/UpdateFiscalStamp';

const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<SalesNotesList />} />
      <Route path="/new" element={<CreateSalesNote />} />
      <Route path="/:reference/fiscal" element={<UpdateFiscalStamp />} />
      <Route path="/:reference" element={<SalesNoteDetail />} />
    </Routes>
  );
};

export default Routing;
