const { sequelize } = require('./models');
const bcrypt = require('bcryptjs');

async function setupDatabase() {
  try {
    // Sincronizar tabelas
    await sequelize.sync({ force: false });
    console.log('✅ Tabelas sincronizadas');
    
    // Verificar se existem categorias padrão
    const { Category } = require('./models');
    const categoriesCount = await Category.count();
    
    if (categoriesCount === 0) {
      // Inserir categorias padrão
      const defaultCategories = [
        // Income categories
        { name: 'Salário', type: 'income', color: '#22c55e' },
        { name: 'Freelance', type: 'income', color: '#16a34a' },
        { name: 'Investimentos', type: 'income', color: '#15803d' },
        
        // Expense categories
        { name: 'Alimentação', type: 'expense', color: '#ef4444' },
        { name: 'Transporte', type: 'expense', color: '#dc2626' },
        { name: 'Moradia', type: 'expense', color: '#b91c1c' },
        { name: 'Lazer', type: 'expense', color: '#991b1b' },
        { name: 'Saúde', type: 'expense', color: '#7f1d1d' }
      ];
      
      await Category.bulkCreate(defaultCategories);
      console.log('✅ Categorias padrão criadas');
    }
    
    console.log('✅ Configuração do banco de dados concluída');
  } catch (error) {
    console.error('❌ Erro na configuração:', error);
  }
}

setupDatabase();