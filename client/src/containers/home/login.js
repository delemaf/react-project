import React from 'react';
import { connect } from 'react-redux';
import { LOGIN, SET_PARAMS, LOGIN_CLEAR } from '../../reducers/actions';
import request from '../../request';

const mapStateToProps = state => ({ ...state.login });

const mapDispatchToProps = dispatch => ({
  onChangeEmail: value => dispatch({ type: SET_PARAMS, key: 'email', value }),
  onChangePassword: value =>
    dispatch({ type: SET_PARAMS, key: 'password', value }),
  onSubmit: (email, password) =>
    dispatch({ type: LOGIN, payload: request.Auth.login(email, password) }),
  onUnload: () => dispatch({ type: LOGIN_CLEAR }),
});

// import Request from 'request';

class Login extends React.Component {
  constructor() {
    super();
    this.changeEmail = ev => this.props.onChangeEmail(ev.target.value);
    this.changePassword = ev => this.props.onChangePassword(ev.target.value);
    this.submitForm = (email, password) => (ev) => {
      ev.preventDefault();
      this.props.onSubmit(email, password);
    };
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  render() {
    const { email } = this.props;
    const { password } = this.props;
    return (
      <form onSubmit={this.submitForm(email, password)}>
        <div className="form-group">
          <label htmlFor="exampleInputEmail1">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            placeholder="Email"
            onChange={this.changeEmail}
          />
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            onChange={this.changePassword}
          />
          <small id="emailHelp" className="form-text text-muted">
            Tqt pas frair, file ton mdp, tout va bien se passer.
          </small>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
