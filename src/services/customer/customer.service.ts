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

  async updateCustomer(customerId: number, updates: Partial<Customer>) {
  try {
    // Check if customer exists
    const existingCustomer = await customerDao.findById(customerId);
    if (!existingCustomer) {
      throw new Error('Customer not found');
    }

    // If email is being updated, check for duplicates
    if (updates.email && updates.email !== existingCustomer.email) {
      try {
        const emailExists = await customerDao.findByEmail(updates.email);
        if (emailExists) {
          throw new Error('Email already exists');
        }
      } catch (error: any) {
        if (error.code !== 'PGRST116') {
          throw error;
        }
      }
    }

    // Update customer
    const updatedCustomer = await customerDao.update(customerId, updates);
    return updatedCustomer;
  } catch (error: any) {
    console.error('Update customer service error:', error);
    throw new Error(error.message || 'Failed to update customer');
  }
}

async deleteCustomer(customerId: number) {
  try {
    // Check if customer exists
    const existingCustomer = await customerDao.findById(customerId);
    if (!existingCustomer) {
      throw new Error('Customer not found');
    }

    // Delete customer
    await customerDao.delete(customerId);
    return { success: true, message: 'Customer deleted successfully' };
  } catch (error: any) {
    console.error('Delete customer service error:', error);
    throw new Error(error.message || 'Failed to delete customer');
  }
}
}