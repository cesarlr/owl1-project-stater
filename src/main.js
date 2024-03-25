import { App } from "./App";
import { utils, mount, config as owlConfig, router, QWeb, Store } from "@odoo/owl";
import { LogIn, Register, Home, Settings, Editor, Profile } from "./pages";

export const ROUTES = [
  { name: "HOME", path: "/", component: Home },
  { name: "LOG_IN", path: "/login", component: LogIn },
  { name: "REGISTER", path: "/register", component: Register },
  { name: "SETTINGS", path: "/settings", component: Settings },
  { name: "EDITOR", path: "/editor", component: Editor },
  { name: "PROFILE", path: "/profile", component: Profile },
];

const actions = {
  logout({ state }) {
    state.user = {};
  },
  login({ state }, user) {
    state.user = user;
		console.log("The user is "+JSON.stringify(user));
  },
};

const initialState = {
  user: {},
};

const getters = {
  userLoggedIn({ state }) {
    if (state.user && state.user.token) {
      return true;
    }
    return false;
  },
  getUser({ state }) {
    return state.user;
  },
};

async function setup() {
  if (process.env.OWL_ENV === "dev") {
    owlConfig.mode = "dev";
  }
  let store = makeStore();
  App.env = await makeEnvironment(store);
  mount(App, { target: document.body });
}

async function makeEnvironment(store) {
  const env = { qweb: new QWeb(), store: store };
  env.router = new router.Router(env, ROUTES, { mode: "hash" });
  await env.router.start();
  return env;
}

function makeStore() {
  const store = new Store({ initialState, actions, getters});
  return store;
}
utils.whenReady(setup);
