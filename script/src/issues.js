import { supabase } from './supabase.js'

export async function reset () {
  await supabase
    .from('issues')
    .delete()
    .not('resolved_at', 'is', null)
}

export async function createIssue (attributes) {
  const { data, error } = await supabase
    .from('issues')
    .upsert(attributes)
    .select()
    .single()
  console.log(data, error)
}

export async function createIssues ({
  customer_id,
  charge_id,
  scheduled_at,
  issues
}) {
  const grouped = issues.reduce((acc, i) => {
    const key = i.bundle_id || 'customer'
    acc[key] ||= []
    acc[key].push(i)
    return acc
  }, {})

  for (const [ bundle_id, issues ] of Object.entries(grouped)) {
    await createIssue({
      customer_id,
      charge_id,
      scheduled_at,
      bundle_id,
      data: issues
    })
  }
}
