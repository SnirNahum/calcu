import AppShell from './components/layout/AppShell'
import ModeTabs from './components/layout/ModeTabs'
import DisplayPanel from './components/display/DisplayPanel'
import Keypad from './components/keypad/Keypad'
import DimensionalMode from './components/modes/DimensionalMode'
import RightAngleMode from './components/modes/RightAngleMode'
import AreaVolumeMode from './components/modes/AreaVolumeMode'
import StairsMode from './components/modes/StairsMode'
import TrigModeInfo from './components/modes/TrigModeInfo'
import CostMode from './components/modes/CostMode'
import SpacingMode from './components/modes/SpacingMode'
import { useCalculatorState } from './hooks/useCalculatorState'

function ModePanel({ state, dispatch }: Parameters<typeof DimensionalMode>[0]) {
  switch (state.mode) {
    case 'dimensional':
      return <DimensionalMode state={state} dispatch={dispatch} />
    case 'right-angle':
      return <RightAngleMode state={state} dispatch={dispatch} />
    case 'area-volume':
      return <AreaVolumeMode state={state} dispatch={dispatch} />
    case 'stairs':
      return <StairsMode />
    case 'trig':
      return <TrigModeInfo angleUnit={state.angleUnit} />
    case 'cost':
      return <CostMode />
    case 'spacing':
      return <SpacingMode state={state} dispatch={dispatch} />
  }
}

export default function App() {
  const { state, dispatch } = useCalculatorState()

  return (
    <AppShell>
      <ModeTabs
        mode={state.mode}
        onChange={(mode) => dispatch({ type: 'SET_MODE', payload: mode })}
      />
      <DisplayPanel state={state} dispatch={dispatch} />
      <ModePanel state={state} dispatch={dispatch} />
      <Keypad dispatch={dispatch} mode={state.mode} angleUnit={state.angleUnit} />
    </AppShell>
  )
}
