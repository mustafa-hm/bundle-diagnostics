with active_bundle_subs as (
  select *
  from recharge.subscription
  where status = 'ACTIVE'
    and property_bundle_id is not null
    and _fivetran_deleted = false
),

customers as (
  select
    id as customer_id,
    email,
    concat('https://oats-cs-portal-tool.herokuapp.com/portal/', email) as portal_link,
    concat('https://oats-3-sp.admin.rechargeapps.com/merchant/customers/', id) as recharge_link
  from recharge.customer
),

customer_bundles as (
  select
    customers.customer_id,
    customers.email,
    customers.portal_link,
    customers.recharge_link,

    parent._fivetran_synced,
    children._fivetran_synced,

    parent.id as parent_id,
    children.id as child_id,

    parent.property_bundle_id as parent_bundle_id,
    children.property_bundle_id as child_bundle_id,

    parent.address_id as parent_address_id,
    children.address_id as child_address_id,

    parent.next_charge_scheduled_at as parent_charge_at,
    children.next_charge_scheduled_at as child_charge_at,

    parent.order_interval_frequency as parent_interval_freq,
    children.order_interval_frequency as child_interval_freq,

    parent.order_interval_unit as parent_interval_unit,
    children.order_interval_unit as child_interval_unit,

    cast(regexp_substr(parent.variant_title, r'\d+') as int) as bundle_size,
    sum (children.quantity) over (
      partition by children.property_bundle_id
    ) as children_quantity,

    children.quantity as item_quantity
  from customers
  inner join active_bundle_subs as parent
          on parent.customer_id = customers.customer_id
         and parent.property_bundle_type = 'parent'
  left join active_bundle_subs as children
         on children.customer_id = customers.customer_id
        and children.property_bundle_type = 'child'
        and children.property_bundle_id = parent.property_bundle_id
)

select *
from customer_bundles
where (
  parent_address_id != child_address_id
  or bundle_size != children_quantity
  or parent_charge_at != child_charge_at
  or parent_interval_freq != child_interval_freq
  or parent_interval_unit != child_interval_unit
)
order by parent_charge_at asc, customer_id asc
-- limit 100
