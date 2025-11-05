import { supabase } from '../../config/supabase';

export interface Customer {
  customer_id?: number;
  first_name?: string;
  last_name?: string;
  dob?: string;
  address?: string;
  email?: string;
  phone_number?: string;
  date_joined?: string;
  status?: string;
}

export class CustomerDao {
  private tableName = 'customers';

  async create(customerData: Customer) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .insert([customerData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Create customer DAO error:', error);
      throw error;
    }
  }

  async findById(customerId: number) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('customer_id', customerId)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Find customer by id DAO error:', error);
      throw error;
    }
  }

  async findAll() {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .order('customer_id', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Find all customers DAO error:', error);
      throw error;
    }
  }

  async findByEmail(email: string) {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('email', email)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Find customer by email DAO error:', error);
      throw error;
    }
  }

  async update(customerId: number, updates: Partial<Customer>) {
  try {
    const { data, error } = await supabase
      .from(this.tableName)
      .update(updates)
      .eq('customer_id', customerId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Update customer DAO error:', error);
    throw error;
  }
}

async delete(customerId: number) {
  try {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('customer_id', customerId);

    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error('Delete customer DAO error:', error);
    throw error;
  }
}
}

