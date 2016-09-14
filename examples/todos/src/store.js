import Relax from 'relax';
import { createStore } from 'redux'

const store = createStore((x = {}) => x);

export default Relax(store, {});
