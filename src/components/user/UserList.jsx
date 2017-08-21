import React from 'react';
import {Table, message, Popconfirm} from 'antd';
import Ajax from '../../util/Ajax';
import SearchBar from './SearchBar';
import CommonUtil from '../../util/CommonUtil';

import UserShowDialog from './UserShowDialog';
import UserAuditDialog from './UserAuditDialog';

const UserList = React.createClass({
    getInitialState() {
        return {
            data: [],
            pagination: {
                current: 1,
                total: 0,
            },
            phone: '',
            state: '',
            loading: true,
            user: {}
        };
    },
    componentWillMount() {
        this.fetch();
    },
    fetch() {
        this.setState({
            loading: true
        });

        Ajax({
            url: '/ice/pc/user/queryList.json',
            param: {
                phone: this.state.phone,
                state: this.state.state,
                pageNum: this.state.pagination.current,
                pageSize: 10
            },
            callback: (result) => {
                if (result.success) {
                    let page = this.state.pagination;
                    page.total = result.total;
                    this.setState({
                        data: result.data.map((item) => {
                            item.key = item.id;
                            return item;
                        }),
                        pagination: page,
                        loading: false
                    });
                } else {
                    message.error(result.errorMsg);
                }
            },
        });
    },

    handleTableChange(pagination, filters, sorter) {
        const pager = this.state.pagination;
        pager.current = pagination.current;
        this.setState({
            pagination: pager,
        }, () => {
            this.fetch();
        });
    },

    handleSearch(search) {
        if (search) {
            const page = this.state.pagination;
            page.current = 1;

            this.setState({
                phone: search.phone,
                state: search.state,
                pagination: page,
            }, this.fetch);
        } else {
            this.fetch();
        }
    },

    show(record) {
        this.setState({
            user: record
        }, () => {
            this.refs.userShowDialog.showModal();
        });
    },

    showAudit(record) {
        this.setState({
            user: record
        }, () => {
            this.refs.userAuditDialog.showModal();
        });
    },

    freeae(record) {
        Ajax({
            url: '/ice/pc/user/freeae.json',
            method: 'post',
            param: {
                id: record.id
            },
            callback: (result) => {
                if (result.success) {
                    message.success('冻结成功');
                    this.fetch();
                } else {

                }
            },
        });
    },

    unFreeae(record) {
        Ajax({
            url: '/ice/pc/user/unFreeae.json',
            method: 'post',
            param: {
                id: record.id
            },
            callback: (result) => {
                if (result.success) {
                    message.success('解冻成功');
                    this.fetch();
                } else {

                }
            },
        });
    },

    render() {
        const columns = [
            {
                title: '序号',
                width: '3%',
                dataIndex: 'id',
            }, {
                title: '手机号',
                width: '5%',
                dataIndex: 'userName',
            }, {
                title: '最后登录时间',
                width: '6%',
                dataIndex: 'lastLoginTime',
                render: (text, record) => (
                    <span>
            {text ? CommonUtil.pareDate(text) : '未登录过'}
          </span>
                ),
            }, {
                title: '店名',
                width: '10%',
                dataIndex: 'shopName',
            }, {
                title: '地址',
                width: '10%',
                dataIndex: 'address',
            }, {
                title: '状态',
                width: '5%',
                dataIndex: 'state',
                render: (text, record) => (
                    (() => {
                        let state;
                        switch (text) {
                            case 'CREATE':
                                state = <span>注册</span>
                                break;
                            case 'AUTHED':
                                state = <span>短信验证通过</span>
                                break;
                            case 'PASSED':
                                state = <span>设置好了密码</span>
                                break;
                            case 'AUDITING':
                                state = <span>提交了店铺信息，待审核</span>
                                break;
                            case 'AUDIT_NO':
                                state = <span>审核不通过</span>
                                break;
                            case 'NORMAL':
                                state = <span>正常</span>
                                break;
                            case 'FREEAE':
                                state = <span>冻结</span>
                                break;
                            default:
                                state = <span>未知</span>
                        }

                        return state;
                    })()
                ),
            }, {
                title: '操作',
                width: '7%',
                render: (text, record) => (
                    (() => {
                        let action = [];
                        switch (record.state) {
                            case 'AUDITING':
                                action.push(<a onClick={this.showAudit.bind(this, record)}>审核</a>);
                                action.push(<span className="ant-divider"/>);
                                action.push(<Popconfirm title="确定要冻结该用户吗?" onConfirm={this.freeae.bind(this, record)}
                                                        okText="是" cancelText="否">
                                    <a>冻结</a>
                                </Popconfirm>);
                                break;
                            case 'AUDIT_NO':
                                action.push(<a onClick={this.show.bind(this, record)}>查看</a>);
                                break;
                            case 'NORMAL':
                                action.push(<a onClick={this.show.bind(this, record)}>查看</a>);
                                action.push(<span className="ant-divider"/>);
                                action.push(<Popconfirm title="确定要冻结该用户吗?" onConfirm={this.freeae.bind(this, record)}
                                                        okText="是" cancelText="否">
                                    <a>冻结</a>
                                </Popconfirm>);
                                break;
                            case 'FREEAE':
                                action.push(<a onClick={this.show.bind(this, record)}>查看</a>);
                                action.push(<span className="ant-divider"/>);
                                action.push(<Popconfirm title="确定要解冻该用户吗?" onConfirm={this.unFreeae.bind(this, record)}
                                                        okText="是" cancelText="否">
                                    <a>解冻</a>
                                </Popconfirm>);
                                break;
                            default:
                        }

                        return <span>
                {action}
              </span>;
                    })()
                ),
            }];

        return (
            <div>
                <Table
                    title={() => <SearchBar callback={this.handleSearch}/>}
                    columns={columns}
                    dataSource={this.state.data}
                    pagination={this.state.pagination}
                    loading={this.state.loading}
                    onChange={this.handleTableChange}
                    bordered/>
                <UserShowDialog ref="userShowDialog" user={this.state.user} callback={this.fetch}/>
                <UserAuditDialog ref="userAuditDialog" user={this.state.user} callback={this.fetch}/>
            </div>
        );
    },
});

export default UserList;
