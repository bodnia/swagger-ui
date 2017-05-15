import { fromJS, Map, List } from "immutable"
import { btoa } from "core/utils"

import {
  SHOW_AUTH_POPUP,
  AUTHORIZE,
  AUTHORIZE_OAUTH2,
  LOGOUT,
  LOGOUT_CUSTOM,
  CONFIGURE_AUTH
} from "./actions"

export default {
  [SHOW_AUTH_POPUP]: (state, { payload } ) =>{
    return state.set( "showDefinitions", payload )
  },

  [AUTHORIZE]: (state, { payload } ) =>{
    const CUSTOM_AUTH = "__custom"
    let securities = fromJS(payload)
    let authorized = state.get("authorized", Map())
    let customAuths = authorized.get(CUSTOM_AUTH, List())

    // refactor withMutations
    securities.entrySeq().forEach( ([ key, security ]) => {
      let type = security.getIn(["schema", "type"])
      if ( type === "apiKey" ) {
        if ( key === CUSTOM_AUTH ) {
          customAuths = customAuths.push(security)
        } else {
          authorized = authorized.set(key, security)
        }
      } else if ( type === "basic" ) {
        let username = security.getIn(["value", "username"])
        let password = security.getIn(["value", "password"])
        let val = fromJS({
          value: {
            username,
            header: "Basic " + btoa(username + ":" + password)
          },
          name: key,
          schema: security.get("schema")
        })

        if ( key === CUSTOM_AUTH ) {
          customAuths = customAuths.push(val)
        } else {
          authorized = authorized.set(key, val)
        }
      }
    })

    authorized = authorized.set(CUSTOM_AUTH, customAuths)
    return state.set( "authorized", authorized )
  },

  [AUTHORIZE_OAUTH2]: (state, { payload } ) =>{
    let { auth, token } = payload
    let parsedAuth

    auth.token = token
    parsedAuth = fromJS(auth)

    return state.setIn( [ "authorized", parsedAuth.get("name") ], parsedAuth )
  },

  [LOGOUT]: (state, { payload } ) =>{
    let result = state.get("authorized").withMutations((authorized) => {
        payload.forEach((auth) => {
          authorized.delete(auth)
        })
      })

    return state.set("authorized", result)
  },
  [LOGOUT_CUSTOM]: (state, { payload } ) =>{
    let result = state.getIn(["authorized", "__custom"]).withMutations((authorized) => {
        authorized.delete(payload)
      })

    return state.setIn(["authorized", "__custom"], result)
  },

  [CONFIGURE_AUTH]: (state, { payload } ) =>{
    return state.set("configs", payload)
  }
}
