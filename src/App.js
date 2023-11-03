import './App.css';
import {Route, Routes} from "react-router-dom";
import TicketListView from "./TicketListView";
import TicketDetails from "./TicketDetailsView";
import Comments from "./Comments";
import TicketDashboardView from "./TicketDashboardView";
import TicketDashboard from "./TicketDashboardView";
import Chat from "./Chat";
import SupportWindow from "./SupportWindow";


function App() {

  return (
    <Routes>
        <Route path="" element={ <TicketListView/>}/>
        <Route path="/tickets/main" element={ <TicketListView/>}/>
        <Route path="/ticket/:ticketId" element={ <TicketDetails/> }/>
        <Route path="/dashboard" element={ <TicketDashboard/>} />
        <Route path="/support" element={ <SupportWindow/>} />
    </Routes>
  );
}

export default App;
