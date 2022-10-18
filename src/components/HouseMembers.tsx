import { For, Show, createSignal, createEffect, createResource } from "solid-js"
import { Character } from "../apis/types"

type Props = {
  characters: Character[]
}

export default function HouseMembers(props: Props) {
  return (
    <>
      <ol>
        <For each={props.characters}>
          {character => (
            <li>
              {character.name} is a {character.species} from {character.house}
            </li>
          )}
        </For>
      </ol>
    </>
  )
}
