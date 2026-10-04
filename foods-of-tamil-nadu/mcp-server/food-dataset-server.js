#!/usr/bin/env node
/**
 * Foods of Tamil Nadu — MCP Dataset Server
 *
 * A minimal Model Context Protocol server that exposes the local food dataset
 * as inspectable tools. No external services, no API keys, no network calls.
 *
 * Tools:
 *   list_foods        — all 12 dish summaries
 *   get_food          — full details for one dish by ID
 *   validate_dataset  — structural validation across all dishes
 *   filter_foods      — filter by category or dietary type
 */

// ── Inline dataset (mirrors src/data/foods.js) ───────────────
// Kept in sync manually; the MCP server intentionally has no
// build-time dependency on the React source tree.
const FOODS = [
  { id:'pongal', name:'Pongal', image:'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=600&q=80', description:'A sacred harvest dish of creamy rice and lentils simmered with ghee, black pepper, cumin and cashews. The quintessential Tamil breakfast.', region:'Statewide', category:'Breakfast', isVegetarian:true, ingredients:['Raw rice','Split yellow moong dal','Ghee','Black pepper','Cumin seeds','Cashew nuts','Ginger','Curry leaves','Salt'], culturalNote:'Pongal is the centrepiece of the Tamil harvest festival Pongal (Thai Pongal), celebrated in January. The name literally means "to boil over" — symbolising abundance and prosperity.' },
  { id:'idli', name:'Idli', image:'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&q=80', description:'Pillowy steamed rice cakes fermented overnight, served with sambar and coconut chutney. A cornerstone of Tamil breakfast culture.', region:'Statewide', category:'Breakfast', isVegetarian:true, ingredients:['Idli rice','Urad dal','Salt','Water'], culturalNote:'Idli has been a staple in Tamil Nadu for over a millennium, with references found in ancient Kannada and Tamil literature. The overnight fermentation process increases the bioavailability of nutrients.' },
  { id:'dosa', name:'Dosa', image:'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80', description:'A paper-thin, crisp fermented crepe made from rice and lentil batter. Golden and lacey on the outside, soft within.', region:'Statewide', category:'Breakfast', isVegetarian:true, ingredients:['Idli rice','Urad dal','Fenugreek seeds','Salt','Oil'], culturalNote:'Dosa is considered the ambassador of South Indian cuisine worldwide. The Masala Dosa was popularised in restaurants across India in the 20th century.' },
  { id:'parotta', name:'Parotta', image:'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80', description:'Flaky, layered flatbread made from maida, beaten and folded repeatedly to create hundreds of gossamer layers. A true Tamil street food icon.', region:'Statewide', category:'Main Course', isVegetarian:true, ingredients:['All-purpose flour (maida)','Egg','Salt','Sugar','Oil','Water'], culturalNote:'Parotta is a labour of love — the dough is beaten rhythmically against the preparation surface to develop gluten, then coiled and pressed to create its signature layers.' },
  { id:'kothu-parotta', name:'Kothu Parotta', image:'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80', description:'Shredded parotta tossed on a sizzling griddle with eggs, spiced masala, onions and chillies. The rhythmic clanging of iron spatulas is its signature soundtrack.', region:'Statewide', category:'Main Course', isVegetarian:false, ingredients:['Parotta','Egg','Onion','Tomato','Green chilli','Ginger-garlic paste','Fennel seeds','Curry leaves','Garam masala','Oil','Salt'], culturalNote:'Kothu Parotta originated in Madurai and is synonymous with Tamil Nadu\'s vibrant night food culture. The distinctive metallic clang of the iron scrapers has become as iconic as the dish itself.' },
  { id:'chettinad-chicken', name:'Chettinad Chicken', image:'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&q=80', description:'A bold, fiery curry from the Chettinad region, built on a complex spice blend including kalpasi (stone flower), marathi mokku and freshly ground pepper.', region:'Chettinad', category:'Main Course', isVegetarian:false, ingredients:['Chicken','Chettinad spice paste','Kalpasi (stone flower)','Marathi mokku','Kali mirch','Fennel','Star anise','Tomato','Onion','Coconut','Curry leaves','Oil'], culturalNote:'Chettinad cuisine comes from the Chettinad region of Sivaganga district, home to the Nattukotai Chettiar merchant community. Their trade routes brought exotic spices from across Asia into the local kitchen.' },
  { id:'sambar', name:'Sambar', image:'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&q=80', description:'A soul-warming tamarind and lentil broth layered with seasonal vegetables and the deep fragrance of sambar powder. The universal companion to every Tamil meal.', region:'Statewide', category:'Main Course', isVegetarian:true, ingredients:['Toor dal','Tamarind','Tomato','Pearl onions','Drumstick (moringa)','Sambar powder','Mustard seeds','Curry leaves','Dry red chilli','Asafoetida','Turmeric','Oil','Salt'], culturalNote:'Legend attributes the creation of Sambar to a Maratha king who attempted to prepare dal with tamarind instead of kokum. Sambar has become the defining dish of Tamil Nadu cuisine.' },
  { id:'rasam', name:'Rasam', image:'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=600&q=80', description:'A peppery, tangy broth of tamarind and tomato, thin as consommé and fiery with black pepper and cumin. Drunk as a digestive and consumed with rice.', region:'Statewide', category:'Main Course', isVegetarian:true, ingredients:['Tamarind','Tomato','Black pepper','Cumin seeds','Toor dal water','Garlic','Mustard seeds','Dry red chilli','Curry leaves','Coriander leaves','Asafoetida','Salt'], culturalNote:'Rasam is Tamil Nadu\'s age-old remedy for colds and digestive ailments. The word derives from the Sanskrit "rasa" meaning juice or essence. It is the third course in a traditional Tamil meal served on a banana leaf.' },
  { id:'paniyaram', name:'Paniyaram', image:'https://images.unsplash.com/photo-1695902982628-cff55c73ce63?w=600&q=80', description:'Soft, round dumplings made from fermented idli batter, cooked in a special cast-iron pan with shallow wells. Crisp outside, fluffy inside.', region:'Statewide', category:'Snack', isVegetarian:true, ingredients:['Idli/dosa batter','Onion','Green chilli','Curry leaves','Ginger','Mustard seeds','Oil','Salt'], culturalNote:'Paniyaram is the perfect example of Tamil culinary ingenuity — leftover idli batter transformed into a completely new dish. The cast-iron pan (paniyaram chetti) is a treasured piece of equipment passed down through generations.' },
  { id:'kuzhi-paniyaram', name:'Kuzhi Paniyaram', image:'https://images.unsplash.com/photo-1634864572865-1cf82c6e1122?w=600&q=80', description:'Sweet or savoury spherical dumplings named after their unique well-shaped pan. Made with jaggery and coconut for the sweet version, or spiced for savoury.', region:'Chettinad', category:'Snack', isVegetarian:true, ingredients:['Raw rice','Urad dal','Jaggery','Coconut','Cardamom','Banana','Oil'], culturalNote:'Kuzhi Paniyaram ("kuzhi" meaning hole or pit in Tamil) is a beloved Chettinad street food. The sweet version made with jaggery and ripe banana is a popular temple offering during festival seasons.' },
  { id:'kari-dosa', name:'Kari Dosa', image:'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&q=80', description:'A thick, spongy dosa variant prepared with rice flour and grated coconut — softer than regular dosa and traditionally served with mutton or chicken curry.', region:'Kongu Nadu', category:'Breakfast', isVegetarian:true, ingredients:['Rice flour','Grated coconut','Cumin seeds','Salt','Water','Oil'], culturalNote:'Kari Dosa is a specialty of the Kongu Nadu region (Coimbatore, Erode, Salem belt). Its thick, porous texture makes it ideal for soaking up hearty curries and remains a Sunday morning tradition in many Kongu households.' },
  { id:'jigarthanda', name:'Jigarthanda', image:'https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=600&q=80', description:"Madurai's legendary chilled drink — layers of almond milk, nannari syrup, milk ice cream and basil seeds in a tall glass. Cool, sweet and utterly refreshing.", region:'Madurai', category:'Dessert/Drink', isVegetarian:true, ingredients:['Full-fat milk','Almond gum (badam pisin)','Nannari (sarsaparilla) syrup','Basil seeds (sabja)','Milk ice cream','Sugar'], culturalNote:'Jigarthanda means "cool heart" in Urdu. The drink has been sold on Madurai\'s streets since the colonial era. The original recipe using badam pisin and nannari syrup gives it a unique medicinal quality.' },
]

const VALID_CATEGORIES = ['Breakfast', 'Main Course', 'Snack', 'Dessert/Drink']
const REQUIRED_FIELDS  = ['id','name','image','description','region','category','isVegetarian','ingredients','culturalNote']

// ── Tool implementations ──────────────────────────────────────
function list_foods() {
  return FOODS.map(d => ({ id:d.id, name:d.name, category:d.category, isVegetarian:d.isVegetarian, region:d.region }))
}

function get_food({ id } = {}) {
  if (!id) return { error: 'id parameter is required' }
  const dish = FOODS.find(d => d.id === id)
  if (!dish) return { error: `No dish with id "${id}". Valid IDs: ${FOODS.map(d=>d.id).join(', ')}` }
  return dish
}

function validate_dataset() {
  const ids = FOODS.map(d => d.id)
  const datasetIssues = ids.length !== new Set(ids).size ? ['Duplicate IDs detected'] : []
  const dishes = FOODS.map(dish => {
    const issues = []
    REQUIRED_FIELDS.forEach(f => {
      const v = dish[f]
      if (v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0))
        issues.push(`Missing/empty: ${f}`)
    })
    if (!VALID_CATEGORIES.includes(dish.category))  issues.push(`Invalid category: "${dish.category}"`)
    if (typeof dish.isVegetarian !== 'boolean')      issues.push(`isVegetarian must be boolean`)
    return { id:dish.id, name:dish.name, status: issues.length === 0 ? 'PASS' : 'FAIL', issues }
  })
  return {
    summary: { total:FOODS.length, passed:dishes.filter(d=>d.status==='PASS').length, failed:dishes.filter(d=>d.status==='FAIL').length, datasetIssues },
    dishes,
  }
}

function filter_foods({ filter } = {}) {
  const f = filter || 'All'
  let result
  if (f === 'All')           result = FOODS
  else if (f === 'Vegetarian')     result = FOODS.filter(d => d.isVegetarian === true)
  else if (f === 'Non-Vegetarian') result = FOODS.filter(d => d.isVegetarian === false)
  else                       result = FOODS.filter(d => d.category === f)
  return result.map(d => ({ id:d.id, name:d.name, category:d.category, isVegetarian:d.isVegetarian }))
}

// ── MCP JSON-RPC server ───────────────────────────────────────
const TOOLS = {
  list_foods:       { description:'List all 12 Tamil Nadu dishes with summary fields.', inputSchema:{ type:'object', properties:{}, required:[] }, fn:list_foods },
  get_food:         { description:'Get full details for a dish by ID (e.g. "pongal", "jigarthanda").', inputSchema:{ type:'object', properties:{ id:{ type:'string' } }, required:['id'] }, fn:get_food },
  validate_dataset: { description:'Structural validation of all dish entries — same checks as the test suite.', inputSchema:{ type:'object', properties:{}, required:[] }, fn:validate_dataset },
  filter_foods:     { description:'Filter dishes. Values: All, Vegetarian, Non-Vegetarian, Breakfast, Main Course, Snack, Dessert/Drink.', inputSchema:{ type:'object', properties:{ filter:{ type:'string' } }, required:['filter'] }, fn:filter_foods },
}

function send(obj) { process.stdout.write(JSON.stringify(obj) + '\n') }
function ok(id, data) { send({ jsonrpc:'2.0', id, result:{ content:[{ type:'text', text: typeof data==='string' ? data : JSON.stringify(data,null,2) }] } }) }
function err(id, msg) { send({ jsonrpc:'2.0', id, error:{ code:-32601, message:msg } }) }

let buf = ''
process.stdin.setEncoding('utf8')
process.stdin.on('data', chunk => {
  buf += chunk
  const lines = buf.split('\n'); buf = lines.pop()
  lines.forEach(line => {
    if (!line.trim()) return
    let msg; try { msg = JSON.parse(line) } catch { return }
    const { id, method, params } = msg
    if (method === 'initialize') {
      send({ jsonrpc:'2.0', id, result:{ protocolVersion:'2024-11-05', capabilities:{ tools:{} }, serverInfo:{ name:'food-dataset-server', version:'1.0.0' } } })
    } else if (method === 'notifications/initialized') {
      // no-op
    } else if (method === 'tools/list') {
      send({ jsonrpc:'2.0', id, result:{ tools: Object.entries(TOOLS).map(([name,t]) => ({ name, description:t.description, inputSchema:t.inputSchema })) } })
    } else if (method === 'tools/call') {
      const { name, arguments:args } = params || {}
      const tool = TOOLS[name]
      if (!tool) { err(id, `Unknown tool: ${name}`); return }
      try { ok(id, tool.fn(args || {})) } catch(e) { err(id, e.message) }
    } else {
      err(id, `Unknown method: ${method}`)
    }
  })
})
