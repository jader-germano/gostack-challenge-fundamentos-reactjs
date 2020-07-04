import React, { useEffect, useState } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import Header from '../../components/Header';

import api from '../../services/api';

import formatValue from '../../utils/formatValue';

import { Card, CardContainer, Container, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactionsScreen, setTransactionsScreen] = useState<Transaction[]>(
    [],
  );
  const [balanceScreen, setBalanceScreen] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      try {
        const { data } = await api.get(`/transactions`);
        const { transactions, balance } = data;

        const formateTransactions = transactions.map(
          (transaction: Transaction) => ({
            ...transaction,
            formattedValue: formatValue(transaction.value),
            formattedDate: new Date(transaction.created_at).toLocaleDateString(
              'pt-br',
            ),
          }),
        );
        const formateBalance = {
          income: formatValue(balance.income),
          outcome: `${formatValue(balance.outcome)}`,
          total: formatValue(balance.total),
        };

        setTransactionsScreen(formateTransactions);
        setBalanceScreen(formateBalance);
      } catch (err) {
        console.log(err.response.error);
      }
    }

    loadTransactions().then();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balanceScreen.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balanceScreen.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balanceScreen.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            {transactionsScreen.map((transaction) => (
              <tbody key={transaction.id}>
                <tr>
                  <td className="title">{transaction.title}</td>
                  <td
                    className={
                      transaction.type === 'income' ? 'income' : 'outcome'
                    }
                  >
                    {transaction.type === 'outcome' && ' - '}
                    {transaction.formattedValue}
                  </td>
                  <td>{transaction.category.title}</td>
                  <td>{transaction.formattedDate}</td>
                </tr>
              </tbody>
            ))}
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
