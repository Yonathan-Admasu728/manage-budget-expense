import React, { useContext } from "react";
import { v4 as uuidV4 } from 'uuid';
import useLocalStorage from "../hooks/useLocalStorage";

const BudgetsContext = React.createContext()

export function useBudgets() {
   return useContext(BudgetsContext)
}

// {
//     id:
//     name:
//     max:
// }

// {
//     id: 
//     budgetId: 
//     amount: 
//     description: 
// }

export const BudgetsProvider = ({ children }) => {
    const [budgets, setBudgets] = useLocalStorage("budgets", [])
    const [expenses, setExpenses]= useLocalStorage("expenses", [])

    function getBudgetExpenses(budgetId) {
        return expenses.filter(expense => expense.budgetId === budgetId)
    }
    function addExpenses({ description, amount, budgetId }) {
        setExpenses(prevExpenses => {
            return [...prevExpenses, { id: uuidV4(), description, amount, budgetId }]
          })

    }
    function addBudget({ name, max }) {
        setBudgets(prevBudgets => {
          if (prevBudgets.find(budget => budget.name === name)){
              return prevBudgets
          }
          return [...prevBudgets, { id: uuidV4(), name, max }]
        })
    }
    function deleteBudget({ id }) {
        // TODO: deal with uncatagorized expenses when deleting budget
        setBudgets(prevBudgets => {
            return prevBudgets.filter(budget => budget.id !== id)
        })
    }
    function deleteExpense({ id }) {
        setExpenses(prevExpenses => {
            return prevExpenses.filter(expense => expense.id !== id )
        })
    }


  return (
      <BudgetsContext.Provider value={{
          budgets,
          expenses,
          getBudgetExpenses,
          addExpenses,
          addBudget,
          deleteBudget,
          deleteExpense
      }}>
          {children}
      </BudgetsContext.Provider>
  )
}