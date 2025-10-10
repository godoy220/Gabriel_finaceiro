import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    categoryId: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transactionsRes, categoriesRes] = await Promise.all([
        axios.get('/api/transactions?limit=50'),
        axios.get('/api/categories')
      ]);

      setTransactions(transactionsRes.data.transactions);
      setCategories(categoriesRes.data);
      
      // Se existem categorias, seleciona a primeira por padrão
      if (categoriesRes.data.length > 0 && !formData.categoryId) {
        const defaultCategory = categoriesRes.data.find(cat => cat.type === 'expense') || categoriesRes.data[0];
        if (defaultCategory) {
          setFormData(prev => ({ ...prev, categoryId: defaultCategory.id }));
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validação básica
    if (!formData.description || !formData.amount || !formData.categoryId) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      setError('O valor deve ser maior que zero');
      return;
    }

    try {
      const response = await axios.post('/api/transactions', {
        ...formData,
        amount: parseFloat(formData.amount)
      });

      setSuccess('Transação criada com sucesso!');
      setShowForm(false);
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        date: new Date().toISOString().split('T')[0],
        categoryId: categories.find(cat => cat.type === 'expense')?.id || ''
      });
      
      // Recarregar a lista
      fetchData();
      
      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Erro ao criar transação:', error);
      setError(error.response?.data?.error || 'Erro ao criar transação');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja deletar esta transação?')) {
      try {
        await axios.delete(`/api/transactions/${id}`);
        setSuccess('Transação deletada com sucesso!');
        fetchData(); // Recarregar a lista
        
        // Limpar mensagem de sucesso após 3 segundos
        setTimeout(() => setSuccess(''), 3000);
      } catch (error) {
        console.error('Erro ao deletar transação:', error);
        setError(error.response?.data?.error || 'Erro ao deletar transação');
      }
    }
  };

  const handleTypeChange = (newType) => {
    setFormData(prev => ({
      ...prev,
      type: newType,
      // Atualizar categoria para uma do tipo selecionado
      categoryId: categories.find(cat => cat.type === newType)?.id || ''
    }));
  };

  // Filtrar categorias baseado no tipo selecionado
  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  if (loading) {
    return <div className="loading">Carregando transações...</div>;
  }

  return (
    <div className="dashboard">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Transações</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? 'Cancelar' : 'Nova Transação'}
        </button>
      </div>

      {/* Mensagens de erro e sucesso */}
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {showForm && (
        <div className="form-container">
          <h2>Nova Transação</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Descrição: *</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ex: Almoço, Salário, Conta de Luz..."
                required
              />
            </div>
            
            <div className="form-group">
              <label>Valor (R$): *</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>

            <div className="form-group">
              <label>Tipo: *</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => handleTypeChange('expense')}
                  className={formData.type === 'expense' ? 'btn-primary' : 'btn-secondary'}
                  style={{ flex: 1 }}
                >
                  Despesa
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('income')}
                  className={formData.type === 'income' ? 'btn-primary' : 'btn-secondary'}
                  style={{ flex: 1 }}
                >
                  Receita
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Categoria: *</label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                required
              >
                <option value="">Selecione uma categoria</option>
                {filteredCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {filteredCategories.length === 0 && (
                <p style={{ color: '#ef4444', fontSize: '14px', marginTop: '5px' }}>
                  Nenhuma categoria disponível para {formData.type === 'income' ? 'receita' : 'despesa'}. 
                  Crie uma categoria primeiro.
                </p>
              )}
            </div>

            <div className="form-group">
              <label>Data: *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                Salvar Transação
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="transactions-list">
        <h2>Histórico de Transações</h2>
        {transactions.length === 0 ? (
          <p>Nenhuma transação encontrada. Clique em "Nova Transação" para adicionar.</p>
        ) : (
          transactions.map(transaction => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-info">
                <span className="description">{transaction.description}</span>
                <span className={`amount ${transaction.type}`}>
                  {transaction.type === 'income' ? '+' : '-'} R$ {parseFloat(transaction.amount).toFixed(2)}
                </span>
              </div>
              <div className="transaction-meta">
                <span 
                  className="category" 
                  style={{ 
                    color: transaction.Category?.color,
                    fontWeight: '500'
                  }}
                >
                  {transaction.Category?.name}
                </span>
                <span className="date">
                  {new Date(transaction.date).toLocaleDateString('pt-BR')}
                </span>
                <button 
                  onClick={() => handleDelete(transaction.id)}
                  className="btn-danger"
                  style={{ marginLeft: '10px' }}
                >
                  Deletar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Transactions;