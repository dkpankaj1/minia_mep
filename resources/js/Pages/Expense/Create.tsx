import FormInput from '@/components/FormInput'
import InputLabel from '@/components/InputLabel'
import InvalidFeedback from '@/components/InvalidFeedback'
import AuthLayout from '@/Layouts/AuthLayout'
import { Head, useForm } from '@inertiajs/react'
import React from 'react'

const Create = () => {


  const { data, setData, post, errors, processing } = useForm({
    expense_date: '',
    amount: '',
    title: '',
    description: ''
  })

  return (
    <AuthLayout>
      <Head title='Expense | Create' />

      <div className="card">

        <div className="card-header">
          <h3 className="card-title">Create Expense</h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="mb-4">
                <InputLabel label={"Date"} />
                <FormInput
                  type="date"
                  className="form-control"
                  value={data.expense_date}
                  onChange={(
                    e: React.ChangeEvent<HTMLInputElement>
                  ) =>
                    setData("expense_date", e.target.value)
                  }
                />
                {errors.expense_date && (
                  <InvalidFeedback
                    errorMsg={errors.expense_date}
                  />
                )}
              </div>
              <div className="mb-4">
                <InputLabel label={"Title"} />
                <FormInput
                  type="text"
                  className="form-control"
                  placeholder="Enter expense title"
                  value={data.title}
                  onChange={(
                    e: React.ChangeEvent<HTMLInputElement>
                  ) =>
                    setData("title", e.target.value)
                  }
                />
                {errors.title && (
                  <InvalidFeedback
                    errorMsg={errors.title}
                  />
                )}
              </div>

              <div className="mb-4">
                <InputLabel label={"Amount"} />
                <FormInput
                  type="number"
                  className="form-control"
                  placeholder="Enter amount"
                  value={data.amount}
                  onChange={(
                    e: React.ChangeEvent<HTMLInputElement>
                  ) =>
                    setData("amount", e.target.value)
                  }
                />
                {errors.amount && (
                  <InvalidFeedback
                    errorMsg={errors.amount}
                  />
                )}
              </div>

              <div className="mb-4">
                <InputLabel label={"Description"} />
                <textarea
                  className="form-control"
                  placeholder="Enter Description"
                  value={data.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setData(
                      "description",
                      e.target.value
                    )
                  }
                ></textarea>
                {errors.description && (
                  <InvalidFeedback
                    errorMsg={errors.description}
                  />
                )}
              </div>

              <div className="mb-4">
                <hr />
                <button
                  className="btn btn-primary px-4"
                  onClick={(e) => {
                    e.preventDefault()
                    post(route('expense.store'))
                  }}
                  disabled={processing}
                >
                  {processing ? 'Creating...' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </AuthLayout>
  )
}

export default Create