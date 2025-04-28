import AuthorizeLink from '@/components/AuthorizeLink';
import ConfirmDelete from '@/components/ConfirmDelete';
import TableFactory from '@/Factory/Table/TableFactory';
import AuthLayout from '@/Layouts/AuthLayout'
import { PageProp } from '@/types/global';
import { TLinksType } from '@/types/links.type';
import { TSystemPagePropType } from '@/types/type';
import { Head, Link, usePage } from '@inertiajs/react'
import React, { useMemo } from 'react'

type ExpenseType = {
  id: number,
  title: string,
  amount: number,
  date: string,
  created_at: string,
  updated_at: string,
}
interface Props {
  expenses: {
    data: Array<ExpenseType>
    links: Array<TLinksType>
  };
  queryParam: unknown;
}

interface IPagePropsType extends PageProp{
  system : TSystemPagePropType
}

const Index: React.FC<Props> = ({ expenses,queryParam }) => {

  const { system } = usePage<IPagePropsType>().props; // Adjust the type as needed
  queryParam = queryParam || {};

  const columns = useMemo(
    () => [
      { header: "Date", accessor: "date" },
      { header: "Title", accessor: "title" },
      { header: `Amount (${system.currency.symbol})`, accessor: "amount" },
      {
        header: "Action",
        accessor: null,
        render: (expense: ExpenseType) => (
          <div className="d-flex flex-no-wrap gap-2">
            <AuthorizeLink
              className="btn btn-sm btn-soft-success"
              ability="expense.index"
              href={route("expense.show", expense.id)}
            >
              <i className="bx bxs-show font-size-16 align-middle"></i>
            </AuthorizeLink>
            <AuthorizeLink
              className="btn btn-sm btn-soft-primary"
              ability="expense.edit"
              href={route("expense.edit", expense.id)}
            >
              <i className="bx bxs-edit font-size-16 align-middle"></i>
            </AuthorizeLink>
            <ConfirmDelete
              ability="expense.delete"
              url={route("expense.destroy", expense.id)}
              btnClass="btn btn-sm btn-soft-danger"
              btnLabel={
                <i className="bx bxs-trash font-size-16 align-middle"></i>
              }
            />
          </div>
        ),
      },
    ],
    [system]
  );

  return (
    <AuthLayout>
      <Head title='Expense | List - ' />

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Expense List</h3>
        </div>
        <div className="card-body">

          <TableFactory
            columns={columns}
            dataSource={expenses}
            url={route("expense.index")}
            queryParam={queryParam}
          />

        </div>
      </div>
    </AuthLayout>
  )
}

export default Index