const express = require('express');
<<<<<<< HEAD
const { Category } = require('../models');

const router = express.Router();

// Retorna todas as categorias (pré-definidas).
// Esse endpoint agora é somente leitura para evitar criação/edição/removal de categorias pelo cliente.
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [['type','ASC'], ['name','ASC']] });
=======
const { body, validationResult } = require('express-validator');
const { Category } = require('../models');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const categoryValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Nome deve ter entre 1 e 50 caracteres')
    .escape(),
  body('type')
    .isIn(['income', 'expense'])
    .withMessage('Tipo deve ser income ou expense'),
  body('color')
    .optional()
    .isHexColor()
    .withMessage('Cor deve ser um código hexadecimal válido')
];

// Get all categories
router.get('/', authenticateToken, async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { userId: req.user.id },
      order: [['type', 'ASC'], ['name', 'ASC']]
    });

>>>>>>> 6db7233235da3e6ef435e7acf51f2e8903ce372f
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

<<<<<<< HEAD
module.exports = router;
=======
// Create category
router.post('/', authenticateToken, categoryValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, type, color } = req.body;

    const category = await Category.create({
      name,
      type,
      color: color || '#000000',
      userId: req.user.id
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Update category
router.put('/:id', authenticateToken, categoryValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, type, color } = req.body;

    const category = await Category.findOne({
      where: { id, userId: req.user.id }
    });

    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    await category.update({
      name,
      type,
      color: color || category.color
    });

    res.json(category);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Delete category
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findOne({
      where: { id, userId: req.user.id }
    });

    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    // Check if category has transactions
    const transactionCount = await category.countTransactions();
    if (transactionCount > 0) {
      return res.status(400).json({ 
        error: 'Não é possível deletar categoria com transações associadas' 
      });
    }

    await category.destroy();
    res.json({ message: 'Categoria deletada com sucesso' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
>>>>>>> 6db7233235da3e6ef435e7acf51f2e8903ce372f
