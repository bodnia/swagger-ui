import React, { PropTypes } from "react"

export default class CustomAuth extends React.Component {

  static propTypes = {
    number: PropTypes.number.isRequired,
    auth: PropTypes.object.isRequired,
    getComponent: PropTypes.func.isRequired,
    authActions: PropTypes.object.isRequired
  }

  logoutClick=() => {
    let { authActions, number } = this.props

    authActions.logoutCustom(number)
  }
  render() {
    let { auth, getComponent } = this.props
    let schema = auth.schema || auth.get("schema")
    let value = auth.value || auth.get("value")
    let type = schema.get("type")

    const Row = getComponent("Row")
    const Button = getComponent("Button")

    return (<div>
      { type !== "apiKey" ? null
          :(<Row>
          <h4>Custom Api key authorization</h4>
          <Row>
            <p>Name: <code>{ schema.get("name") }</code></p>
          </Row>
          <Row>
            <p>In: <code>{ schema.get("in") }</code></p>
          </Row>
          <Row>
            <p>Value: <code> ****** </code></p>
          </Row>
        </Row>)
      }
      {
        type !== "basic" ? null
          : <Row>
            <h4>Custom basic authorization</h4>
            <Row>
              <p>Username: <code>{ value.get("username") }</code></p>
            </Row>
            <Row>
              <p>Password: <code> ****** </code></p>
            </Row>
          </Row>
      }
      <div className="auth-btn-wrapper">
        <Button className="btn modal-btn auth" onClick={ this.logoutClick }>Logout and remove</Button>
      </div>
      </div>)
  }
}
