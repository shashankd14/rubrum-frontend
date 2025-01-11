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
import PacketClassification from "./PacketClassification";
import Rates from "./Rates";
import Process from './Process';
import Reports from './Reports';
import Quality from './Quality';
import Packing from './Packing';
import LabelPrint from './LabelPrint';
import YielsLossRatio from './YielsLossRatio';
 
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
  packetClassification: PacketClassification,
  rates: Rates,
  process: Process,
  reports: Reports,
  quality: Quality,
  packing: Packing,
  labelPrint: LabelPrint,
  yieldLossRatio: YielsLossRatio
});

export default createRootReducer
