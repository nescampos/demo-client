import Immutable from 'immutable'
import { createSelector } from 'reselect'

import KiltAction from '../../types/Action'
import { ICType, ICTypeWithMetadata } from '../../types/Ctype'
import PersistentStore from '../PersistentStore'
import { State as ReduxState } from '../PersistentStore'

interface AddCTypeAction extends KiltAction {
  payload: ICTypeWithMetadata
}

interface AddCTypesAction extends KiltAction {
  payload: ICTypeWithMetadata[]
}

type Action = AddCTypeAction | AddCTypesAction

type State = {
  cTypes: Immutable.Map<ICType['cType']['hash'], ICTypeWithMetadata>
}

type ImmutableState = Immutable.Record<State>

class Store {
  public static reducer(
    state: ImmutableState = Store.createState(),
    action: Action
  ): ImmutableState {
    switch (action.type) {
      case Store.ACTIONS.ADD_CTYPE: {
        const cType = (action as AddCTypeAction).payload
        const { hash } = cType.cType
        return state.setIn(['cTypes', hash], cType)
      }
      case Store.ACTIONS.ADD_CTYPES: {
        const cTypes = arrayToMap((action as AddCTypesAction).payload)
        const currentCTypes = state.getIn(['cTypes'])
        return state.setIn(['cTypes'], currentCTypes.mergeDeep(cTypes))
      }
      default:
        return state
    }
  }

  public static addCType(cType: ICTypeWithMetadata): AddCTypeAction {
    return {
      payload: cType,
      type: Store.ACTIONS.ADD_CTYPE,
    }
  }

  public static addCTypes(cTypes: ICTypeWithMetadata[]): AddCTypesAction {
    return {
      payload: cTypes,
      type: Store.ACTIONS.ADD_CTYPES,
    }
  }

  public static createState(obj?: State): ImmutableState {
    return Immutable.Record({
      cTypes: Immutable.Map<ICType['cType']['hash'], ICTypeWithMetadata>(),
    } as State)(obj)
  }

  private static ACTIONS = {
    ADD_CTYPE: 'ctypes/ADD_CTYPE',
    ADD_CTYPES: 'ctypes/ADD_CTYPES',
  }
}

const arrayToMap = (
  cTypeArray: ICTypeWithMetadata[]
): Immutable.Map<ICType['cType']['hash'], ICTypeWithMetadata> => {
  const cTypes: { [hash: string]: ICTypeWithMetadata } = {}
  cTypeArray.forEach((cType: ICTypeWithMetadata) => {
    const { hash } = cType.cType
    if (hash) {
      cTypes[hash] = cType
    }
  })
  return Immutable.Map(cTypes)
}

const _getCTypes = (state: ReduxState) => {
  return state.cTypes
    .get('cTypes')
    .toList()
    .toArray()
}

const getCTypes = createSelector(
  [_getCTypes],
  (cTypes: ICTypeWithMetadata[]) => cTypes
)

const _getCType = (state: ReduxState, address: ICType['cType']['hash']) =>
  state.cTypes.get('cTypes').get(address)

const getCType = createSelector(
  [_getCType],
  (cType: ICTypeWithMetadata) => cType
)

export { Store, ImmutableState, Action, getCTypes, getCType }
