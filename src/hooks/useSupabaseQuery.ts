import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export function useSupabaseQuery<T = any>(
  table: string,
  select: string = '*',
  filters?: { column: string; value: any }[]
) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const queryKey = [table, user?.id, filters];

  const fetchData = async (): Promise<T[]> => {
    let query = supabase.from(table).select(select);
    if (filters) {
      filters.forEach(f => {
        query = query.eq(f.column, f.value);
      });
    }
    if (table !== 'profiles' && table !== 'user_settings') {
      query = query.eq('user_id', user?.id);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data as T[];
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey,
    queryFn: fetchData,
    enabled: !!user,
  });

  const add = useMutation({
    mutationFn: async (newItem: any) => {
      const { data, error } = await supabase
        .from(table)
        .insert([{ ...newItem, user_id: user?.id }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      const { data, error } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return { data, isLoading, error, refetch, add, update, remove };
}