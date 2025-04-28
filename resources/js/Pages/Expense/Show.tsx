import AuthLayout from '@/Layouts/AuthLayout'
import React from 'react'

type ExpenseType = {
  id: number,
  title: string,
  amount: number,
  expense_date: string,
  description: string,
  created_at: string,
  updated_at: string,
}

interface Props {
  expense: ExpenseType
}

const Show: React.FC<Props> = ({ expense }) => {
  return (
    <AuthLayout>
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Expense Details</h3>
        </div>
        <div className="card-body">
          <table className="w-full text-left border-collapse table table-striped">
            <tbody>
              <tr className="border-b">
                <th className="font-medium py-2 pr-4">Date</th>
                <td className="py-2">{new Date(expense.expense_date).toISOString().split('T')[0]}</td>
              </tr>
              <tr className="border-b">
                <th className="font-medium py-2 pr-4">Title</th>
                <td className="py-2">{expense.title}</td>
              </tr>
              <tr className="border-b">
                <th className="font-medium py-2 pr-4">Amount</th>
                <td className="py-2">{expense.amount}</td>
              </tr>
              <tr className="border-b">
                <th className="font-medium py-2 pr-4">Description</th>
                <td className="py-2">{expense.description}</td>
              </tr>
              <tr className="border-b">
                <th className="font-medium py-2 pr-4">Created At</th>
                <td className="py-2">{new Date(expense.created_at).toISOString().split('T')[0]}</td>
              </tr>
              <tr>
                <th className="font-medium py-2 pr-4">Updated At</th>
                <td className="py-2">{new Date(expense.updated_at).toISOString().split('T')[0]}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AuthLayout>
  )
}

export default Show