import React from 'react'
import AuthLayout from '../../Layouts/AuthLayout'
import { Head} from '@inertiajs/react'
import Badge from '../../components/Badge';
import { Card, CardBody } from '../../components/Card';

import TableTopbar from '../../components/TableTopbar';
import userIcon from '../../../images/user.svg'
import AuthorizeLink from '../../components/AuthorizeLink';
import ConfirmDelete from '../../components/ConfirmDelete';

import { DataTableProvider } from '../../Factory/DataTable/DataTableContext';
import FilterComponent from '../../Factory/DataTable/FilterComponent';
import TableComponent from '../../Factory/DataTable/TableComponent';
import PaginationComponent from '../../Factory/DataTable/PaginationComponent';

function List({ users }) {

    const columns = [
        { header: '#', accessor: '', render: (user) => <img src={user.avatar || userIcon} className="avatar-sm h-auto d-block rounded" alt="Product" /> },
        { header: 'Name', accessor: 'name' },
        { header: 'Email', accessor: 'email' },
        { header: 'Role', accessor: '', render: (user) => <Badge className='rounded-pill bg-success-subtle text-success font-size-12 fw-medium'>{user.roles[0]?.name || ""}</Badge> },
        {
            header: 'Status', accessor: 'is_active', render: (user) => (
                <Badge className={`rounded-pill font-size-12 fw-medium ${user.is_active ? ' bg-success-subtle text-success' : ' bg-danger-subtle text-danger'}`}>
                    {user.is_active ? "Active" : "Inactive"}
                </Badge>
            )
        },
        { header: 'Create Ay', accessor: 'created_at' },

        {
            header: 'Action', accessor: null, render: (user) => (
                <div className="d-flex flex-no-wrap gap-2">
                    <AuthorizeLink
                        className="btn btn-sm btn-soft-success"
                        ability='user.index'
                        href={route('user.show', user.id)}
                    >
                        <i className="bx bxs-show font-size-16 align-middle"></i>
                    </AuthorizeLink>

                    <AuthorizeLink
                        className="btn btn-sm btn-soft-primary"
                        ability='user.edit'
                        href={route('user.edit', user.id)}
                    >
                        <i className="bx bxs-edit font-size-16 align-middle"></i>
                    </AuthorizeLink>

                    <ConfirmDelete
                        ability='user.delete'
                        url={route('user.destroy', user.id)}
                        btnClass='btn btn-sm btn-soft-danger'
                        btnLabel={<i className="bx bxs-trash font-size-16 align-middle"></i>}
                    />
                </div>
            )
        }
    ];
    // Define searchable columns
    const searchableColumns = [ 'name', 'email'];

    return (
        <AuthLayout>
            <Head title='User List - ' />
            <Card>
                <CardBody>
                    <TableTopbar
                        title="User List"
                        subTitle='View and Manage Users'
                        count={users.count}
                        url={route('user.create')}
                        ability={"user.create"}
                    />

                    <DataTableProvider dataSource={users.collection.data} searchableColumns={searchableColumns}>
                        <FilterComponent />
                        <div className='table-responsive'>
                            <TableComponent columns={columns} />
                        </div>
                        <PaginationComponent />
                    </DataTableProvider>

                </CardBody>
            </Card>
        </AuthLayout >
    )
}

export default List