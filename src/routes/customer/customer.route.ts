import { Router } from 'express';
import { CustomerController } from '../../controllers/customer/customer.controller';

const router = Router();
const customerController = new CustomerController();

// POST - Create new customer
router.post('/', customerController.createCustomer);

// GET - Get customer by ID
router.get('/:id', customerController.getCustomerById);

// GET - Get all customers
router.get('/', customerController.getAllCustomers);

// PUT - Update customer by ID
router.put('/:id', customerController.updateCustomer);

// DELETE - Delete customer by ID
router.delete('/:id', customerController.deleteCustomer);


// POST - Get request headers and body info
router.post('/request-info', customerController.getRequestInfo);

export default router;