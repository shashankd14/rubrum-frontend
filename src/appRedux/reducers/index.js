import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import Settings from "./Settings";
import Auth from "./Auth";
import Notes from "./Notes";
import Contact from "./Contact";
import Common from "./Common";
import Inward from "./Inward";
import Party from "./Party";
import Material from "./Material";
import Delivery from "./Delivery";
import packetClassification from "./PacketClassification";
import Rates from "./Rates";
import Process from './Process';
import Reports from './Reports';
import Quality from './Quality';

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  settings: Settings,
  auth: Auth,
  notes: Notes,
  contact: Contact,
  common: Common,
  inward: Inward,
  party: Party,
  material: Material,
  deliveries: Delivery,
  packetClassification,
  rates: Rates,
  process: Process,
  reports: Reports,
  quality: Quality

});

export default createRootReducer
