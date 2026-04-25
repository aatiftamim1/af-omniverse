// LocalStorage Persistence Layer (Bypassing Supabase)
export const supabase = {
  from: (table: string) => ({
    select: () => ({
      order: () => ({
        data: JSON.parse(localStorage.getItem(table) || '[]'),
        error: null
      }),
      data: JSON.parse(localStorage.getItem(table) || '[]'),
      error: null
    }),
    insert: async (newData: any) => {
      const existingData = JSON.parse(localStorage.getItem(table) || '[]');
      const updatedData = [...existingData, ...newData];
      localStorage.setItem(table, JSON.stringify(updatedData));
      return { data: newData, error: null };
    },
    upsert: async (newData: any) => {
      localStorage.setItem(table, JSON.stringify(newData));
      return { data: newData, error: null };
    },
    delete: () => ({
      eq: () => {
        localStorage.removeItem(table);
        return { error: null };
      }
    })
  }),
  auth: {
    getUser: () => ({ data: { user: { id: 'master_aatif' } }, error: null }),
    signOut: () => null
  }
};
