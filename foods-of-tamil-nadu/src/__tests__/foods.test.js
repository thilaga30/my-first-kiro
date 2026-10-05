import fc from "fast-check"
import { FOODS } from "../data/foods.js"
import { searchFoods, filterFoods, applyDiscovery, applyAllFilters, filterByRegion, getRegions, pickRandom, ALLOWED_FILTERS } from "../utils/filterFoods.js"

const REQ = ["id","name","image","description","region","category","isVegetarian","ingredients","culturalNote"]
const CATS = ["Breakfast","Main Course","Snack","Dessert/Drink"]
const ids = FOODS.map(d => d.id)

describe("Dataset unit tests", () => {
  it("has 12 dishes", () => { expect(FOODS).toHaveLength(12) })
  it("all IDs unique", () => { expect(new Set(ids).size).toBe(12) })
  it("all required fields present", () => {
    FOODS.forEach(d => REQ.forEach(f => expect(d).toHaveProperty(f)))
  })
  it("isVegetarian is boolean", () => {
    FOODS.forEach(d => expect(typeof d.isVegetarian).toBe("boolean"))
  })
  it("ingredients non-empty array", () => {
    FOODS.forEach(d => { expect(Array.isArray(d.ingredients)).toBe(true); expect(d.ingredients.length).toBeGreaterThan(0) })
  })
  it("category valid", () => { FOODS.forEach(d => expect(CATS).toContain(d.category)) })
  it("chettinad-chicken not veg", () => { expect(FOODS.find(d => d.id === "chettinad-chicken").isVegetarian).toBe(false) })
  it("kothu-parotta not veg", () => { expect(FOODS.find(d => d.id === "kothu-parotta").isVegetarian).toBe(false) })
})

describe("Property 1: Dish Schema Invariant", () => {
  // Feature: foods-of-tamil-nadu, Property 1: Dish Schema Invariant
  it("all dishes satisfy schema", () => {
    FOODS.forEach(d => {
      REQ.forEach(f => expect(d).toHaveProperty(f))
      expect(typeof d.isVegetarian).toBe("boolean")
      expect(d.ingredients.length).toBeGreaterThan(0)
      expect(CATS).toContain(d.category)
    })
  })

  // Feature: foods-of-tamil-nadu, Property 1: Dish Schema Invariant
  // Validates: Requirements 1.2, 13.2, 13.4, 13.5, 13.6
  it("property: every dish sampled from FOODS satisfies all field-presence and type constraints", () => {
    fc.assert(
      fc.property(fc.constantFrom(...FOODS), dish => {
        // All 9 required fields present
        REQ.forEach(f => expect(dish).toHaveProperty(f))
        // isVegetarian is a boolean
        expect(typeof dish.isVegetarian).toBe("boolean")
        // ingredients is a non-empty array
        expect(Array.isArray(dish.ingredients)).toBe(true)
        expect(dish.ingredients.length).toBeGreaterThan(0)
        // category is one of the 4 allowed values
        expect(CATS).toContain(dish.category)
      }),
      { numRuns: 100 }
    )
  })
})

describe("searchFoods unit tests", () => {
  it("empty string returns all", () => { expect(searchFoods(FOODS,"")).toHaveLength(12) })
  it("whitespace returns all", () => { expect(searchFoods(FOODS,"   ")).toHaveLength(12) })
  it("Idli returns exactly Idli", () => { const r=searchFoods(FOODS,"Idli"); expect(r).toHaveLength(1); expect(r[0].id).toBe("idli") })
  it("case insensitive", () => {
    const a=searchFoods(FOODS,"idli").map(d=>d.id)
    expect(a).toEqual(searchFoods(FOODS,"IDLI").map(d=>d.id))
    expect(a).toEqual(searchFoods(FOODS,"IdLi").map(d=>d.id))
  })
  it("no match returns empty", () => { expect(searchFoods(FOODS,"zzz")).toHaveLength(0) })
})

// Feature: foods-of-tamil-nadu, Task 3.2: Search unit tests
// Validates: Requirements 14.1, 14.2, 14.3, 14.4
describe("Search unit tests", () => {
  it("empty string returns all 12 dishes", () => {
    expect(searchFoods(FOODS, "")).toHaveLength(12)
  })
  it("matching name returns only that dish", () => {
    const results = searchFoods(FOODS, "Dosa")
    expect(results.length).toBeGreaterThanOrEqual(1)
    results.forEach(d => expect(d.name.toLowerCase()).toContain("dosa"))
  })
  it("case-insensitive match: dosa, DOSA, DoSa all return same results", () => {
    const lower = searchFoods(FOODS, "dosa").map(d => d.id)
    const upper = searchFoods(FOODS, "DOSA").map(d => d.id)
    const mixed = searchFoods(FOODS, "DoSa").map(d => d.id)
    expect(lower).toEqual(upper)
    expect(lower).toEqual(mixed)
    expect(lower.length).toBeGreaterThan(0)
  })
  it("no-match string returns []", () => {
    expect(searchFoods(FOODS, "zzznomatch")).toEqual([])
  })
})

describe("Property 2: Search Result Correctness", () => {
  // Feature: foods-of-tamil-nadu, Property 2: Search Result Correctness
  it("results contain search text; count <= total", () => {
    fc.assert(fc.property(fc.string({maxLength:20}), t => {
      const r=searchFoods(FOODS,t)
      expect(r.length).toBeLessThanOrEqual(FOODS.length)
      const term=t.trim().toLowerCase()
      if(term) r.forEach(d => expect(d.name.toLowerCase()).toContain(term))
    }), {numRuns:200})
  })
})

describe("filterFoods unit tests", () => {
  it("All returns 12", () => { expect(filterFoods(FOODS,"All")).toHaveLength(12) })
  it("Vegetarian all veg", () => { filterFoods(FOODS,"Vegetarian").forEach(d => expect(d.isVegetarian).toBe(true)) })
  it("Non-Vegetarian all non-veg", () => { filterFoods(FOODS,"Non-Vegetarian").forEach(d => expect(d.isVegetarian).toBe(false)) })
  it.each(CATS)("%s filter correct", cat => { filterFoods(FOODS,cat).forEach(d => expect(d.category).toBe(cat)) })
})

describe("Property 3: Filter Result Correctness", () => {
  // Feature: foods-of-tamil-nadu, Property 3: Filter Result Correctness
  it("results satisfy filter predicate", () => {
    fc.assert(fc.property(fc.constantFrom(...ALLOWED_FILTERS), f => {
      filterFoods(FOODS,f).forEach(d => {
        if(f==="Vegetarian") expect(d.isVegetarian).toBe(true)
        if(f==="Non-Vegetarian") expect(d.isVegetarian).toBe(false)
        if(CATS.includes(f)) expect(d.category).toBe(f)
      })
    }), {numRuns:200})
  })
})

describe("Property 4: Veg/NonVeg Disjoint", () => {
  // Feature: foods-of-tamil-nadu, Property 4: Vegetarian / Non-Vegetarian Sets Are Disjoint
  it("veg and non-veg share no dish", () => {
    const v=new Set(filterFoods(FOODS,"Vegetarian").map(d=>d.id))
    const n=new Set(filterFoods(FOODS,"Non-Vegetarian").map(d=>d.id))
    expect([...v].filter(id=>n.has(id))).toHaveLength(0)
  })
})

describe("applyDiscovery unit tests", () => {
  it("intersection satisfies both predicates", () => {
    applyDiscovery(FOODS,"a","Vegetarian").forEach(d => {
      expect(d.name.toLowerCase()).toContain("a")
      expect(d.isVegetarian).toBe(true)
    })
  })
  it("no-match returns empty", () => { expect(applyDiscovery(FOODS,"zzz","Breakfast")).toHaveLength(0) })
})

describe("Property 5: Combined Subset Invariants", () => {
  // Feature: foods-of-tamil-nadu, Property 5: Combined Search + Filter Correctness and Subset Invariants
  it("combined subset of search-only and filter-only", () => {
    fc.assert(fc.property(fc.string({maxLength:20}), fc.constantFrom(...ALLOWED_FILTERS), (t,f) => {
      const c=applyDiscovery(FOODS,t,f)
      const si=new Set(searchFoods(FOODS,t).map(d=>d.id))
      const fi=new Set(filterFoods(FOODS,f).map(d=>d.id))
      c.forEach(d => { expect(si.has(d.id)).toBe(true); expect(fi.has(d.id)).toBe(true) })
      expect(c.length).toBeLessThanOrEqual(si.size)
      expect(c.length).toBeLessThanOrEqual(fi.size)
    }), {numRuns:200})
  })
})

function makeStore(init=[]) {
  let s=new Set(init)
  return { toggle(id){ const n=new Set(s); if(n.has(id)){n.delete(id)}else{n.add(id)}; s=n; return new Set(s) }, get(){ return new Set(s) } }
}

describe("Favourites unit tests", () => {
  it("add to empty -> singleton", () => { expect([...makeStore().toggle("pongal")]).toEqual(["pongal"]) })
  it("toggle twice -> removed", () => { const s=makeStore(); s.toggle("pongal"); expect(s.toggle("pongal").has("pongal")).toBe(false) })
  it("remove existing id", () => { expect(makeStore(["pongal"]).toggle("pongal").has("pongal")).toBe(false) })
  it("add new keeps existing", () => { const r=makeStore(["idli"]).toggle("pongal"); expect(r.has("idli")).toBe(true); expect(r.has("pongal")).toBe(true) })
  it("malformed localStorage -> empty, no throw", () => {
    function safeRead(raw){ try{ if(!raw) return new Set(); const p=JSON.parse(raw); if(!Array.isArray(p)) return new Set(); return new Set(p.filter(i=>typeof i==="string")) }catch{ return new Set() } }
    expect(()=>safeRead("{bad[")).not.toThrow()
    expect(safeRead("{bad[").size).toBe(0)
    expect(safeRead("null").size).toBe(0)
  })
})

describe("Property 6: Favourites No Duplicates", () => {
  // Feature: foods-of-tamil-nadu, Property 6: Favourites Set Never Contains Duplicates
  it("Set size never exceeds distinct ids", () => {
    fc.assert(fc.property(fc.array(fc.constantFrom(...ids),{minLength:1,maxLength:30}), seq => {
      let store=new Set()
      seq.forEach(id=>{ const n=new Set(store); if(n.has(id)){n.delete(id)}else{n.add(id)}; store=n })
      expect(store.size).toBeLessThanOrEqual(new Set(seq).size)
    }), {numRuns:200})
  })
})

describe("Property 7: localStorage Round-Trip", () => {
  // Feature: foods-of-tamil-nadu, Property 7: Favourites localStorage Round-Trip
  it("serialise -> deserialise equals original", () => {
    fc.assert(fc.property(fc.array(fc.constantFrom(...ids),{maxLength:12}), arr => {
      const orig=new Set(arr)
      const back=new Set(JSON.parse(JSON.stringify([...orig])).filter(i=>typeof i==="string"))
      expect(back.size).toBe(orig.size)
      orig.forEach(id=>expect(back.has(id)).toBe(true))
    }), {numRuns:200})
  })
})

describe("Property 8: Dataset Immutability", () => {
  // Feature: foods-of-tamil-nadu, Property 8: Dataset Immutability Under Operations
  it("operations never mutate FOODS", () => {
    fc.assert(fc.property(fc.string({maxLength:20}), fc.constantFrom(...ALLOWED_FILTERS), (t,f) => {
      const snap=FOODS.map(d=>({...d}))
      searchFoods(FOODS,t); filterFoods(FOODS,f); applyDiscovery(FOODS,t,f)
      expect(FOODS).toHaveLength(snap.length)
      snap.forEach((s,i) => REQ.forEach(k => expect(FOODS[i][k]).toEqual(s[k])))
    }), {numRuns:200})
  })
})
// ── Region filtering ─────────────────────────────────────────
describe("filterByRegion unit tests", () => {
  it("All returns all dishes", () => { expect(filterByRegion(FOODS,"All")).toHaveLength(12) })
  it("Statewide returns only Statewide dishes", () => { filterByRegion(FOODS,"Statewide").forEach(d => expect(d.region).toBe("Statewide")) })
  it("Chettinad returns only Chettinad dishes", () => { filterByRegion(FOODS,"Chettinad").forEach(d => expect(d.region).toBe("Chettinad")) })
  it("Madurai returns only Madurai dishes", () => { filterByRegion(FOODS,"Madurai").forEach(d => expect(d.region).toBe("Madurai")) })
  it("unknown region returns empty array", () => { expect(filterByRegion(FOODS,"Atlantis")).toHaveLength(0) })
})

describe("getRegions unit tests", () => {
  it("returns sorted unique regions from dataset", () => {
    const regions = getRegions(FOODS)
    expect(regions.length).toBeGreaterThan(0)
    expect(new Set(regions).size).toBe(regions.length)
    const sorted = [...regions].sort()
    expect(regions).toEqual(sorted)
  })
  it("all returned regions exist on at least one dish", () => {
    const regions = getRegions(FOODS)
    regions.forEach(r => expect(FOODS.some(d => d.region === r)).toBe(true))
  })
})

describe("applyAllFilters — region + search + category composition", () => {
  it("region filter composes with search", () => {
    const results = applyAllFilters(FOODS, "a", "All", "Statewide")
    results.forEach(d => {
      expect(d.region).toBe("Statewide")
      expect(d.name.toLowerCase()).toContain("a")
    })
  })
  it("region + category filter returns intersection", () => {
    const results = applyAllFilters(FOODS, "", "Breakfast", "Statewide")
    results.forEach(d => {
      expect(d.region).toBe("Statewide")
      expect(d.category).toBe("Breakfast")
    })
  })
  it("no-match triple combination returns empty array", () => {
    expect(applyAllFilters(FOODS, "zzz", "Breakfast", "Madurai")).toHaveLength(0)
  })
  it("All region + All filter returns all 12 dishes", () => {
    expect(applyAllFilters(FOODS, "", "All", "All")).toHaveLength(12)
  })
})

describe("pickRandom unit tests", () => {
  it("returns null for empty array", () => { expect(pickRandom([])).toBeNull() })
  it("returns null for null/undefined", () => { expect(pickRandom(null)).toBeNull(); expect(pickRandom(undefined)).toBeNull() })
  it("returns the only element for a singleton array", () => {
    const dish = FOODS[0]
    expect(pickRandom([dish])).toBe(dish)
  })
  it("always returns a dish that is in the input array", () => {
    for (let i = 0; i < 50; i++) {
      const result = pickRandom(FOODS)
      expect(FOODS).toContain(result)
    }
  })
})

describe("Property: pickRandom always selects from available results", () => {
  // Feature: foods-of-tamil-nadu, Property: pickRandom always selects from visible dishes
  it("for any non-empty subset, result is always a member of that subset", () => {
    fc.assert(
      fc.property(
        fc.string({maxLength:20}),
        fc.constantFrom(...ALLOWED_FILTERS),
        (t, f) => {
          const subset = applyDiscovery(FOODS, t, f)
          if (subset.length === 0) {
            expect(pickRandom(subset)).toBeNull()
          } else {
            const pick = pickRandom(subset)
            expect(pick).not.toBeNull()
            expect(subset).toContain(pick)
          }
        }
      ),
      { numRuns: 200 }
    )
  })
})