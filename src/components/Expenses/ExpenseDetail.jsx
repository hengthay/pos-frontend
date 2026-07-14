import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchExpenseById, selectExpenseDetailData, selectExpenseStatusDetail } from '../../feature/expenses/expenseSlice'
import LoadingState from '../helper/LoadingState'
import ErrorMessage from '../helper/ErrorMessage'
import formatDate from '../helper/formatDate'

const ExpenseDetail = () => {

  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const expenseDetail = useSelector(selectExpenseDetailData)
  const expenseStatusDetail = useSelector(selectExpenseStatusDetail)

  useEffect(() => {
    if (id) dispatch(fetchExpenseById(id))
  }, [id, dispatch])

  if (expenseStatusDetail === 'loading') {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingState />
      </div>
    )
  }

  if (expenseStatusDetail === 'failed' || !expenseDetail) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <ErrorMessage message={'Expense not found!'}/>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Expense Details
          </h1>
          <p className="text-gray-500 mt-1">
            View complete information about this expense.
          </p>
        </div>

        <button
          onClick={() => navigate('/expenses')}
          className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
        >
          Back
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="border-b border-gray-200 px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {expenseDetail?.title}
              </h2>

              <p className="mt-2 text-gray-600">
                {expenseDetail?.description || "No description provided."}
              </p>
            </div>

            <span className="rounded-full bg-emerald-100 text-emerald-700 px-4 py-2 text-lg font-semibold">
              ${expenseDetail?.amount}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-8">

          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Expense Date
            </p>

            <p className="mt-2 text-gray-900 font-medium">
              {expenseDetail?.expense_date ?? formatDate(expenseDetail?.expense_date)}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Created By
            </p>

            <div className="flex items-center gap-3 mt-2">
              <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                {expenseDetail?.created_by?.name?.charAt(0)}
              </div>

              <div>
                <p className="font-medium text-gray-900">
                  {expenseDetail?.created_by?.name}
                </p>

                <p className="text-sm text-gray-500">
                  {expenseDetail?.created_by?.email}
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Created At
            </p>

            <p className="mt-2 text-gray-900">
              {new Date(expenseDetail?.created_at).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Last Updated
            </p>

            <p className="mt-2 text-gray-900">
              {new Date(expenseDetail?.updated_at).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 px-8 py-5 flex justify-end gap-3">
          <button
            onClick={() => navigate('/expenses')}
            className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
          >
            Back
          </button>

          <button
            onClick={() => navigate(`/expenses/${expenseDetail?.id}/edit`)}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Edit Expense
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExpenseDetail