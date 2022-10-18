import {
  For,
  Show,
  createSignal,
  createEffect,
  createResource,
  Suspense,
  useTransition
} from "solid-js"
import {
  Title,
  useParams,
  createRouteData,
  useRouteData,
  refetchRouteData,
  RouteDataArgs
} from "solid-start"
import Counter from "~/components/Counter"
import HouseMembers from "../components/HouseMembers"
import { Character } from "../apis/types"

interface RouteData {
  initialCharacters: () => Character[]
}

// called on route change, returns initial values, used for SSR
// returns all characters
export function routeData() {
  const initialCharacters = createRouteData(async () => {
    const response = await fetch("https://hp-api.herokuapp.com/api/characters/")
    return await response.json()
  })
  return { initialCharacters }
}

// called when refetchCharacters is called. Refetching contains filter options
// see fetchData example at https://www.solidjs.com/docs/latest/api#createresource
async function fetchCharacters(source: Character[], { value, refetching }) {
  // first time automatic call by createResource(), take the initial value
  if (refetching === undefined) {
    console.log("initial fetching of characters, using source (= initial value)")
    return source
  }

  // refetching, use the "house" property from the input
  console.log("refetching characters with refetching = " + JSON.stringify(refetching))
  if (refetching.hasOwnProperty("house")) {
    // do another API call to have a delay
    //return source.filter((character) => character.house === value.house)
    const response = await fetch(
      "https://hp-api.herokuapp.com/api/characters/house/" + refetching.house
    )
    const characters = await response.json()
    // just return a random amount of characters to show a change in the length of the list
    return characters.slice(0, Math.floor(Math.random() * characters.length))
  }

  const response = await fetch("https://hp-api.herokuapp.com/api/characters/")
  return await response.json()
  // no house filter so return the initial value (all houses) without an API call
  //return source
}

export default function Home() {
  // get the route data
  const { initialCharacters } = useRouteData<RouteData>()
  // take the initial characters and make them mutable
  const [characters, { mutate, refetch: refetchCharacters }] = createResource<
    Character[],
    any
  >(initialCharacters, fetchCharacters)

  const [isPending, start] = useTransition()

  return (
    <main>
      <Title>Flickering Demo</Title>
      <h2>Counter Rendering Example</h2>
      <Counter />
      <h2 style="margin-top: 50px;">Harry Potter Characters</h2>
      <button class="increment" onClick={() => start(() => refetchCharacters())}>
        all Houses
      </button>
      <button
        class="increment"
        onClick={() => start(() => refetchCharacters({ house: "gryffindor" }))}
      >
        House Gryffindor
      </button>
      <p>transition is pending: {JSON.stringify(isPending())}</p>
      <Suspense fallback={<div>loading characters ...</div>}>
        <p>loaded {characters() === undefined ? 0 : characters().length} characters</p>
        <HouseMembers characters={characters()} />
      </Suspense>
    </main>
  )
}
