import React from 'react';

import {Modal} from 'antd';

const NoAccessModel = React.createClass({
    getInitialState() {
        return {
            visible: false,
        };
    },
    componentWillMount() {
    },

    componentWillReceiveProps(nextProps) {
        //console.log(nextProps.com);
    },

    showModal() {
        this.setState({
            visible: true
        });
    },

    handleCancel() {
        this.setState({
            visible: false
        });
    },

    render() {
        return (
            <div>
                <Modal title="审核备注" visible={this.state.visible}
                       footer={null}
                       onCancel={this.handleCancel}
                >

                </Modal>
            </div>
        );
    },
});

export default NoAccessModel;
