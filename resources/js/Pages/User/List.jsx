import React from 'react'
import AuthLayout from '../../Layouts/AuthLayout'
import { Head, useForm, usePage } from '@inertiajs/react'
import Badge from '../../components/Badge';
import { Card, CardBody } from '../../components/Card';
import { CustomTable, THead, THeader, TBody, TRow, TData } from '../../components/Table';
import Pagination from '../../components/Pagination';
import SearchInput from '../../components/SearchInput';
import TableTopbar from '../../components/TableTopbar';
import userIcon from '../../../images/user.svg'
import AuthorizeLink from '../../components/AuthorizeLink';
import ConfirmDelete from '../../components/ConfirmDelete';
function List({ users }) {
    console.log(users)

    const { request } = usePage().props;
    const { data, setData, get } = useForm({
        name: request.query?.name || "",
    });

    const handleSearch = () => {
        const timeout = setTimeout(() => {
            get(route('user.index', data), {
                preserveState: true,
                replace: true
            });
        }, 250);
        return () => clearTimeout(timeout);
    };



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

                    <div className="row my-3 gap-1 justify-content-end">
                        <div className="col-sm-12 col-md-5 col-lg-3">
                            <SearchInput
                                value={data.name}
                                onChange={e => setData("name", e.target.value)}
                                onKeyUp={handleSearch}
                            />
                        </div>
                    </div>

                    <div className='table-responsive'>
                        <CustomTable className='table no-wrap'>
                            <THead className="table-light">
                                <TRow>
                                    <THeader>#</THeader>
                                    <THeader>ID</THeader>
                                    <THeader>Name</THeader>
                                    <THeader>Email</THeader>
                                    <THeader>Role</THeader>
                                    <THeader>Status</THeader>
                                    <THeader>Create At</THeader>
                                    <THeader>Action</THeader>
                                </TRow>
                            </THead>
                            <TBody>
                                {users.collection.data.map((user, index) => (
                                    <TRow key={user.id}>
                                        <TData><img src={user.avatar || userIcon} alt="role" className="rounded-circle avatar-sm" /></TData>
                                        <TData>{index + 1}</TData>
                                        <TData>{user.name}</TData>
                                        <TData>{user.email}</TData>
                                        <TData>
                                            <Badge className='rounded-pill bg-success-subtle text-success font-size-12 fw-medium'>
                                                {user.roles[0]?.name || ""}
                                            </Badge>
                                        </TData>
                                        <TData>

                                            <Badge className={`rounded-pill font-size-12 fw-medium ${user.is_active ? ' bg-success-subtle text-success' : ' bg-danger-subtle text-danger'}`}>
                                                {user.is_active ? "Active" : "In Active"}
                                            </Badge>


                                        </TData>

                                        <TData>{user.created_at}</TData>
                                        <TData>
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
                                        </TData>
                                    </TRow>
                                ))}
                            </TBody>
                        </CustomTable>
                        <div className="my-3">
                            <Pagination links={users.collection.meta.links} />
                        </div>
                    </div>
                </CardBody>
            </Card>

        </AuthLayout >
    )
}

export default List