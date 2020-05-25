import React, { Component } from 'react';
import { connect } from 'react-redux';

import './Home.css';
import Spinner from '../../components/UI/Spinner/Spinner';

class Home extends Component {

    render() {
        let homeContent = <React.Fragment>
            <h2>About</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nunc risus, sollicitudin quis pharetra sit amet, ornare aliquet nulla. Etiam in elit quis augue tempor varius sed vel nisi.</p>
            <h2>Instructions</h2>
            <p>Suspendisse auctor ante a elementum ullamcorper. Sed hendrerit dictum cursus. Vivamus fringilla venenatis dui imperdiet venenatis. Duis sit amet augue nisl. Nulla facilisi. Nunc suscipit ac massa nec aliquet.</p>
            <p>Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aliquam leo est, suscipit vitae pellentesque sed, rutrum vel enim. Etiam vitae condimentum lorem. Maecenas finibus sem at hendrerit lacinia.</p>
            <h2>LOGO</h2>
        </React.Fragment>

        if (this.props.loading) homeContent = <Spinner />

        return (
            <div className="Home">
                {homeContent}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading
    };
};

export default connect(mapStateToProps)(Home);
