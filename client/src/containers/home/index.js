import React from 'react';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Login from './login';
// import { Button } from 'reactstrap';

class Home extends React.Component {
  render() {
    return (
      <div>
        <h1>Anonymously</h1>
        <Login />
      </div>
    );
  }
}

// const Home = props => (
//   <div>
//     <h1>Anonymously</h1>
//     <p>Count: {props.count}</p>

//     <p>
//       <Button onClick={props.increment} disabled={props.isIncrementing}>
//         Increment
//       </Button>
//       <Button onClick={props.incrementAsync} disabled={props.isIncrementing}>
//         Increment Async
//       </Button>
//     </p>

//     <p>
//       <Button onClick={props.decrement} disabled={props.isDecrementing}>
//         Decrementing
//       </Button>
//       <Button onClick={props.decrementAsync} disabled={props.isDecrementing}>
//         Decrement Async
//       </Button>
//     </p>

//     <p>
//       <Button onClick={() => props.changePage()}>
//         Go to about page via redux
//       </Button>
//     </p>
//   </div>
// );

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changePage: () => push('/about-us'),
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(Home);
