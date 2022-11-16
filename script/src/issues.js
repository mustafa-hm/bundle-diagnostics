import { supabase } from './supabase.js'

export async function reset () {
  await supabase
    .from('issues')
    .delete()
    .gt('id', 0)
}

export async function createIssue (attributes) {
  const { data, error } = await supabase
    .from('issues')
    .upsert(attributes)
    .select()
    .single()
  console.log(data, error)
}
