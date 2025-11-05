import { Request, Response } from 'express';
import { CustomerService } from '../../services/customer/customer.service';

const customerService = new CustomerService();

export class CustomerController {
  async createCustomer(req: Request, res: Response): Promise<void> {
    try {
      const customerData = req.body;

      // Validate required fields
      if (!customerData.email) {
        res.status(400).json({ 
          success: false,
          error: 'Email is required' 
        });
        return;
      }

      const customer = await customerService.createCustomer(customerData);

      res.status(201).json({
        success: true,
        message: 'Customer created successfully',
        data: customer
      });
    } catch (error: any) {
      console.error('Create customer controller error:', error);
      
      // Handle duplicate email error
      if (error.message.includes('already exists')) {
        res.status(409).json({ 
          success: false,
          error: error.message 
        });
        return;
      }

      res.status(500).json({ 
        success: false,
        error: error.message || 'Failed to create customer' 
      });
    }
  }

  async getCustomerById(req: Request, res: Response): Promise<void> {
    try {
      const customerId = parseInt(req.params.id);

      // Validate ID
      if (isNaN(customerId)) {
        res.status(400).json({ 
          success: false,
          error: 'Invalid customer ID' 
        });
        return;
      }

      const customer = await customerService.getCustomerById(customerId);

      res.status(200).json({
        success: true,
        data: customer
      });
    } catch (error: any) {
      console.error('Get customer controller error:', error);

      // Handle not found error
      if (error.message.includes('not found')) {
        res.status(404).json({ 
          success: false,
          error: 'Customer not found' 
        });
        return;
      }

      res.status(500).json({ 
        success: false,
        error: error.message || 'Failed to fetch customer' 
      });
    }
  }

  async getAllCustomers(req: Request, res: Response): Promise<void> {
    try {
      const customers = await customerService.getAllCustomers();

      res.status(200).json({
        success: true,
        count: customers.length,
        data: customers
      });
    } catch (error: any) {
      console.error('Get all customers controller error:', error);
      res.status(500).json({ 
        success: false,
        error: error.message || 'Failed to fetch customers' 
      });
    }
  }

  async updateCustomer(req: Request, res: Response): Promise<void> {
  try {
    const customerId = parseInt(req.params.id);
    const updates = req.body;

    // Validate ID
    if (isNaN(customerId)) {
      res.status(400).json({ 
        success: false,
        error: 'Invalid customer ID' 
      });
      return;
    }

    // Validate that there's something to update
    if (Object.keys(updates).length === 0) {
      res.status(400).json({ 
        success: false,
        error: 'No data provided for update' 
      });
      return;
    }

    const customer = await customerService.updateCustomer(customerId, updates);

    res.status(200).json({
      success: true,
      message: 'Customer updated successfully',
      data: customer
    });
  } catch (error: any) {
    console.error('Update customer controller error:', error);

    // Handle not found error
    if (error.message.includes('not found')) {
      res.status(404).json({ 
        success: false,
        error: 'Customer not found' 
      });
      return;
    }

    // Handle duplicate email error
    if (error.message.includes('already exists')) {
      res.status(409).json({ 
        success: false,
        error: error.message 
      });
      return;
    }

    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to update customer' 
    });
  }
}

async deleteCustomer(req: Request, res: Response): Promise<void> {
  try {
    const customerId = parseInt(req.params.id);

    // Validate ID
    if (isNaN(customerId)) {
      res.status(400).json({ 
        success: false,
        error: 'Invalid customer ID' 
      });
      return;
    }

    await customerService.deleteCustomer(customerId);

    res.status(200).json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete customer controller error:', error);

    // Handle not found error
    if (error.message.includes('not found')) {
      res.status(404).json({ 
        success: false,
        error: 'Customer not found' 
      });
      return;
    }

    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to delete customer' 
    });
  }
}
}