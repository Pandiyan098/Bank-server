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
}