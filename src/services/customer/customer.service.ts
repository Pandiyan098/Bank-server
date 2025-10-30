import { CustomerDao, Customer } from '../../dao/customer/customer.dao';

const customerDao = new CustomerDao();

export class CustomerService {
  async createCustomer(customerData: Customer) {
    try {
      // Validate email is provided
      if (!customerData.email) {
        throw new Error('Email is required');
      }

      // Check if email already exists
      try {
        const existingCustomer = await customerDao.findByEmail(customerData.email);
        if (existingCustomer) {
          throw new Error('Email already exists');
        }
      } catch (error: any) {
        // If error is not "not found", throw it
        if (error.code !== 'PGRST116') {
          throw error;
        }
      }

      // Create customer
      const customer = await customerDao.create(customerData);
      return customer;
    } catch (error: any) {
      console.error('Create customer service error:', error);
      throw new Error(error.message || 'Failed to create customer');
    }
  }

  async getCustomerById(customerId: number) {
    try {
      const customer = await customerDao.findById(customerId);
      
      if (!customer) {
        throw new Error('Customer not found');
      }

      return customer;
    } catch (error: any) {
      console.error('Get customer by id service error:', error);
      throw new Error(error.message || 'Failed to fetch customer');
    }
  }

  async getAllCustomers() {
    try {
      const customers = await customerDao.findAll();
      return customers;
    } catch (error: any) {
      console.error('Get all customers service error:', error);
      throw new Error(error.message || 'Failed to fetch customers');
    }
  }
}